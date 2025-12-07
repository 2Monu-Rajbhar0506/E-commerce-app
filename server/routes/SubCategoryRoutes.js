import { Router } from "express";

import { authUser } from "../middleware/authUser.js";
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategoryController.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", authUser, AddSubCategoryController);
subCategoryRouter.post("/get", getSubCategoryController);
subCategoryRouter.put("/update", authUser ,updateSubCategoryController)
subCategoryRouter.delete("/delete", authUser, deleteSubCategoryController)

export default subCategoryRouter;