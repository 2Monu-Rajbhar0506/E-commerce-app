import Product from "../models/productModel.js";
import { errorResponse, successResponse } from "../utils/response.js";
import mongoose from "mongoose";

export const createProductController = async (req, res) => {
    try {
        const {
            name,
            image = [],
            category = [],
            subCategory = [],
            unit,
            stock = 0,
            price,
            discount = 0,
            description,
            more_details = {},
        } = req.body
        
      if (
        !name?.trim() ||
        !image?.length ||
        !category?.length ||
        !subCategory?.length ||
        !unit ||
        price < 0 ||
        !description?.trim()
      ) {
        return errorResponse(res, "Invalid or missing required fields", 400);
      }

        if ( price < 0 || stock < 0 || discount < 0) {
          return errorResponse(res, "Invalid numeric values", 400);
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return errorResponse(res, "Product already exists", 409);
        }

        const product = new Product({
          name,
          image,
          category,
          subCategory,
          unit,
          stock,
          price,
          discount,
          description,
          more_details,
        });

        const saveProduct = await product.save(); 
        return successResponse(res, "Product Created Successfully", saveProduct, 201)

    } catch (error) {
        console.error(error);
        return errorResponse(res, error.message||"Internal server error", 500)
    }
}

export const getProductController = async (req, res) => {
 try {
     let {
         page = 1,
         limit = 12,
         search = "",
     } = req.query;
     
     //convert to numbers
     page = Math.max(Number(page), 1);
     limit = Math.min(Math.max(Number(limit), 1), 50);  //this allows only max 50 per page

     const skip = (page - 1) * limit;
     search = search.trim();

     const query = search ? {
         $text: { $search: search }
     } : {};

     const [products, totalCount] = await Promise.all([
       Product.find({
         ...query,
         isDeleted: false,
       })
         .sort(
           // first sort on the basis of relevance, then on the basis on newest/time based
           search
             ? { score: { $meta: "textScore" }, createdAt: -1 }
             : { createdAt: -1 }
         )
         .skip(skip)
         .limit(limit)
         .populate("category subCategory")
         .lean(),

       Product.countDocuments(query),
     ]);
     
     return successResponse(res, "Product data fetched", {
         products,
         pagination: {
             page,
             limit,
             totalCount,
             totalPages: Math.ceil(totalCount / limit),
             hasNextPage: page * limit < totalCount,
             hasPrevPage: page > 1
         },
     });
     
 } catch (error) {
     console.error(error)
     return errorResponse(res, error.message || "Internal server error", 500);
 }   
}

export const getProductByCategory = async (req, res) => {
  try {
    const { categoryId, limit = 15 } = req.body;
    
    if (!categoryId || !mongoose.Types.ObjectId.isValid(categoryId)) {
      errorResponse(res,"Invalid or missing Category Id",400)
    }

    const products = await Product.find({
      category: { $in: [categoryId] }, // use $in only if category is array in schema
      isDeleted: false,
    })
      .select("-__v")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .lean();
    
    return successResponse(
      res,
      "Home category product list",
      ({
        categoryId,
        products,
        totalShown: products.length,
      }),
      201
    );



  } catch (error) {
    console.error("getHomeProductsByCategory error:", error);
    
    errorResponse(res, error.message || "Internal Server Error", 500 )
  }
}

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    const { categoryId, subCategoryId, page = 1, limit = 10, } = req.body;

    if (!categoryId || !subCategoryId) {
      return errorResponse(res, "categorId and subCategoryId is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId) || !mongoose.Types.ObjectId.isValid(subCategoryId)) {
      errorResponse(res, "Invalid categoryId or subCategoryId", 400);
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Number(limit) || 10, 50);
    const skip = (pageNumber - 1) * limitNumber;

    const query = {
      category: { $in: [categoryId] },
      subCategory: { $in: [subCategoryId] },
      isDeleted: false,
    };

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNumber)
        .lean(),
      Product.countDocuments(query),
    ]);

    return successResponse(
      res,
      "Product list fetched successfully",
      {
        products,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limitNumber),
        },
      },
      200
    );

  } catch (error) {
    console.error("getProductByCategoryAndSubCategory:", error);
    errorResponse(res, "Internal server error", 500);
  }
}

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return errorResponse(res, "Product Id is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, "Invalid product Id", 400);
    }

    // const product = await Product.findById(productId)
    //   .populate("category subCategory")
    //   .lean();

    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    }).populate("category subCategory")
      .lean();
    

    if (!product) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(
      res,
      "Product details fetched successfully",
      product,
      200
    );
  } catch (error) {
    console.error("getProductDetails error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

export const updateProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = { ...req.body };

    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, "Invalid Product ID", 400);
    }

    const restrictedFields = [
      "_id",
      "createdAt",
      "updatedAt",
      "isDeleted"
    ];

    // restrictedFields.forEach((field) => {
    //   if (field in updateData) {
    //     delete updateData[field];
    //   }
    // });

    for (const field of restrictedFields) {
      delete updateData[field];
    }


    //validating the numeric field
    const numericFields = ["price", "stock", "discount"];

    for (const field of numericFields) {
      if (
        //“If this numeric field exists and(&&) its value is negative → throw an error.”
        updateData[field] !== undefined &&
        (Number(updateData[field]) < 0 || Number.isNaN(Number(updateData[field])))
      ) {
        return errorResponse(res, `${field} cannot be nagative`, 400);
      }
    };

    //update the product
    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      {
        new: true,
        runValidators: true
      }
    ).lean();

    if (!updateProduct) {
      return errorResponse(res, "Product not found", 404);
    }

    return successResponse(
      res,
      "Product updated successfully",
      updateProduct,
      200,
    );

  } catch (error) {
    console.error("updateProductDetails error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return errorResponse(res, "Invalid Product Id", 400);
    }

    // const deletedProduct = await Product.findByIdAndUpdate(
    //   productId,
    //   { isDeleted: true },
    //   { new: true },
    // ).lean();

    
    //block deleting an already deleted product
    const deletedProduct = await Product.findOneAndUpdate(
      { _id: productId, isDeleted: false },
      { isDeleted: true },
      { new: true }
    ).lean();

    if (!deletedProduct) {
      return errorResponse(res, "Product not found or already deleted", 404);
    }

    return successResponse(
      res,
      "Product Deleted Successfully",
      deletedProduct,
      200
    );
  } catch (error) {
    console.error("deleteProduct error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

export const searchProduct = async (req, res) => {
  try {
    let { search = "", page = 1, limit = 10 } = req.query;

    page = Math.max(Number(page), 1);
    limit = Math.min(Math.max(Number(limit), 1), 50);

    const skip = (page - 1) * limit;
    const trimmedSearch = search.trim();

    const query = trimmedSearch ? { $text: { $search: trimmedSearch } } : {};

    const sort = trimmedSearch
      ? { score: { $meta: "textScore" }, createdAt: -1 }
      : { createdAt: -1 };

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("category subCategory")
        .lean(),
      
      Product.countDocuments(query),
    ]);

    return successResponse(
      res,
      "Product search results",
      {
        products,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNextPage: page * limit < totalCount,
          hasPrevPage: page > 1,
        },
      },
      200
    );

  } catch (error) {
    console.error("searchProduct error:", error);
    return errorResponse(res, "Internal Server Error", 500);
  }
}

