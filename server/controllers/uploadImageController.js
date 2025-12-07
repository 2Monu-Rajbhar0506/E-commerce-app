import uploadImageCloudinary from "../utils/UploadImageCloudinary.js";

 const uploadImageController = async (req, res) => {
  try {
    const file = req.file;
 
 
    // check if file exists
    if (!file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }

    // validate file type
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      return res.status(415).json({
        message: "Invalid file type. Only JPG, PNG & WebP allowed",
        error: true,
        success: false,
      });
    }

    // upload to cloudinary
    const uploadResult = await uploadImageCloudinary(file);

    return res.status(201).json({
      message: "Image uploaded successfully",
      data: uploadResult,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in uploadImageController:", error);

    return res.status(500).json({
      message: error.message || "Error uploading image",
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;