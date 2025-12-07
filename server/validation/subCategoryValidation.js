import { z } from "zod";
import mongoose from "mongoose";

const objectIdSchema = z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), { message: "Invalid category ID," });

export const AddSubCategorySchema = z.object({
    name: z
        .string({ required_error: "Name is required" })
        .trim()
        .min(1, "Name cannot be empty"),
    
    image: z
        .string({ required_error: "Image is required" })
        .min(1, "Image cannot be empty"),
    
    categories: z
        .array(objectIdSchema, {
        required_error:"Categories must be an array"
        })
        .min(1, "At least one category is required")
    
})

export const updateSubCategorySchema = z.object({
    _id: objectIdSchema,
    name: z.string().trim().min(1).optional(),
    image: z.string().trim().min(1).optional(),
    categories: z.array(objectIdSchema).min(1).optional(),
});

export const deleteSubCategorySchema = z.object({
    _id: objectIdSchema
});