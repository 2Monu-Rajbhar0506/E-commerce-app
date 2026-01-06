import { Router } from "express";
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { authUser } from "../middleware/authUser.js";
import { validate } from "../middleware/zodValidation.js";
import { addCategorySchema, deleteCategorySchema, updateCategorySchema } from "../validation/categoryValidation.js";

const categoryRouter = Router();

categoryRouter.post("/add-category", authUser, validate(addCategorySchema), AddCategoryController);
categoryRouter.get("/get", getCategoryController);
categoryRouter.put("/update-category", authUser, validate(updateCategorySchema), updateCategoryController);
categoryRouter.delete("/delete-category", authUser, validate(deleteCategorySchema), deleteCategoryController);

export default categoryRouter;