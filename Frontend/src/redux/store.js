import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import adminReducer from './slices/adminSlice';
import themeReducer from './slices/themeSlice';
import sellerReducer from './slices/sellerSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        product: productReducer,
        admin: adminReducer,
        theme: themeReducer,
        seller: sellerReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
});

export default store;
