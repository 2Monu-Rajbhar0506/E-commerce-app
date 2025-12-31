import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { createProductController, deleteProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, updateProductDetails } from "../controllers/productController.js";
import { validate } from "../middleware/zodValidation.js";
import { createProductSchema } from "../validation/createProduct.js";
import { admin } from "../middleware/isAdmin.js";

const productRouter = Router()

productRouter.post("/create", authUser,  validate(createProductSchema), createProductController);
productRouter.get("/get", getProductController)
productRouter.post("/get-product-by-category", getProductByCategory);
productRouter.post("/get-product-by-category-and-subCategory", getProductByCategoryAndSubCategory);
productRouter.get("/:productId", getProductDetails);
productRouter.put("/updateProduct/:productId", authUser, admin, updateProductDetails);
productRouter.delete("/delete-product/:productId", authUser, admin, deleteProduct);

export default productRouter;