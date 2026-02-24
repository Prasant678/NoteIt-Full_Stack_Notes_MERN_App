import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/features/authSlice";
import noteReducer from "../redux/features/noteSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        notes: noteReducer
    }
})