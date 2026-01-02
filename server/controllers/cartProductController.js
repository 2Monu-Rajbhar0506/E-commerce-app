import CartProduct from "../models/cartProductModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";
import { errorResponse, successResponse } from "../utils/response.js";


export const addToCartItemController = async (req, res) => {
    try {
        
        const userId = req.userId;
        const { productId } = req.body;

        //validations
        if (!userId) {
            return errorResponse(res, "Unauthorized", 401);
        }

        if (!productId) {
            return errorResponse(res, "Product ID is required", 400);
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return errorResponse(res, "Invalid Product ID", 400);
        }

        //check existing cart item
        const existingCartItem = await CartProduct.findOne({
          userId,
          productId,
        }).lean();

        if (existingCartItem) {
            return errorResponse(res, "Item already exists in cart", 409);
        }

        //create cart item
        const cartItem = await CartProduct.create({
          productId,
          userId,
          quantity: 1,
        });

        const populatedItem = await CartProduct.findById(cartItem._id).populate("productId");
      
        //update user cart
        await User.findByIdAndUpdate(
          userId,
          { $addToSet: { shopping_cart: productId } }, // prevents duplicates
          { new: true }
        );

        //send success response
        return successResponse(
          res,
          "Item added to cart successfully",
          { cartItem, populatedItem },
          201
        );

    } catch (error) {
        console.error("addToCartItemController error:", error);
        return errorResponse(res, "Internal Server Error", 500);
    }
}

export const getCartItemController = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return errorResponse(res, "Unauthorized User", 401);
        }

        const cartItems = await CartProduct.find({ userId })
          .populate({
            path: "productId",
            select: "name price images discount stock",
          })
          .sort({ createdAt: -1 })
            .lean();
        
        return successResponse(
            res,
            "cart items fetched successfully",
            cartItems,
            200
        );
          
    } catch (error) {
        console.error("Get Cart Items Error :", error);
        return errorResponse(res, "Internal server error", 500);
    }
}

//This single controller can handle BOTH update and delete.
export const updateCartItemQtyController = async (req, res) => {
    try {
      const userId = req.userId;
      const { _id, qty } = req.body;

      if (!userId) {
        return errorResponse(res, "Unauthorized User", 401);
      }

      if (!_id || typeof qty !== "number" || qty < 0) {
        return errorResponse(
          res,
          "Provide valid _id and qty (qty must be >= 1)",
          400
        );
      }

      // If qty = 0 → remove item
      if (qty === 0) {
        await CartProduct.deleteOne({ _id, userId });
        return successResponse(res, "Cart item removed", null, 200);
      }

      const updateCartItem = await CartProduct.findOneAndUpdate(
        { _id, userId },
        { quantity: qty },
        { new: true }
      ).populate("productId");

      if (!updateCartItem) {
        return errorResponse(res, "Cart item not found", 404);
      }

      return successResponse(
        res,
        "Item added successfully",
        updateCartItem,
        200
      );
    } catch (error) {
        console.error("Update cart Qty Error:", error);
        return errorResponse(res, "Internal server error", 500);
    }
}


export const incrementCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    //console.log(_id);
    

    if (!userId) {
      return errorResponse(res, "Unauthorized user", 401);
    }

    if (!_id) {
      return errorResponse(res, "Provide cart item _id", 400);
    }

    const updatedCartItem = await CartProduct.findOneAndUpdate(
      { _id, userId },
      { $inc: { quantity: 1 } },
      { new: true }
    ).populate("productId");

    if (!updatedCartItem) {
      return errorResponse(res, "Cart item not found", 407);
    }

    return successResponse(
      res,
      "Cart quantity increased",
      updatedCartItem,
      200
    );
  } catch (error) {
    console.error("Increment Qty Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};


export const decrementCartItemQtyController = async (req, res) => {
  try {
    const userId = req.userId;
    const { _id } = req.body;

    if (!userId) {
      return errorResponse(res, "Unauthorized user", 401);
    }

    if (!_id) {
      return errorResponse(res, "Provide cart item _id", 400);
    }

    const cartItem = await CartProduct.findOne({ _id, userId });

    if (!cartItem) {
      return errorResponse(res, "Cart item not found", 404);
    }

    // If quantity = 1 → delete item
    if (cartItem.quantity === 1) {
      await CartProduct.deleteOne({ _id, userId });
      return successResponse(res, "Cart item removed", null, 200);
    }

    // Else decrement
    const updatedCartItem = await CartProduct.findOneAndUpdate(
      { _id, userId },
      { $inc: { quantity: -1 } },
      { new: true }
    ).populate("productId");

    return successResponse(
      res,
      "Cart quantity decreased",
      updatedCartItem,
      200
    );
  } catch (error) {
    console.error("Decrement Qty Error:", error);
    return errorResponse(res, "Internal server error", 500);
  }
};


