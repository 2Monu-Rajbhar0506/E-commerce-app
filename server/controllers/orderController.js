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

     const paymentId = `PYD-${new mongoose.Types.ObjectId()}`;

     // build order items snapshot
     //images: el.productId.image,
     const items = list_items.map((el) => ({
       productId: el.productId._id,
       name: el.productId.name,
       images: Array.isArray(el.productId.image)
         ? el.productId.image
         : el.productId.image
         ? [el.productId.image]
         : [],

       quantity: el.quantity,
       priceAtPurchase: el.productId.price,
     }));

     const orderPayload = {
       userId,
       orderId: `ORD-${Date.now()}`,
       items,
       paymentId: paymentId,
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

    //for extra security keep it
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
  return Promise.all(
    lineItems.data.map(async (item) => {
      const stripeProduct = await stripe.products.retrieve(item.price.product);

      const product = await Product.findById(
        stripeProduct.metadata.productId
      ).lean();

      if (!product) {
        return errorResponse("Product not found while creating order");
      }

      return {
        productId: product._id,
        name: product.name,

        // ✅ ALWAYS ARRAY (matches schema & COD flow)
        images: Array.isArray(product.image)
          ? product.image
          : product.image
          ? [product.image]
          : [],

        quantity: item.quantity || 1,
        priceAtPurchase: item.amount_total / 100,
      };
    })
  );
};




export const webhookStripe = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY;

  let event;

  // Verify Stripe signature (RAW BODY REQUIRED)
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("Stripe signature verification failed:", err.message);
    return errorResponse(res, `Webhook Error: ${err.message}`, 400);
  }

  try {
    // Checkout completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      //  Always ObjectId
      const userId = new mongoose.Types.ObjectId(session.metadata.userId);

      // Idempotency check
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

      //Fetch line items from Stripe
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      /**
       * buildOrderItems(lineItems)
       * should internally use Product model
       * to resolve productId, name, price, quantity
       */
      const items = await buildOrderItems(lineItems);

      // Create order
      const createdOrder = await Order.create({
        userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        paymentId: session.payment_intent,
        payment_status: mapStripePaymentStatus(session.payment_status),
        delivery_address: session.metadata.addressId,
        items,
        subTotalAmt: session.amount_subtotal / 100,
        totalAmt: session.amount_total / 100,
      });

      // Clear cart + update user
      await Promise.all([
        User.findByIdAndUpdate(userId, {
          $push: { orderHistory: createdOrder._id },
          $set: { shopping_cart: [] },
        }),

        // backward compatible delete (string + ObjectId)
        CartProduct.deleteMany({
          $or: [{ userId: userId }, { userId: userId.toString() }],
        }),
      ]);
    }

    // Refund handling
    if (event.type === "charge.refunded") {
      const charge = event.data.object;

      await Order.updateOne(
        { paymentId: charge.payment_intent },
        { payment_status: "REFUNDED" }
      );
    }

    //ALWAYS acknowledge Stripe
    return successResponse(res, "Webhook processed", { received: true }, 200);
  } catch (err) {
    console.error(" Webhook processing error:", err);
    return errorResponse(res, "Webhook processing failed", 500);
  }
};



export const getOrderDetailsController = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized", 401);
    }

    const orders = await Order.find({
      userId,
      delivery_status: { $ne: "CANCELLED" }, //exclude cancelled orders
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "delivery_address",
        select: "address_line city state pincode country",
      })
      .lean();

    return successResponse(res, "Order list fetched successfully", orders, 200);
  } catch (error) {
    console.error("Get order details error:", error);
    return errorResponse(res, error.message || "Failed to fetch orders", 500);
  }
};


export const cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id: orderId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return errorResponse(res, "Unauthorized user", 401);
    }

    // if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
    //   return errorResponse(res, "Invalid order id", 400);
    // }

    // Find order belonging to user
    const order = await Order.findOne({
      _id: orderId,
      userId,
    });

    if (!order) {
      return errorResponse(res, "Order not found", 404);
    }

    // Prevent cancelling delivered orders
    if (order.delivery_status === "DELIVERED") {
      return errorResponse(res, "Delivered orders cannot be cancelled", 400);
    }

    // Update status instead of deleting
    order.delivery_status = "CANCELLED";
    order.payment_status =
      order.payment_status === "SUCCESS" ? "REFUNDED" : "CANCELLED";

    await order.save();

    return successResponse(
      res,
      "Your order has been cancelled successfully",
      order,
      200
    );
  } catch (error) {
    console.error("Cancel order error:", error);
    return errorResponse(res, error.message || "Failed to cancel order", 500);
  }
};










