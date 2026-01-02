import { incrementCartItemQtyController } from "../../../server/controllers/cartProductController";
import ForgotPassword from "../pages/ForgotPassword";

export const baseURL = "http://localhost:8080";

const SummaryApi = {
  register: {
    url: "/api/user/register",
    method: "POST",
  },
  login: {
    url: "/api/user/login",
    method: "POST",
  },
  forgotPassword: {
    url: "/api/user/forgot-password-otp",
    method: "POST",
  },
  resendforgotPasswordOtp: {
    url: "/api/user/resend-forgot-password-otp",
    method: "POST",
  },
  verifyOtp: {
    url: "/api/user/verify-Otp",
    method: "POST",
  },
  resetPasswordOtp: {
    url: "/api/user/reset-password",
    method: "POST",
  },
  refreshToken: {
    url: "/api/user/refresh-token",
    method: "POST",
  },
  userDetails: {
    url: "/api/user/user-details",
    method: "GET",
  },
  logout: {
    url: "/api/user/logout",
    method: "POST",
  },
  uploadAvatar: {
    url: "/api/user/upload-avatar",
    method: "PUT",
  },
  updateUserDetails: {
    url: "/api/user/update-user",
    method: "PUT",
  },
  resendVerifyEmailOtp: {
    url: "/api/user/resend-email-verify",
    method: "POST",
  },
  VerifyEmail: {
    url: "/api/user/verify-email",
    method: "POST",
  },
  addCategory: {
    url: "/api/category/add-category",
    method: "POST",
  },
  uploadImage: {
    url: "/api/file/upload",
    method: "POST",
  },
  getCategory: {
    url: "/api/category/get",
    method: "GET",
  },
  updateCategory: {
    url: "/api/category/update-category",
    method: "PUT",
  },
  deleteCategory: {
    url: "/api/category/delete-category",
    method: "DELETE",
  },
  createSubCategory: {
    url: "/api/subcategory/create",
    method: "POST",
  },
  getSubCategory: {
    url: "/api/subcategory/get",
    method: "POST",
  },
  updateSubCategory: {
    url: "/api/subcategory/update",
    method: "PUT",
  },
  deleteSubCategory: {
    url: "/api/subcategory/delete",
    method: "DELETE",
  },
  createProduct: {
    url: "/api/product/create",
    method: "POST",
  },
  getProduct: {
    url: "/api/product/get",
    method: "GET",
  },
  getProductByCategory: {
    url: "/api/product/get-product-by-category",
    method: "POST",
  },
  getProductByCategoryAndSubCategory: {
    url: "/api/product/get-product-by-category-and-subCategory",
    method: "POST",
  },
  getProductDetails: (productId) => ({
    url: `/api/product/${productId}`,
    method: "GET",
  }),
  updateProductDetails: (productId) => ({
    url: `/api/product/updateProduct/${productId}`,
    method: "PUT",
  }),
  deleteProduct: (productId) => ({
    url: `/api/product/delete-product/${productId}`,
    method: "DELETE",
  }),
  searchProduct: {
    url: "/api/product/search-product",
    method: "POST",
  },
  addToCart: {
    url: "/api/cart/add-To-cart",
    method: "POST",
  },
  getCartItem: {
    url: "/api/cart/get",
    method: "GET",
  },
  updateCartItemQTY: {
    url: "/api/cart/update-cart-qty",
    method: "PUT",
  },
  incrementCartItemQty: {
    url: "/api/cart/increment-cart-item",
    method: "PUT",
  },
  decrementCartItemQty: {
    url: "/api/cart/decrement-cart-item",
    method: "PUT",
  },
};

export default SummaryApi;
