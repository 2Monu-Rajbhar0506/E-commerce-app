//import { z } from "zod";

/*
export const createProductSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, "Product name is required"),

      image: z
        .array(z.string().url("Invalid image URL"))
        .min(1, "At least one image is required"),

      category: z.array(z.string().trim()).min(1, "Category is required"),

      subCategory: z
        .array(z.string().trim())
        .min(1, "Sub-category is required"),

      unit: z.string().trim().min(1, "Unit is required"),

      stock: z.coerce
        .number()
        .int()
        .min(0, "Stock cannot be negative")
        .optional(),

      price: z.coerce.number().min(0, "Price must be >= 0"),

      discount: z.coerce
        .number()
        .min(0, "Discount cannot be negative")
        .max(100, "Discount cannot exceed 100%")
        .optional(),

      description: z.string().trim().min(1, "Description is required"),

      more_details: z
        .record(
          z.string().min(1),
          z.union([z.string(), z.number(), z.boolean()])
        )
        .optional()
        .default({}),
    })
    .refine((data) => !data.discount || data.discount <= data.price, {
      message: "Discount cannot be greater than price",
      path: ["discount"],
    })

    .strict(),
});*/



import { z } from "zod";
import mongoose from "mongoose";

export const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

export const paginationSchema = {
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
};



export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),

  image: z.array(z.string()).min(1, "At least one image is required"),

  category: z.array(objectIdSchema).min(1, "Category is required"),

  subCategory: z.array(objectIdSchema).min(1, "SubCategory is required"),

  unit: z.string().trim().min(1, "Unit is required"),

  stock: z.coerce.number().min(0).optional(),

  price: z.coerce.number().min(0, "Price must be >= 0"),

  discount: z.coerce.number().min(0).optional(),

  description: z.string().trim().min(1, "Description is required"),

  more_details: z.record(z.any()).optional(),
});



export const getProductByCategorySchema = z.object({
  categoryId: objectIdSchema,
  limit: z.coerce.number().min(1).max(50).optional(),
});


export const getProductByCategoryAndSubCategorySchema = z.object({
  categoryId: objectIdSchema,
  subCategoryId: objectIdSchema,
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});


export const updateProductSchema = z.object({
  name: z.string().trim().min(1).optional(),

  image: z.array(z.string().min(1)).optional(),

  category: z.array(objectIdSchema).min(1).optional(),

  subCategory: z.array(objectIdSchema).min(1).optional(),

  unit: z.string().trim().min(1).optional(),

  stock: z.coerce.number().min(0).optional(),

  price: z.coerce.number().min(0).optional(),

  discount: z.coerce.number().min(0).optional(),

  description: z.string().trim().min(1).optional(),

  more_details: z.record(z.any()).optional(),
});
