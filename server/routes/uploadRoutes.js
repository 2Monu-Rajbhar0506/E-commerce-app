import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import upload from "../middleware/multer.js";
import uploadImageController from "../controllers/uploadImageController.js";

const uploadRouter = Router();

uploadRouter.post("/upload", authUser, upload.single("image"),uploadImageController);

export default uploadRouter; 
