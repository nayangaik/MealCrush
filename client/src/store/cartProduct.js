import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: [],
    totalPrice: 0, // Initialize totalPrice
    totalQty: 0    // Initialize totalQty
};

// Helper function to calculate total price and quantity
const calculateTotals = (cartItems) => {
    let totalPrice = 0;
    let totalQty = 0;
    cartItems.forEach(item => {
        // Ensure item.productId and its properties exist before accessing
        if (item.productId && typeof item.productId.price === 'number' && typeof item.quantity === 'number') {
            const priceAfterDiscount = item.productId.price * (1 - (item.productId.discount / 100 || 0));
            totalPrice += priceAfterDiscount * item.quantity;
            totalQty += item.quantity;
        } else {
            // Log a warning if an item is malformed, but don't crash
            console.warn("Invalid item in cart for total calculation:", item);
        }
    });
    return { totalPrice, totalQty };
};

const cartSlice = createSlice({
    name: "cartItem",
    initialState: initialState,
    reducers: {
        handleAddItemCart: (state, action) => {
            state.cart = [...action.payload];
            const { totalPrice, totalQty } = calculateTotals(state.cart);
            state.totalPrice = totalPrice;
            state.totalQty = totalQty;
        },
        increaseQty: (state, action) => {
            const index = state.cart.findIndex(el => el._id === action.payload);
            if (index !== -1) {
                let qty = state.cart[index].quantity;
                if (qty < 10) {
                    qty++;
                    state.cart[index].quantity = qty;
                    const { totalPrice, totalQty } = calculateTotals(state.cart);
                    state.totalPrice = totalPrice;
                    state.totalQty = totalQty;
                }
            }
        },
        decreaseQty: (state, action) => {
            const index = state.cart.findIndex(el => el._id === action.payload);
            if (index !== -1) {
                let qty = state.cart[index].quantity;
                if (qty > 1) {
                    qty--;
                    state.cart[index].quantity = qty;
                    const { totalPrice, totalQty } = calculateTotals(state.cart);
                    state.totalPrice = totalPrice;
                    state.totalQty = totalQty;
                }
            }
        },
        removeItemFromCart: (state, action) => {
            state.cart = state.cart.filter(item => item._id !== action.payload);
            const { totalPrice, totalQty } = calculateTotals(state.cart);
            state.totalPrice = totalPrice;
            state.totalQty = totalQty;
        }
    }
});

export const { handleAddItemCart, increaseQty, decreaseQty, removeItemFromCart } = cartSlice.actions;

export default cartSlice.reducer