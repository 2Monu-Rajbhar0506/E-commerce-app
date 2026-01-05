import { Router } from "express";

import { authUser } from "../middleware/authUser.js";
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from "../controllers/subCategoryController.js";
import {validate} from "../middleware/zodValidation.js"
import { AddSubCategorySchema, deleteSubCategorySchema, updateSubCategorySchema } from "../validation/subCategoryValidation.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/create", authUser, validate(AddSubCategorySchema), AddSubCategoryController);
subCategoryRouter.post("/get", getSubCategoryController);
subCategoryRouter.put("/update", authUser, validate(updateSubCategorySchema), updateSubCategoryController);
subCategoryRouter.delete("/delete", authUser, validate(deleteSubCategorySchema), deleteSubCategoryController);

export default subCategoryRouter;