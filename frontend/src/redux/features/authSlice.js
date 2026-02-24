import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import api from "../services/api";

export const signupUser = createAsyncThunk("auth/signup",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/signup", { name, email, password });

            if (!res.data.success) {
                return rejectWithValue(res.data);
            }

            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Signup failed!" });
        }
    }
)

export const loginUser = createAsyncThunk("auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/login", { email, password });

            if (!res.data.success) {
                return rejectWithValue(res.data);
            }

            return { ...res.data, triedEmail: email };
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Login Failed!" });
        }
    }
)

export const forgotPassword = createAsyncThunk("auth/forgotPassword",
    async ({ email }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/forgot-password", { email });

            if (!res.data.success) {
                return rejectWithValue(res.data);
            }

            return res.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Forgot to Send OTP!" });
        }
    }
)

export const resetPassword = createAsyncThunk("auth/resetPassword",
    async ({ email, otp, newPassword }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/reset-password", { email, otp, newPassword });

            if (!res.data.success) {
                return rejectWithValue(res.data);
            }

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Reset Password Failed!" });
        }
    }
)

export const refreshToken = createAsyncThunk("auth/refreshToken",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/refresh-token");
            return res.data;
        } catch (error) {
            if (error.response?.status === 401) {
                return rejectWithValue(null);  // silent fail
            }
            return rejectWithValue(error.response?.data);
        }
    }
);

export const resendVerification = createAsyncThunk("auth/resendVerification",
    async ({ email }, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/resend-verification", { email });

            if (!res.data.success) {
                return rejectWithValue(res.data);
            }

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to resend link" });
        }
    }
)

export const logoutUser = createAsyncThunk("auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/user/logout");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
)

const initialState = {
    user: null,
    isAuthenticated: false,
    isAuthChecked: false,
    loading: false,
    resendLoading: false,
    error: null,
    otpSent: false,
    shouldOfferResend: false,
    resendEmail: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearOtp: (state) => {
            state.otpSent = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action.payload?.message || "Signup Success, Verify Your Email");
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(state.error)
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.shouldOfferResend = false;
                state.resendEmail = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.isAuthenticated = true;
                state.isAuthChecked = true;
                state.shouldOfferResend = false;
                state.resendEmail = null;
                toast.success(action.payload?.message || "Login Successfull");
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(state.error);

                const triedEmail = action.meta?.arg?.email;
                if (action.payload?.message === "Email not verified" && triedEmail) {
                    state.shouldOfferResend = true;
                    state.resendEmail = triedEmail;
                }
            })
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;
                toast.success(action.payload?.message || "OTP Sent Successfully");
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(state.error);
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                toast.success(action.payload?.message || "Password Updated Successfully");
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                toast.error(state.error);
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.isAuthChecked = true;
                state.user = action.payload.user;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
                state.isAuthChecked = true;
            })
            .addCase(resendVerification.pending, (state) => {
                state.resendLoading = true;
            })
            .addCase(resendVerification.fulfilled, (state, action) => {
                state.resendLoading = false;
                state.shouldOfferResend = false;
                toast.success(action.payload?.message || "Resend Varification Link");
            })
            .addCase(resendVerification.rejected, (state, action) => {
                state.resendLoading = false;
                state.error = action.payload?.message;
                toast.error(state.error);
            })
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
                state.shouldOfferResend = false;
                state.resendEmail = null;
                toast.success(action.payload?.message || "Logout Successfully");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Logout failed";
                toast.error(state.error)
            })
    }
})

export const { clearOtp } = authSlice.actions;
export default authSlice.reducer;