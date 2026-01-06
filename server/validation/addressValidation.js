import { z } from "zod";
import mongoose from "mongoose";


//helpers
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });

const pincodeSchema = z.string().regex(/^\d{6}$/, "Invalid pincode");

const mobileSchema = z.string().regex(/^[6-9]\d{9}$/, "Invalid mobile number");


export const addAddressSchema = z.object({
  address_line: z.string().trim().min(1, "Address line is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  pincode: pincodeSchema,
  mobile: mobileSchema,
  is_active: z.boolean().optional(),
});


export const updateAddressSchema = z.object({
  _id: objectIdSchema,

  address_line: z.string().trim().min(1, "Address line is required"),
  city: z.string().trim().min(1, "City is required"),
  state: z.string().trim().min(1, "State is required"),
  country: z.string().trim().min(1, "Country is required"),
  pincode: pincodeSchema,
  mobile: mobileSchema,
  is_active: z.boolean().optional(),
});


export const deleteAddressSchema = z.object({
  _id: objectIdSchema,
});
