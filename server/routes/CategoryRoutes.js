import { Router } from "express";
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from "../controllers/categoryController.js";
import { authUser } from "../middleware/authUser.js";

const categoryRouter = Router();

categoryRouter.post("/add-category", authUser, AddCategoryController);
categoryRouter.get("/get", getCategoryController);
categoryRouter.put("/update-category", authUser, updateCategoryController);
categoryRouter.delete("/delete-category", authUser, deleteCategoryController);

export default categoryRouter;