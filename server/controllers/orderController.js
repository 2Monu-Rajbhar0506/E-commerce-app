import Order from "../models/orderModel.js";
import mongoose from "mongoose";
import { errorResponse, successResponse } from "../utils/response.js";
import User from "../models/userModel.js";
import CartProduct from "../models/cartProductModel.js"
import Product from "../models/productModel.js"
import stripe from "../config/stripe.js";


export const CashOnDeliveryOrderController = async (req, res) => {
   try {
     const userId = req.userId;
     const { list_items, totalAmt, subTotalAmt, addressId } = req.body;

     if (!list_items || list_items.length === 0) {
       return errorResponse(res, "Cart is empty", 400);
     }

     // build order items snapshot
     const items = list_items.map((el) => ({
       productId: el.productId._id,
       name: el.productId.name,
       images: el.productId.image,
       quantity: el.quantity,
       priceAtPurchase: el.productId.price,
     }));

     const orderPayload = {
       userId,
       orderId: `ORD-${Date.now()}`,
       items,
       paymentId: "",
       payment_status: "PENDING",
       delivery_address: addressId,
       delivery_status: "PLACED",
       subTotalAmt,
       totalAmt,
     };

     const createdOrder = await Order.create(orderPayload);

     // Clear cart after successful order
     await CartProduct.deleteMany({ userId });
     await User.updateOne({ _id: userId }, { $set: { shopping_cart: [] } });

     return successResponse(
       res,
       "Order placed successfully",
       createdOrder,
       201
     );
   } catch (error) {
     console.error("cash on delivery controller error: ",error.message || "Order failed");
     return errorResponse(res, error.message || "Order failed", 500);
   }
};


export const paymentController = async (req, res) => {
  try {
    const userId = req.userId;
    const { list_items, addressId } = req.body;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    if (!Array.isArray(list_items) || list_items.length === 0) {
      return errorResponse(res, "Cart is empty", 400);
    }

    if (!addressId) {
      return errorResponse(res, "Address is required", 400);
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    const line_items = await Promise.all(
      list_items.map(async (item) => {
        const product = await Product.findById(item.productId._id).lean();

        if (!product || product.isDeleted) {
          throw new Error("Product not available");
        }

        // Handle NULL discount safely
        const discount = Number(product.discount) || 0;

        const finalPrice =
          discount > 0
            ? Math.round(product.price - (product.price * discount) / 100)
            : product.price;

        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
              images: Array.isArray(product.image) ? product.image : [],
              metadata: {
                productId: product._id.toString(),
                unit: product.unit,
              },
            },
            unit_amount: finalPrice * 100, // paise
          },
          quantity: item.quantity > 0 ? item.quantity : 1,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      submit_type: "pay",
      payment_method_types: ["card"],
      customer_email: user.email,

      client_reference_id: userId,

      metadata: {
        userId,
        addressId,
      },

      line_items,

      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    return successResponse(res, "Stripe session created", session, 200);
  } catch (error) {
    console.error("Payment Controller Error:", error?.message || error);
    return errorResponse(res, error.message || "Payment failed", 500);
  }
};


// Convert Stripe payment status → internal DB status
const mapStripePaymentStatus = (stripeStatus) => {
  switch (stripeStatus) {
    case "paid":
      return "SUCCESS";
    case "unpaid":
      return "PENDING";
    default:
      return "FAILED";
  }
};

const buildOrderItems = async (lineItems) => {
  const products = await Promise.all(
    lineItems.data.map((item) => stripe.products.retrieve(item.price.product))
  );

  return lineItems.data.map((item, index) => {
    const product = products[index];

    return {
      productId: product.metadata.productId,
      name: product.name,
      image: product.images?.[0] || null,
      quantity: item.quantity || 1,
      priceAtPurchase: item.amount_total / 100,
    };
  });
};


export const webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  //Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error.message);
    return errorResponse(res, `Webhook Error: ${error.message}`, 400);
  }

  try {
    //Handle only the required event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      //Idempotency check (CRITICAL)
      const alreadyExists = await Order.findOne({
        paymentId: session.payment_intent,
      });

      if (alreadyExists) {
        return successResponse(
          res,
          "Duplicate webhook ignored",
          { received: true },
          200
        );
      }

      //Fetch line items
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );
      //console.log(lineItems);

      const items = await buildOrderItems(lineItems);

      // Create ONE order document
     const createdOrder = await Order.create({
       userId: session.metadata.userId,
       orderId: `ORD-${new mongoose.Types.ObjectId()}`,
       paymentId: session.payment_intent,
       payment_status: mapStripePaymentStatus(session.payment_status),
       delivery_address: session.metadata.addressId,
       items,
       subTotalAmt: session.amount_subtotal / 100,
       totalAmt: session.amount_total / 100,
     });

      // Clear cart
      await Promise.all([
        User.findByIdAndUpdate(session.metadata.userId, {
          $push: { orderHistory: createdOrder._id },
        }),

        User.findByIdAndUpdate(session.metadata.userId, {
          shopping_cart: [],
        }),
        CartProduct.deleteMany({
          userId: session.metadata.userId,
        }),
      ]);
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object;

      await Order.updateOne(
        { paymentId: charge.payment_intent },
        { payment_status: "REFUNDED" }
      );
    }


    // Always acknowledge Stripe
    return successResponse(res, "Webhook processed", { received: true }, 200);
  } catch (error) {
     console.error("Webhook processing error:", error);
     return errorResponse(res, `Webhook failed: ${error.message}`, 500);
  }
};


export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "delivery_address",
        select: "addressLine city state pincode country",
      })
      .lean(); // faster & memory-efficient

    return successResponse(res, "Order list fetched successfully", orders, 200);
  } catch (error) {
    console.error("Get order details error:", error);
    return errorResponse(res, error.message || "Failed to fetch orders", 500);
  }
};












