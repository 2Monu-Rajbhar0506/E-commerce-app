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
            cartItem,
            201,
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


