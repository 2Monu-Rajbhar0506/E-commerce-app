import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    items: []
};


const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
      setCartItems: (state, action) => {
      state.items = Array.isArray(action.payload)
        ? action.payload
        : [];
    },

        addToCart: (state, action) => {
         if (!action.payload?._id) return;

            const item = action.payload;
            const existingItem = state.items.find(
                (i) => i._id === item._id
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.items.push({ ...item, quantity: 1 });
            }
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item?._id !== action?.payload
            );
        },

        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (i) => i._id === action.payload
            );

            if (!item) return;

            if (item) {
                item.quantity > 1
                    ? item.quantity--
                    : (state.items = state.items.filter(
                        (i) => i._id !== action.payload
                    ));
            }
        },

        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const {
    setCartItems,
    addToCart,
    removeFromCart,
    decreaseQuantity,
    clearCart,

} = cartSlice.actions;

export default cartSlice.reducer;




