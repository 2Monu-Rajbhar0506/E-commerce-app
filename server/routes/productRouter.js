import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { createProductController, deleteProduct, getProductByCategory, getProductByCategoryAndSubCategory, getProductController, getProductDetails, searchProduct, updateProductDetails } from "../controllers/productController.js";
import { validate } from "../middleware/zodValidation.js";
import { admin } from "../middleware/isAdmin.js";
import { createProductSchema, getProductByCategoryAndSubCategorySchema, getProductByCategorySchema } from "../validation/productValidation.js";

const productRouter = Router()

productRouter.post("/create", authUser,  createProductController);
productRouter.get("/get", getProductController);
productRouter.post("/get-product-by-category", validate(getProductByCategorySchema),getProductByCategory);
productRouter.post("/get-product-by-category-and-subCategory", validate(getProductByCategoryAndSubCategorySchema),getProductByCategoryAndSubCategory);
productRouter.get("/:productId", getProductDetails);
productRouter.put("/updateProduct/:productId", authUser, admin, updateProductDetails);
productRouter.delete("/delete-product/:productId", authUser, admin, deleteProduct);
productRouter.post("/search-product", searchProduct);

export default productRouter;
// validate(createProductSchema),