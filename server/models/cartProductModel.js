import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate cart items per user
cartProductSchema.index({ userId: 1, productId: 1 }, { unique: true });

const CartProduct = mongoose.model("CartProduct", cartProductSchema);
export default CartProduct;
