/*import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    handleAddAddress: (state, action) => {
      state.addressList = action.payload; // no need to spread
    },
  },
});

export const { handleAddAddress } = addressSlice.actions;

export default addressSlice.reducer;*/


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addressList: [],
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
   
    handleAddAddress: (state, action) => {
      state.addressList = action.payload;
    },

 
    addSingleAddress: (state, action) => {
      state.addressList.unshift(action.payload);
    },


    updateSingleAddress: (state, action) => {
      const index = state.addressList.findIndex(
        (addr) => addr._id === action.payload._id
      );

      if (index !== -1) {
        state.addressList[index] = action.payload;
      } else {
        state.addressList = state.addressList.filter(
          (addr) => addr._id !== action.payload
        );
      }
    },
  },
});

export const { handleAddAddress, addSingleAddress, updateSingleAddress } =
  addressSlice.actions;

export default addressSlice.reducer;
