import { z } from "zod";
import mongoose from "mongoose";


//helpers
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const quantitySchema = z.coerce.number().int().min(1);


//cod
export const cashOnDeliverySchema = z.object({
  list_items: z
    .array(
      z.object({
        productId: z.object({
          _id: objectIdSchema,
          name: z.string().min(1),
          image: z.array(z.string()).optional(),
          price: z.coerce.number().min(0), 
        }),
        quantity: quantitySchema,
      })
    )
    .min(1),

  subTotalAmt: z.coerce.number().min(0),
  totalAmt: z.coerce.number().min(0),
  addressId: objectIdSchema,
});


//online pay
export const stripePaymentSchema = z.object({
  list_items: z
    .array(
      z.object({
        productId: z.object({
          _id: objectIdSchema,
        }),
        quantity: quantitySchema,
      })
    )
    .min(1),

  addressId: objectIdSchema,
});


//cancel order
export const cancelOrderSchema = z.object({
  _id: objectIdSchema,
});
