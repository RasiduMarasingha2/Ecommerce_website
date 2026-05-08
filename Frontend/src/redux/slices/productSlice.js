import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    allProducts: [],
    filteredProducts: [],
    selectedCategory: 'all',
    searchQuery: '',
};

// Helper to filter products
const applyFilters = (state) => {
    let result = state.allProducts;
    
    // 1. Filter by category
    if (state.selectedCategory !== 'all') {
        result = result.filter(p => p.category.toLowerCase() === state.selectedCategory);
    }
    
    // 2. Filter by search query
    if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(p => p.title.toLowerCase().includes(query));
    }
    
    state.filteredProducts = result;
};

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action) => {
            state.allProducts = action.payload;
            applyFilters(state);
        },
        setCategoryFilter: (state, action) => {
            state.selectedCategory = action.payload.toLowerCase();
            applyFilters(state);
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            applyFilters(state);
        }
    },
});

export const { setProducts, setCategoryFilter, setSearchQuery } = productSlice.actions;
export default productSlice.reducer;
