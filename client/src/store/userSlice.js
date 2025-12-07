import { createSlice } from "@reduxjs/toolkit";

const initialValue = {
    _id: "",
    name: "",
    email: "",
    avatar: "",
    mobile: "",
    verify_email: "",
    last_login_date: "",
    status: "",
    orderHistory: [],
    address_details: [],
    role: "",
    shopping_cart: [],
    createdAt: ""
};

const userSlice = createSlice({
  name: "user",
  initialState: initialValue,
  reducers: {
    setUserDetails: (state, action) => {
      state._id = action.payload?._id;
      state.name = action.payload?.name;
      state.email = action.payload?.email;
      state.avatar = action.payload?.avatar;
      state.mobile = action.payload?.mobile;
      state.verify_email = action.payload?.verify_email;
      state.last_login_date = action.payload?.last_login_date;
      state.status = action.payload?.status;
      state.orderHistory = action.payload?.orderHistory;
      state.address_details = action.payload?.address_details;
      state.role = action.payload?.role;
      state.shopping_cart = action.payload?.shopping_cart;
      state.createdAt = action.payload?.createdAt;
      state.updatedAt = action.payload?.updatedAt;
    },
    
    updateAvatar: (state, action)=>{
      state.avatar = action?.payload;
    },

    logoutUser: () => initialValue,
  },
});

export const { setUserDetails, logoutUser,updateAvatar } = userSlice.actions;

export default userSlice.reducer;
