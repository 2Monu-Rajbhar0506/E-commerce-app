import mongoose from "mongoose";
 
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    image: {
      type: [String],
      default: [],
    },

    category: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      }
    ],
    subCategory: [
      {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
      }
    ],
    unit: {
      type: String,
      default: "",
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: null,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: " ",
    },
    /** more_details: {
      type: Map,          
      of: String,
      default: {},
    },
 */
    more_details: {
      type: Object,
      default: {},
    },
    publish: {
      type: Boolean,
      default: true,
    },
    ratings: {
      average: Number,
      count: Number,
    },
    reviews: [
      {
        userId: String,
        comment: String,
        rating: Number,
        createdAt: Date,
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;