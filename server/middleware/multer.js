import multer from "multer";


const storage = multer.memoryStorage();


const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const fileFilter = (req, file, cb) => {
    if (!file) {
        return cb(new Error("No file uploaded"), false);
    }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return cb(
      new Error("Invalid file type. Only JPG, JPEG, PNG, WEBP allowed."),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


export const uploadSingle = (fieldName) => upload.single(fieldName);

export const uploadMultiple = (fieldName, maxCount = 5) =>
  upload.array(fieldName, maxCount);

export const uploadFields = (fields) => upload.fields(fields);

export default upload;
