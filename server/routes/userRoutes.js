import { Router } from 'express';

const userRouter = Router();

import { forgotPasswordController, loginController, logoutController, refreshToken, registerUser, resendForgotPasswordOtp, resendVerifyEmailController, resetPassword, updateUserDetails, uploadAvatar, userDetails, verifyEmail, verifyForgotPassword } from "../controllers/userController.js";
import { authUser } from '../middleware/authUser.js';
import { uploadSingle } from '../middleware/multer.js';

userRouter.post("/register", registerUser);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/resend-email-verify", resendVerifyEmailController);
userRouter.post("/login", loginController);
userRouter.post("/logout", authUser, logoutController);
userRouter.put("/upload-avatar", authUser, uploadSingle("image"), uploadAvatar);
userRouter.put("/update-user", authUser, updateUserDetails);
userRouter.post("/forgot-password-otp", forgotPasswordController);
userRouter.post("/verify-Otp", verifyForgotPassword);
userRouter.post("/reset-password", resetPassword);
userRouter.post("/refresh-token", refreshToken);
userRouter.get("/user-details", authUser, userDetails);
userRouter.post("/resend-forgot-password-otp", resendForgotPasswordOtp);

export default userRouter;