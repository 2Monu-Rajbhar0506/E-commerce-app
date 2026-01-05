import { errorResponse, successResponse } from "../utils/response.js";
import uploadImageCloudinary from "../utils/UploadImageCloudinary.js";

 const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
 
 
    // check if file exists
  if (!file) {
    return errorResponse(res, "No file uploaded", 400);
  }

    // validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      return errorResponse(
        res,
        "Invalid file type. Only JPG, PNG & WebP allowed",
        415
      );
    }

    // upload to cloudinary
    const uploadResult = await uploadImageCloudinary(file);

    if (!uploadResult || !uploadResult.secure_url) {
      return errorResponse(res, "Image upload failed", 500);
    }

    return successResponse(
      res,
      "Image uploaded successfully",
      uploadResult,
      201
    );
  } catch (error) {
    console.error("Error in uploadImageController:", error);
    return errorResponse(res, error.message || "Error uploading image", 500);
  }
};

export default uploadImageController;