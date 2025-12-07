import { z } from "zod";

export const updateCategorySchema = z.object({
    _id: z.string().min(1, "Category ID is required"),
    name: z.string().min(2, "Name must be at least 2 charecters"),
    image: z.url("Image must be a valid url"),
});