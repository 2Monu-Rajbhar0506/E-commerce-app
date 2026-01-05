import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
    removeFromOrders: (state, action) => {
      state.orders = state.orders.filter((item) => item._id !== action.payload);
    },
  },
});

export const { setOrders, clearOrders, removeFromOrders } = orderSlice.actions;
export default orderSlice.reducer;
