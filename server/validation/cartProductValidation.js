import { z } from "zod";
import mongoose from "mongoose";


// mongoDB objectId validator
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

// Quantity validator
const quantitySchema = z
  .number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  })
  .int()
  .min(0, "Quantity must be >= 0");


export const addToCartSchema = z.object({
  productId: objectIdSchema,
});


export const updateCartQtySchema = z.object({
  _id: objectIdSchema,
  qty: quantitySchema,
});


export const incrementCartQtySchema = z.object({
  _id: objectIdSchema,
});


export const decrementCartQtySchema = z.object({
  _id: objectIdSchema,
});
