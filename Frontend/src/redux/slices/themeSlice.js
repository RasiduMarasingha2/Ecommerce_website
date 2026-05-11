import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axiosClient';

export const fetchTheme = createAsyncThunk(
    'theme/fetchTheme',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axios.get('/admin/theme');
            // Apply CSS variables to root
            const root = document.documentElement;
            if (data.primaryColor) root.style.setProperty('--color-primary', data.primaryColor);
            if (data.secondaryColor) root.style.setProperty('--color-secondary', data.secondaryColor);
            if (data.backgroundColor) root.style.setProperty('--color-bg', data.backgroundColor);
            if (data.textColor) root.style.setProperty('--color-text', data.textColor);
            
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch theme');
        }
    }
);

export const updateTheme = createAsyncThunk(
    'theme/updateTheme',
    async (themeData, { rejectWithValue }) => {
        try {
            const { data } = await axios.put('/admin/theme', themeData);
            const root = document.documentElement;
            if (data.primaryColor) root.style.setProperty('--color-primary', data.primaryColor);
            if (data.secondaryColor) root.style.setProperty('--color-secondary', data.secondaryColor);
            if (data.backgroundColor) root.style.setProperty('--color-bg', data.backgroundColor);
            if (data.textColor) root.style.setProperty('--color-text', data.textColor);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update theme');
        }
    }
);

const initialState = {
    currentTheme: {},
    loading: false,
    error: null,
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        setThemeLocally: (state, action) => {
            state.currentTheme = { ...state.currentTheme, ...action.payload };
            const root = document.documentElement;
            Object.keys(action.payload).forEach(key => {
                if (key === 'primaryColor') root.style.setProperty('--color-primary', action.payload[key]);
                if (key === 'secondaryColor') root.style.setProperty('--color-secondary', action.payload[key]);
                if (key === 'backgroundColor') root.style.setProperty('--color-bg', action.payload[key]);
                if (key === 'textColor') root.style.setProperty('--color-text', action.payload[key]);
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTheme.fulfilled, (state, action) => {
                state.currentTheme = action.payload;
                state.loading = false;
            })
            .addCase(updateTheme.fulfilled, (state, action) => {
                state.currentTheme = action.payload;
                state.loading = false;
            })
            .addCase(fetchTheme.pending, (state) => { state.loading = true; })
            .addCase(updateTheme.pending, (state) => { state.loading = true; });
    }
});

export const { setThemeLocally } = themeSlice.actions;
export default themeSlice.reducer;
