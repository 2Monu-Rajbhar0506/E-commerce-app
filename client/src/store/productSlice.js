import { createSlice } from "@reduxjs/toolkit";

const initialValue = {

  allCategory: [],
  allSubCategory: [],

  category: {
    data: [],
    loading: false,
    error: null,
  },
  subCategory: {
    data: [],
    loading: false,
    error: null,
  },
  product: {
    data: [],
    loading: false,
    error: null,
  },
};

const productSlice = createSlice({
  name: "product",
  initialState: initialValue,
  reducers: {
      //Data
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload];
      state.category.data = [...action.payload];
      state.category.error = null;
    },
    setAllSubCategory: (state, action) => {
      state.allSubCategory = [...action.payload];
      state.subCategory.data = [...action.payload];
      state.subCategory.error = null;
    },
    setAllProduct: (state, action) => {
      state.product.data = [...action.payload];
      state.product.error = null;
    },

    //Loading
    setCategoryLoading: (state, action) => {
      state.category.loading = action.payload; 
    },

    setSubCategoryLoading: (state, action) => {
      state.subCategory.loading = action.payload; 
    },

    setProductLoading: (state, action) => {
      state.product.loading = action.payload; 
    },

    //Error
    setCategoryError: (state, action) => {
      state.category.error = action.payload;
    },
    setSubCategoryError: (state, action) => {
      state.subCategory.error = action.payload;
    },
    setProductError: (state, action) => {
      state.product.error = action.payload;
    },
  },
});

export const {
  setAllCategory,
  setAllSubCategory,
  setAllProduct,
  setCategoryLoading,
  setSubCategoryLoading,
  setProductLoading,
  setCategoryError,
  setSubCategoryError,
  setProductError,
} = productSlice.actions;

export default productSlice.reducer;