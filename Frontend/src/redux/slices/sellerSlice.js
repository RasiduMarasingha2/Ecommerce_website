import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Fetch Seller Stats
export const fetchSellerStats = createAsyncThunk(
    'seller/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosClient.get('/seller/dashboard');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch seller stats');
        }
    }
);

const initialState = {
    stats: null,
    recentOrders: [],
    loading: false,
    error: null,
};

const sellerSlice = createSlice({
    name: 'seller',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellerStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellerStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.recentOrders = action.payload.recentOrders;
            })
            .addCase(fetchSellerStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default sellerSlice.reducer;
