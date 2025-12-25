import { z } from "zod";

export const validateRequest = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body); // overwrite body with parsed+validated version
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.errors,
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
};

/*export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error) {
     if (error instanceof z.ZodError) {
       return res.status(400).json({
         message: "Validation failed....",
         errors: error.errors,
         error: true,
         success: false,
       });
     }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.errors,
    });
  }
};*/


export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.parseAsync({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next();
  } catch (error) {
    // 🔴 Zod validation error
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        location: err.path[0], // body | query | params
        field: err.path.slice(1).join("."), // actual field name
        message: err.message,
      }));

      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formattedErrors,
      });
    }

    // 🔴 Unexpected error
    console.error("Validation middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal validation error",
    });
  }
};





/**
 * 
 * Step 3 — Use Middleware in Your Routes (subcategory.routes.js).This keeps your controllers SUPER CLEAN.
 * 
 * 
 * import express from "express";
import {
  AddSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
} from "../controllers/subCategory.controller.js";

import {
  createSubCategorySchema,
  updateSubCategorySchema,
  deleteSubCategorySchema,
} from "../validators/subcategory.validator.js";

import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

// CREATE
router.post(
  "/create",
  validateRequest(createSubCategorySchema),
  AddSubCategoryController
);

// GET
router.get("/list", getSubCategoryController);

// UPDATE
router.put(
  "/update",
  validateRequest(updateSubCategorySchema),
  updateSubCategoryController
);

// DELETE
router.delete(
  "/delete",
  validateRequest(deleteSubCategorySchema),
  deleteSubCategoryController
);

export default router;




After this controller becomes clean and neat

export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, categories } = req.body;

    const duplicate = await SubCategoryModel.findOne({ name: name.trim() });
    if (duplicate) {
      return res.status(409).json({
        message: "Subcategory already exists",
        error: true,
        success: false,
      });
    }

    const result = await SubCategoryModel.create({ name, image, categories });

    return res.status(201).json({
      message: "Subcategory created successfully",
      data: result,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
};










*/