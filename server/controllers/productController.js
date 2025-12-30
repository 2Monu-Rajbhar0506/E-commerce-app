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
       Product.find(query)
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
      category: { $in: [categoryId] },   // use $in only if category is array in schema
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
    }

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

