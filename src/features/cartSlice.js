import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const cartSlice = createSlice({
    name: "cart",
    initialState: {
        products: [],
        cartTotalQuantity: 0,
        cartTotalAmount: 0
    },
    reducers: {
        addProduct: (state, action) => {
            // first find the index of the product, if its already present in the cart or not 
            const productindex = state.products.findIndex((product) => product._id === action.payload._id);
            if (productindex >= 0) {
                state.products[productindex].productQuantity += 1
            } else {
                const productToAdd = { ...action.payload, productQuantity: 1 }
                state.products.push(productToAdd)
            }
            toast.success('Added to cart')
        },
        deleteProduct: (state, action) => {

            const productIndex = action.payload;
            state.products.splice(productIndex, 1)
            toast.info('Đã xóa sản phẩm')
        },
        decreaseQuantity: (state, action) => {
            const productindex = action.payload;
            // check if quantity is > 1 so that we remove 1 quantity or else we delete the product from the cart 
            if (state.products[productindex].productQuantity > 1) {
                state.products[productindex].productQuantity -= 1
            } else {
                state.products.splice(productindex, 1)
                toast.info('Đã xóa sản phẩm')
            }
        },
        increaseQuantity: (state, action) => {
            const productIndex = action.payload;
            state.products[productIndex].productQuantity += 1
        },
        getTotals: (state) => {
            // use reduce method here 
            const { total, quantity } = state.products.reduce((accum, product) => {
                // destructure price and quantity from product 
                const { cost, productQuantity } = product;
                accum.total += cost * productQuantity
                accum.quantity += productQuantity
                return accum
            }, {
                total: 0,
                quantity: 0
            })
            state.cartTotalAmount = total
            state.cartTotalQuantity = quantity
        },
        resetCart: (state) => {
            state.products= [];
            state.cartTotalQuantity= 0;
            state.cartTotalAmount= 0;
        },
    }
});


export const { addProduct, deleteProduct, decreaseQuantity, increaseQuantity, getTotals, resetCart } = cartSlice.actions;
export default cartSlice.reducer;