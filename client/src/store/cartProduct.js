import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    items: []
};


const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Replace full cart (after fetch)
    setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload) ? action.payload : [];
    },

    // Add or update SINGLE cart item (from increment/decrement API)
    /**it means on first add redux will push and on further adds redux replace the same item on the same index multiple times & will update only "quantity" field,
     * means in items[] only single product will contain but "quantity" will update  */
    //or
    /**
     * On first add, the cart item is pushed into items[].
     * On subsequent adds (increment/decrement), the same item
     * is replaced at the same index with the updated data
     * (typically quantity). Each product appears only once
     * in items[], with quantity representing count.
     */

    upsertCartItem: (state, action) => {
      const item = action.payload;
      if (!item?._id) return;

      const index = state.items.findIndex((i) => i._id === item._id);

      if (index !== -1) {
        state.items[index] = item;
      } else {
        state.items.push(item);
      }
    },

    // Remove item (when backend deletes it)
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
    },

    // Clear cart (logout / order placed)
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  setCartItems,
  upsertCartItem,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;




