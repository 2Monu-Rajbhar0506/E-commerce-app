import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import { updateCategorySchema } from "../validation/updateCategorySchema.js";
import { log } from "console";

export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;  //we are sending the url of image directly from frontend, In frontend all the image's will be uploaded by the uploadImage utility.

    
    if (!name?.trim() || !image?.trim()) {
      return res.status(400).json({
        message: "Name and Image are required",
        error: true,
        success: false,
      });
    }

    // normalize input
    const normalizedName = name.trim().toLowerCase();

    // check existing category
    const existingCategory = await Category.findOne({ name: normalizedName });

    if (existingCategory) {
      return res.status(409).json({
        message: "Category already exists",
        error: true,
        success: false,
      });
    }

    // create new category
    const newCategory = new Category({
      name: normalizedName,
      image,
    });

    const savedCategory = await newCategory.save();
    
      if (!savedCategory) {
          return res.status(500).json({
              message: "Category not created",
              error: true,
              success: false
          });
      }

    return res.status(201).json({
      message: "Category created successfully",
      data: savedCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("Error in AddCategoryController:", error);

    // mongo duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Category name already exists",
        error: true,
        success: false,
      });
    }

    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};


export const getCategoryController = async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 }).lean(); 

      return res.status(200).json({
        message: "Category fetched successfully",
        success: true,
        error: false,
        data: categories,
      });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            message: error.message || "Internal server error in get category controller",
            error: true,
            success: false
        });
    }
};


export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = updateCategorySchema.parse(req.body);

    const existingCategory = await Category.findById(_id);
    if (!existingCategory) {
      return errorResponse(res, "Category not found", 404);
    }

    // Compare if user changed anything, Avoid updating if nothing changed
    if (existingCategory.name === name && existingCategory.image === image) {
      return errorResponse(res, "No changes detected", 404);
    }

    // Check if name already exists for a different category
    const nameExists = await Category.findOne({ name, _id: { $ne: _id } }); //exclude same category

    if (nameExists) {
      return errorResponse(res, "Category name already exists", 400);
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      { name, image },
      { new: true }
    );

    return successResponse(
      res,
      "Category updated successfully",
      updatedCategory
    );
  } catch (error) {
    console.error("Error updating category:", error);
    next(error);
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id || !mongoose.Types.ObjectId.isValid(_id)) {
      return errorResponse(res, "Valid Category ID is required", 400);
    }

    const category = await Category.findById(_id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const subCategoryCount = await SubCategory.countDocuments({
      category: _id,
    });

    const productCount = await Product.countDocuments({ category: _id });

    /**
      OR

     const ProductDocsCount = await Product.find({
        category:{
          "$in":[_id]
        }
     }).countDocuments();  //same for "SubCategoryDocsCount"
     
        It counts how many products belong to a specific category.
        The logic:
        Product.find({ ... })
        → Finds all products that match the filter.
        category: { "$in": [_id] }
        → Checks if the category field in the product contains the given _id.
        .countDocuments()
        → Counts the number of matching products.
     
     */

    if (subCategoryCount > 0 || productCount > 0) {
      return errorResponse(
        res,
        "Category is currently in use and cannot be deleted",
        400
      );
    }

    const deleted = await Category.deleteOne({ _id });

    return successResponse(res, "Category deleted successfully", deleted);
  } catch (error) {
    console.error("Error while deleting category", error);
    return errorResponse(res, "Internal server error", 500);
  }
};