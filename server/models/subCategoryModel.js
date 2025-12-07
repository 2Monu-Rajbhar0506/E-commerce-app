import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subcategory name is required"],
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    categories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Custom validator ensuring at least one category selected
subCategorySchema.path("categories").validate(function (value) {
  return Array.isArray(value) && value.length > 0;
}, "At least one category is required");

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
export default SubCategory;
