import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { createProductController, getProductController } from "../controllers/productController.js";
import { validate } from "../middleware/zodValidation.js";
import { createProductSchema } from "../validation/createProduct.js";

const productRouter = Router()

productRouter.post("/create", authUser,  validate(createProductSchema), createProductController);
productRouter.get("/get", getProductController)

export default productRouter;