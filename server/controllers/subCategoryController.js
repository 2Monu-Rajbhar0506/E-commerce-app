import SubCategory from "../models/subCategoryModel.js";
import { errorResponse, successResponse } from "../utils/response.js";

export const AddSubCategoryController = async(req, res) => {
    try {
        //validate the req.body using zod
        const { name, image, categories } = req.body;

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
       console.error("AddSubCategoryController error:", error);
       return errorResponse(res, error.message || "Internal server error", 500);
    }
}


export const getSubCategoryController = async (req, res) => {
  try {
    const data = await SubCategory.find()
      .sort({ createdAt: -1 })
      .populate("categories")
      .lean(); 

    return successResponse(
      res,
      "SubCategory data fetched successfully",
      data,
      200
    );
  } catch (error) {
    console.error("getSubCategoryController error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
};


export const updateSubCategoryController = async (req, res) => {
  try {
    const { _id, name, image, categories } = req.body;

    const existing = await SubCategory.findById(_id);
    if (!existing) {
      return errorResponse(res, "SubCategory not found", 404);
    }

    // Prevent duplicate name (only if name is being updated)
    if (name && name.trim() !== existing.name) {
      const duplicate = await SubCategory.findOne({
        name: name.trim(),
        _id: { $ne: _id },
      });

      if (duplicate) {
        return errorResponse(
          res,
          "Subcategory with this name already exists",
          409
        );
      }
    }

    const updateData = {
      ...(name && { name: name.trim() }),
      ...(image && { image }),
      ...(categories && { categories }),
    };

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      _id,
      updateData,
      { new: true }
    );

    return successResponse(
      res,
      "SubCategory updated successfully",
      updatedSubCategory,
      200
    );
  } catch (error) {
    console.error("updateSubCategoryController error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
};


export const deleteSubCategoryController = async (req, res) => {
  try {
    const { _id } = req.body;

    const deletedSubCategory = await SubCategory.findByIdAndDelete(_id);

    if (!deletedSubCategory) {
      return errorResponse(res, "SubCategory not found", 404);
    }

    return successResponse(
      res,
      "SubCategory deleted successfully",
      deletedSubCategory,
      200
    );
  } catch (error) {
    console.error("deleteSubCategoryController error:", error);
    return errorResponse(res, error.message || "Internal server error", 500);
  }
};


