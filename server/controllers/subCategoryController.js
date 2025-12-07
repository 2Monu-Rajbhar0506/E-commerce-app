import SubCategory from "../models/subCategoryModel.js";
import { success, z } from "zod";
import {
  AddSubCategorySchema,
  updateSubCategorySchema,
  deleteSubCategorySchema,
} from "../validation/subCategoryValidation.js";
import { parse } from "zod";
import { errorResponse, successResponse } from "../utils/response.js";

export const AddSubCategoryController = async(req, res) => {
    try {
        //validate the req.body using zod
        const parsedData = AddSubCategorySchema.parse(req.body);
        const { name, image, categories } = parsedData;

        //check the duplicate names
        const existing = await SubCategory.findOne({ name: name.trim() });

        if (existing) {
            return errorResponse(res, "Subcategory with this name already exists", 409)
        }

        const payload = {
            name, 
            image,
            categories
        }

        const createdSubCategory = new SubCategory(payload)
        const SavedSubCategory = await createdSubCategory.save(); 

        successResponse(
          res,
          "Sub Category created successfully ",
          SavedSubCategory
        );
        
    } catch (error) {
        //handle zod validation errors
        if (error instanceof z.ZodError) {
            return res.status(400).json({
                message: "Validation failed",
                errors: error.errors,
                error: true,
                success: false
            });
        }

        //other server errors
        return res.status(500).json({
            message: error.message || "Internal server error",
            error: true,
            success: false
        });

    }
}

export const getSubCategoryController = async (req, res) => {
    try {
        const data = await SubCategory.find().sort({ createdAt: -1 }).populate("categories");
        
        return successResponse(res, "SubCategory Data", data)

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

export const updateSubCategoryController = async (req, res) => {
  try {
    const parsedData = updateSubCategorySchema.parse(req.body);
    const { _id, ...updateFields } = parsedData;

    const existing = await SubCategory.findById(_id);

    if (!existing) {
      return res.status(400).json({
        message: "Invalid SubCategory ID",
        error: true,
        success: false,
      });
    }

    const updated = await SubCategory.findByIdAndUpdate(_id, updateFields, {
      new: true,
    });

    return successResponse(res, "SubCategory Updated Successfully", updated);
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
      message: error.message,
      error: true,
      success: false,
    });
  }
};

export const deleteSubCategoryController = async (req, res) => {
    try {
        const parsedData = deleteSubCategorySchema.parse(req.body);
        const { _id } = parsedData;
    
        const deleted = await SubCategory.findByIdAndDelete(_id);
    
        return successResponse(res, "SubCategory Deleted Successfully", deleted);
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
            message: error.message,
            error: true,
            success: false
        });
    }
}


