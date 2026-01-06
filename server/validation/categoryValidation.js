import { z } from "zod";
import mongoose from "mongoose";


const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid Category ID",
  });



export const addCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .trim()
    .min(1, "Category name cannot be empty")
    .transform((val) => val.toLowerCase()), // normalize here 🔥

  image: z
    .string({ required_error: "Category image is required" })
    .trim()
    .min(1, "Category image cannot be empty"),
});



export const updateCategorySchema = z.object({
  _id: objectIdSchema,

  name: z
    .string()
    .trim()
    .min(1, "Category name cannot be empty")
    .transform((val) => val.toLowerCase())
    .optional(),

  image: z.string().trim().min(1, "Category image cannot be empty").optional(),
});



export const deleteCategorySchema = z.object({
  _id: objectIdSchema,
});
