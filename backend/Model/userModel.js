import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    passwordChangedAt: {
        type: Date
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        default: null
    },
    emailVerifyToken: {
        type: String,
        default: null
    },
    emailVerifyExpiry: {
        type: Date,
        default: null
    }
}, { timestamps: true })

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;