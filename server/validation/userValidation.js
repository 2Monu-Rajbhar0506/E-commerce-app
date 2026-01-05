import { z } from "zod";

export const registerUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "Invalid email address",
      }),

    password: z
      .string()
      .min(8)
      .max(32)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Password must contain uppercase, lowercase, number and special character"
      ),
  }),
});



export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: "Invalid email address",
    }),

  password: z.string().min(6, "Password must be at least 6 characters"),
});



export const updateUserSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z
        .string()
        .trim()
        .refine(
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            "Invalid email address"
        )
        .optional(),
    mobile: z.string().min(8).max(15).optional(),
    password: z.string().min(6).optional(),
});



export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email address"
    ),
});



export const resendForgotPasswordSchema = forgotPasswordSchema;




export const verifyForgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .refine(
      (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
      "Invalid email address"
    ),
  otp: z.string().min(6, "OTP is required"),
});




export const resetPasswordSchema = z
  .object({
    email: z
      .string()
      .trim()
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email address"
      ),
    newPassword: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });




  export const verifyEmailSchema = z.object({
    token: z.string().min(10, "Invalid verification token"),
  });




  export const resendVerifyEmailSchema = z.object({
    email: z
      .string()
      .trim()
      .refine(
        (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        "Invalid email address"
      ),
  });


