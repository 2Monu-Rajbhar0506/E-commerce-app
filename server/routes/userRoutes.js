import { Router } from 'express';

const userRouter = Router();

import { forgotPasswordController, loginController, logoutController, refreshToken, registerUser, resendForgotPasswordOtp, resendVerifyEmailController, resetPassword, updateUserDetails, uploadAvatar, userDetails, verifyEmail, verifyForgotPassword } from "../controllers/userController.js";
import { authUser } from '../middleware/authUser.js';
import { uploadSingle } from '../middleware/multer.js';
import { forgotPasswordSchema, loginSchema, registerUserSchema, resendForgotPasswordSchema, resetPasswordSchema, updateUserSchema, verifyForgotPasswordSchema } from '../validation/userValidation.js';
import { validate } from "../middleware/zodValidation.js";

userRouter.post("/register",validate(registerUserSchema), registerUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-email-verify", resendVerifyEmailController);
userRouter.post("/login", validate(loginSchema), loginController);
userRouter.post("/logout", authUser, logoutController);
userRouter.put("/upload-avatar", authUser, uploadSingle("image"), uploadAvatar);
userRouter.put("/update-user", authUser, validate(updateUserSchema),updateUserDetails);
userRouter.post("/forgot-password-otp", validate(forgotPasswordSchema),forgotPasswordController);
userRouter.post("/verify-Otp", validate(verifyForgotPasswordSchema),verifyForgotPassword);
userRouter.post("/reset-password", validate(resetPasswordSchema),resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", authUser, userDetails);
userRouter.post("/resend-forgot-password-otp", validate(resendForgotPasswordSchema),resendForgotPasswordOtp);

export default userRouter;