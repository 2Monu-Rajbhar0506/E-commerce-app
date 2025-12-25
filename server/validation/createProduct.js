import { z } from "zod";

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

      more_details: z.record(z.unknown()).optional(),
    })
    .refine((data) => !data.discount || data.discount <= data.price, {
      message: "Discount cannot be greater than price",
      path: ["discount"],
    })

    .strict(),
});
