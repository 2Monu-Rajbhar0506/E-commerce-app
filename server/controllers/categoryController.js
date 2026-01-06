import mongoose from "mongoose";
import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import { errorResponse, successResponse } from "../utils/response.js";



export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;  //we are sending the url of image directly from frontend, In frontend all the image's will be uploaded by the uploadImage utility.

    
    // normalize input
    const normalizedName = name.trim().toLowerCase();

    // check existing category
    const existingCategory = await Category.findOne({ name: normalizedName });

    if (existingCategory) {
      return errorResponse(res, "Category already exists", 409);
    }

    // create new category
    const newCategory = new Category({
      name: normalizedName,
      image,
    });

    const savedCategory = await newCategory.save();
    
      if (!savedCategory) {
          return errorResponse(res, "Category not created", 400);
      }

    return successResponse(res, "Category created successfully", savedCategory, 201);

  } catch (error) {
    console.error("Error in AddCategoryController:", error);
    // mongo duplicate key error
    if (error.code === 11000) {
      return errorResponse(res, "Category name already exists", 409);
    }
    return errorResponse(res, error.message || "Internal server error", 500);
  }
};


export const getCategoryController = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();

    return successResponse(res, "Category fetched successfully", categories, 200);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return errorResponse(
      res,
      error.message || "Internal server error in get category controller",
      500
    );
  }
};


export const updateCategoryController = async (req, res) => {
  try {
    const { _id, name, image } = req.body;

    const existingCategory = await Category.findById(_id);
    if (!existingCategory) {
      return errorResponse(res, "Category not found", 404);
    }

    const normalizedName = name ? name.trim().toLowerCase() : undefined;

    // No changes check
    if (
      normalizedName === existingCategory.name &&
      image === existingCategory.image
    ) {
      return errorResponse(res, "No changes detected", 400);
    }

    // Duplicate name check
    if (normalizedName) {
      const nameExists = await Category.findOne({
        name: normalizedName,
        _id: { $ne: _id },
      });

      if (nameExists) {
        return errorResponse(res, "Category name already exists", 409);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      _id,
      {
        ...(normalizedName && { name: normalizedName }),
        ...(image && { image }),
      },
      { new: true }
    );

    return successResponse(
      res,
      "Category updated successfully",
      updatedCategory,
      200
    );
  } catch (error) {
    console.error("Error in updateCategoryController:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
};


export const deleteCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const category = await Category.findById(_id);
    if (!category) {
      return errorResponse(res, "Category not found", 404);
    }

    const [subCategoryCount, productCount] = await Promise.all([
      SubCategory.countDocuments({ category: _id }),
      Product.countDocuments({ category: _id }),
    ]);

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

    return successResponse(res, "Category deleted successfully", deleted, 200);
  } catch (error) {
    console.error("Error while deleting category", error);
    return errorResponse(res, "Internal server error", 500);
  }
};