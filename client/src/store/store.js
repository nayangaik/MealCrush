import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../store/userSlice'
import productReducer from '../store/productSlice'
import cartReducer from '../store/cartProduct'
import addressReducer from '../store/addressSlice'
import orderReducer from '../store/orderSlice'


export const store = configureStore({
  reducer: {
    user : userReducer,
    product : productReducer,
    cartItem : cartReducer,
    address : addressReducer,
    orders : orderReducer
  },
   
})