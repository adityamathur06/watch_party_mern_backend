import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser: (state) => {
            state.currentUser = null;
            state.isAuthenticated = false;
        }
    }
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;