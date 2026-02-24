import express from 'express';
import { forgotPassword, loginUser, logoutUser, refreshAccessToken, resendVerifyEmail, resetPassword, signupUser, verifyEmail } from '../Controller/userController.js';
import { normalizeEmail } from '../Middleware/normalizeEmail.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const userRouter = express.Router();

userRouter.post("/signup", normalizeEmail, signupUser);
userRouter.get("/verify-email", verifyEmail);
userRouter.post("/resend-verification", normalizeEmail, resendVerifyEmail);
userRouter.post("/login", normalizeEmail, loginUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.post("/forgot-password", normalizeEmail, forgotPassword);
userRouter.post("/reset-password", normalizeEmail, resetPassword);
userRouter.post("/logout", authMiddleware, logoutUser);

export default userRouter