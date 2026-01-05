import { ZodError } from "zod";
import { errorResponse } from "../utils/response.js";

export const validate = (schema) => (req, res, next) => {
  try {
    // validate & sanitize body
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return errorResponse(res, "Validation error", 400, formattedErrors);
    }

    console.error("Validation middleware error:", error);
    return errorResponse(res, "Internal validation error", 500);
  }
};
