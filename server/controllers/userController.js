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

export async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Provide email, name, and password",
        error: true,
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
        error: true,
        success: false,
      });
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

    return res.status(201).json({
      message: "User registered successfully,Check your email for verification link.",
      error: false,
      success: true,
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
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
            return res.status(400).json({
                message: "Invalid or expired token",
                error: true,
                success: false
            })
        }
        
        user.verify_email = true;
        user.verifyEmailToken = "";
        user.verifyEmailExpireAt = "";

        await user.save();

        return res.json({
            message: "Email verified successfully",
            success: true,
            error:false
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        })
    }
}


export async function resendVerifyEmailController(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.verify_email) {
      return res.status(400).json({
        message: "Email already verified",
        error: true,
        success: false,
      });
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

    return res.json({
      message: "Verification email resent",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function loginController(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Provide email and password",
        success: false,
        error: true,
      });
    }

    //fetch only needed fields
    const user = await User.findOne({ email }).select(
      " -forgot_password_otp -forgot_password_expiry -verifyEmailToken -verifyEmailExpireAt "
    );


    

    if (!user) {
      return res.status(400).json({
        message: "User not registered",
        success: false,
        error: true,
      });
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
      return res.status(403).json({
        message: "Your account is not active. Contact to admin",
        success: false,
        error: true,
      });
    }

    const PasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!PasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
        success: false,
        error: true,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);

    //update the last login date and refresh token in database
    const resp = await User.findByIdAndUpdate(user._id, {
      last_login_date: new Date(),
      refresh_token: refreshToken,
    });

   
    

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/", //cookie will work across entire app
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.json({
      message: "Login successfull",
      success: true,
      error: false,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true
    })
  }
}

export async function logoutController(req, res) {
  try {
    const userId = req.userId;
  
    if (!userId) {
      return res.status(401).json({
        message: "User not logged in",
        success: false,
        error: true
      });
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
  
    return res.json({
      message: "Logout successfull",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}

//upload user avatar
export async function uploadAvatar(req, res) {
  try {
    const userId = req.userId;
    const image = req.file;

    if (!image) {
      return res.status(400).json({
        message: "No image provided",
        success: false,
        error: true
      }); 
    }


    const upload = await uploadImageCloudinary(image);

    if (!upload || !upload.secure_url) {
      return res.status(500).json({
        message: "image upload failed",
        success: false,
        error: true
      });
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

    return res.json({
      message: "Profile picture uploaded",
      success: true,
      error: false,
      data: {
        _id: updatedUser._id,
        avatar: updatedUser.avatar,
      },
    });



  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const userId = req.userId;
    const { name, email, mobile, password } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        error: true,
      });
    }

    console.log(user.email);
    

    //prevent updating of the duplicate emails, means each user has uniques emails
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });

      console.log(emailExists);
      

      if (emailExists) {
        return res.status(400).json({
          message: "Email already in use",
          success: true,
          error: true
        });
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

    return res.json({
      message: "Updated successfully",
      success: true,
      error: false,
      data: updatedUser
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}


export async function forgotPasswordController(req, res) {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
        success: false,
        error: true,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        error: true,
      });
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

    
    return res.json({
      message: "OTP has been sent to your email",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}


export async function resendForgotPasswordOtp(req, res) {
  try {
    const { email } = req.body;

    if (!email || email.trim() === "") {
      return res.status(400).json({
        message: "Email is required",
        success: false,
        error: true,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email not found",
        success: false,
        error: true,
      });
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

    return res.json({
      message: "New OTP has been sent to your email",
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Resend OTP Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
}


export async function verifyForgotPassword(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) { 
      return res.status(400).json({
        message: "Provide required fields: email, otp",
        error: true,
        success: false
      });
    }

    const user = await User.findOne({ email });
 
    
    if (!user) {
      return res.status(400).json({
        message: "Email not found.",
        error: true,
        success: false
      });
    }

    //check expiry
    if (!user.forgot_password_expiry || !user.forgot_password_otp) {
          return res.status(400).json({
              message: "OTP not generated for this email.",
              error: true,
              success: false
          });
      }

    const currentTime = new Date();
    const expiryTime = new Date(user.forgot_password_expiry);

    if (currentTime > expiryTime) {
      return res.status(400).json({
        message: "OTP has expired",
        error: true,
        success: false
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");
  
    //comparing the hashed values
    if (hashedOtp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false
      });
    }

    //if otp is correct then clear the fields
    await User.findByIdAndUpdate(user._id, {
      forgot_password_otp: null,
      forgot_password_expiry: null,
    });

    return res.json({
      message: "OTP verified successfully.",
      error: false,
      success: true
    });


  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: " Provide required fields: email, newPassword, confirmPassword",
        error: true,
        success: false
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Email is not available.",
        error: true,
        success: false
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword must be the same.",
        error: true,
        success: false
      });
    }

    //check otp is verified before password reset
    if (user.forgot_password_otp || user.forgot_password_expiry) {
      return res.status(400).json({
        message: "OTP verification required before restting password.",
        error: true,
        success: false
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    );

    return res.json({
      message: "Password updated successfully.",
      error: false,
      success: true
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

//generate new tokens
export async function refreshToken(req, res) {
  try {

    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

    const oldRefreshToken = req?.cookies?.refreshToken || tokenFromHeader;

    if (!oldRefreshToken) {
      return res.status(401).json({
        message: "Missing refresh token",
        error: true,
        success: false,
      });
    }

    let decodedToken;
    try {

      decodedToken = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);

    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
        error: true,
        success: false
      });
    }

    const userId = decodedToken?.userId;

    //verify refresh token exists in DB
    const user = await User.findById(userId);

    if (!user || user.refresh_token !== oldRefreshToken) {
      return res.status(401).json({
        message: "Refresh token is not valid anymore",
        error: true,
        success: false,
      });
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

    return res.json({
      message: "New access & refresh tokens generated",
      error: false,
      success: true,
      data: {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false
    });
  }
}

//get the user details
export async function userDetails(req, res) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: userId not found",
        error: true,
        success: false
      });
    }

    const user = await User.findById(userId).select(" -password -refresh_token -forgot_password_otp -forgot_password_expiry -verifyEmailExpireAt -verifyEmailToken ")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false
      });
    }

    return res.json({
      message: "User details fetched successfully",
      error: false,
      success: true,
      data: user
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false
    });
  }
}







