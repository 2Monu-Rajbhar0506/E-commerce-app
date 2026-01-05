import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import sendEmail from "../config/sendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmailTemplate.js";
import crypto from "crypto";
import { generateTokens } from "../utils/generateTokens.js";
import uploadImageCloudinary from "../utils/UploadImageCloudinary.js";
import { v2 as cloudinary } from "cloudinary";
import { generateHashedOtp } from "../utils/generateOtp.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import jwt from "jsonwebtoken";
import { errorResponse, successResponse } from "../utils/response.js";

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, "User already registered", 400);
    }

   
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

      //create secure random token 
      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    
    // Create user payload
    const payload = {
      name,
      email,
      password: hashPassword,
      verifyEmailToken: hashedToken,
      verifyEmailExpireAt: Date.now() + 1000 * 60 * 10, //10 min
    };

  
    const newUser = new User(payload);
    const savedUser = await newUser.save();

   
    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/dashboard/verify-email?token=${token}`;

 
    await sendEmail({
      sendTo: email,
      subject: "Verify your email",
      html: verifyEmailTemplate({
        name,
        url: VerifyEmailUrl,
      }),
    });

    return successResponse(
      res,
      "User registered successfully,Check your email for verification link.",
      savedUser,
      201
    );
  } catch (error) {
    console.error("Register user error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

export async function verifyEmail(req, res) {
    try {
        const { token } = req.body;
        
        //hash the token using same sha256 algo
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex")
        
        //find the user using hashedToken
        const user = await User.findOne({
            verifyEmailToken: hashedToken,
            verifyEmailExpireAt: { $gt: Date.now() }
        });

        if (!user) {
          return errorResponse(res, "Invalid or expired token", 400);
        }
        
        user.verify_email = true;
        user.verifyEmailToken = null;
        user.verifyEmailExpireAt = null;

        await user.save();

        return successResponse(res, "Email verified successfully", 200);

    } catch (error) {
      console.error("verify user email error:", error);
      return errorResponse(res, error.message || "Internal server error", 500);
    }
}


export async function resendVerifyEmailController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (user.verify_email) {
      return errorResponse(res, "Email already verified", 400);
    }

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    user.verifyEmailToken = hashedToken;
    user.verifyEmailExpireAt = Date.now() + 1000 * 60 * 10; // 10 min

    await user.save();

    const VerifyEmailUrl = `${process.env.FRONTEND_URL}/dashboard/verify-email?token=${token}`;

    await sendEmail({
      sendTo: email,
      subject: "Resend Verification Link",
      html: verifyEmailTemplate({
        name: user.name,
        url: VerifyEmailUrl,
      }),
    });

    return successResponse(res, "Verification email resent", 200);

  } catch (error) {
    console.error(" resend verify user email error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    //fetch only needed fields
    const user = await User.findOne({ email }).select(
      "-forgot_password_otp -forgot_password_expiry -verifyEmailToken -verifyEmailExpireAt "
    );

    
    if (!user) {
      return errorResponse(res, "User not registered", 400);
    }

    // Block until email is verified
    /*if (!user.verify_email) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
        success: false,
        error: true,
        needVerification: true,
      });
    }*/

    // block inactive users
    if (user.status !== "Active") {
      return errorResponse(res, "Your account is not active. Contact to admin", 403);
    }

    const PasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!PasswordCorrect) {
      return errorResponse(res, "Invalid password", 400);
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    //update the last login date and refresh token in database
    // await User.findByIdAndUpdate(user._id, {
    //   last_login_date: new Date(),
    //   refresh_token: refreshToken,
    // });

    user.last_login_date = new Date();
    user.refresh_token = refreshToken;
    await user.save();


   

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", //cookie will work across entire app
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return successResponse(
      res,
      "Login successful",
      {
        user,
        accessToken,
        refreshToken,
      },
      200
    );

  } catch (error) {
    console.error("login controller error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId;
  
    if (!userId) {
      return errorResponse(res, "User not logged in", 401);
    }
  
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/"
    }
  
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
  
    //Remove refresh token from database
    await User.findByIdAndUpdate(userId, { refresh_token: "" }, { new: true });
  
    return successResponse(res, "Logout successfull", 200);

  } catch (error) {
    console.error("Logout controller error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

//upload user avatar
export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;

    if (!image) {
      return errorResponse(res, "No image provided", 400);
    }


    const upload = await uploadImageCloudinary(image);

    if (!upload || !upload.secure_url) {
      return errorResponse(res, "image upload failed", 500);
    }

 
    const user = await User.findById(userId);

    //delete the old avatar
    if (user?.avatar) {
      const oldPublicImageId = user.avatar.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`Commerce/${oldPublicImageId}`);
    }

    //update new avatar
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: upload.secure_url },
      { new: true }
    );

    return successResponse(
      res,
      "Profile picture uploaded",
      {
      _id: updatedUser._id,
      avatar: updatedUser.avatar,
      },
      200
    );

  } catch (error) {
    console.error("Upload Avatar Image Error:", error);
    return errorResponse(res, error.message || error, 500);
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    //prevent updating of the duplicate emails, means each user has uniques emails
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return errorResponse(res, "Email already in use", 400);
      }
    }

    //hash the password if provided
    let hashPassword = undefined;
    if (password && password.trim().length > 0) {
      const salt = await bcryptjs.genSalt(10);
      hashPassword = await bcryptjs.hash(password, salt);
    }

    //update objects (if provided then update it, if not provided then ignore it)
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(mobile && { mobile }),
      ...(hashPassword && { password: hashPassword }),
    };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true },
    ).select("-password -refresh_token");


    return successResponse(res, "Updated successfully", updatedUser, 200);

  } catch (error) {
    console.error("Update user controller error", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}


export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "user not found", 400);
    }

    // generate OTP + hash version
    const { otp, hashedOtp } = generateHashedOtp();
    

    // expire time (1 hour)
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);

    //update user document
      await User.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: hashedOtp,
        forgot_password_expiry: expireTime,
      },
      { new: true },
      { runValidators: true },
    );
   

    // send email to user with otp
    await sendEmail({
      sendTo: email,
      subject: "Reset your password",
      html: forgotPasswordTemplate({
        name: user.name,
        otp,
      }),
    });

    return successResponse(res, "OTP has been sent to your email", 200);
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}


export async function resendForgotPasswordOtp(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Email not found", 400);
    }

    // generate new OTP + hashed otp
    const { otp, hashedOtp } = generateHashedOtp();

    // set new expiry (1 hour)
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);

    // update user otp data
    await User.findByIdAndUpdate(
      user._id,
      {
        forgot_password_otp: hashedOtp,
        forgot_password_expiry: expireTime,
      },
      { new: true }
    );

    // send otp email
    await sendEmail({
      sendTo: email,
      subject: "Your OTP Code",
      html: forgotPasswordTemplate({
        name: user.name,
        otp,
      }),
    });

    return successResponse(res, "New OTP has been sent to your email", 200);
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}


export async function verifyForgotPassword(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
 
    if (!user) {
      return errorResponse(res, "Email not found.", 400);
    }

    //check expiry
    if (!user.forgot_password_expiry || !user.forgot_password_otp) {
        return errorResponse(res, "OTP not generated for this email.", 400);
    }

    const currentTime = new Date();
    const expiryTime = new Date(user.forgot_password_expiry);

    if (currentTime > expiryTime) {
      return errorResponse(res, "OTP has expired", 400);
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");
  
    //comparing the hashed values
    if (hashedOtp !== user.forgot_password_otp) {
      return errorResponse(res, "Invalid OTP", 400);
    }

    //if otp is correct then clear the fields
    await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: null,
      forgot_password_expiry: null,
    });

    return successResponse(res, "OTP verified successfully.", 200);

  } catch (error) {
    console.error("verify Forgot Password controller:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, "Email is not available.", 400);
    }

    if (newPassword !== confirmPassword) {
      return errorResponse(res, "newPassword and confirmPassword must be the same.", 400);
    }

    //check otp is verified before password reset
    if (user.forgot_password_otp || user.forgot_password_expiry) {
      return errorResponse(res, "OTP verification required before restting password.", 400);
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    );

    return successResponse(res, "Password updated successfully.", 200);

  } catch (error) {
    console.error("reset password controller error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

//generate new tokens
export async function refreshToken(req, res) {
  try {

    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const oldRefreshToken = req?.cookies?.refreshToken || tokenFromHeader;

    if (!oldRefreshToken) {
      return errorResponse(res, "Missing refresh token", 401);
    }

    let decodedToken;
    try {

      decodedToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    } catch (error) {
      return errorResponse(res, "Invalid or expired refresh token", 401);
    }

    const userId = decodedToken?.userId;

    //verify refresh token exists in DB
    const user = await User.findById(userId);

    if (!user || user.refresh_token !== oldRefreshToken) {
      return errorResponse(res, "Refresh token is not valid anymore", 401);
    }

    //generate new tokens
    const { accessToken, refreshToken } = generateTokens(userId);

    user.refresh_token = refreshToken;
    await user.save();

    const accessCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1000 * 60 * 15, // 15 minutes
    };

    const refreshCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };


    res.cookie("accessToken", accessToken, accessCookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    return successResponse(
      res,
      "New access & refresh tokens generated",
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
      },
      200
    );

  } catch (error) {
    console.error("refresh token controller error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}

//get the user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized: userId not found", 401);
    }

    const user = await User.findById(userId).select(" -password -refresh_token -forgot_password_otp -forgot_password_expiry -verifyEmailExpireAt -verifyEmailToken ")

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, "User details fetched successfully", user, 200);
  } catch (error) {
    console.error("user details controller error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
}







