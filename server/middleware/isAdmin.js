import User from "../models/userModel.js";
import { errorResponse } from "../utils/response.js";

export const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return errorResponse(res, "Unauthorized Access", 401);
    }

    const user = await User.findById(userId).select("role");

    if (!user) {
      return errorResponse(res, "User not found", 401);
    }

    if (user.role !== "ADMIN") {
      return errorResponse(res, "Access denied: Admin only", 403);
    }

    // attach role info if needed later
    req.userRole = user.role;

    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
};
