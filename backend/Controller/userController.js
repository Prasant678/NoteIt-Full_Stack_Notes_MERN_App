import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel.js';
import validator from 'validator';
import bcrypt from 'bcrypt';
import sendEmail from '../Middleware/sendEmail.js';

const hashWithCrypto = (value) => {
    return crypto.createHash("sha256").update(value).digest("hex");
}

const generateEmailVerifyToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
}

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
}

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax",
    maxAge
});

export const signupUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All Fields are Required!" });
        }

        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(409).json({ success: false, message: "User Already Exists!" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Provide a Valid Email Type!" });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be 8 characters!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword
        })

        const emailToken = generateEmailVerifyToken();
        newUser.emailVerifyToken = hashWithCrypto(emailToken);
        newUser.emailVerifyExpiry = Date.now() + 15 * 60 * 1000;

        await newUser.save();

        const verifyLink = `${process.env.BACKEND_URL}/api/user/verify-email?token=${emailToken}`;

        await sendEmail(email, "Verify Your Email", `<p>Click <a href=${verifyLink}>here </a>to verify your email address for login (validate for 15m only!)</p>`);

        return res.status(201).json({ success: true, message: "Sign Up SuccessFull, Please Verify your Email to Login" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Signup User!", error: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const { token } = req.query;

    try {
        if (!token) {
            return res.redirect(`${process.env.FRONTEND_URL}/?verified=false`);;
        }

        const user = await userModel.findOne({
            emailVerifyToken: hashWithCrypto(token),
            emailVerifyExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/?verified=false`);;
        }

        user.isEmailVerified = true;
        user.emailVerifyToken = null;
        user.emailVerifyExpiry = null;

        await user.save();

        return res.status(302).redirect(`${process.env.FRONTEND_URL}/?verified=true`);
    } catch (error) {
        return res.redirect(`${process.env.FRONTEND_URL}/?verified=false`);
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All Fields are Required!" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Provide a Valid Email Type!" });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "Invalid Email-Id or Password!" });
        }
        if (!user.isEmailVerified) {
            return res.status(403).json({ success: false, message: "Email not verified" });
        }

        const matchedPassword = await bcrypt.compare(password, user.password);
        if (!matchedPassword) {
            return res.status(400).json({ success: false, message: "Invalid Email-Id or Password!" });
        }

        const token = generateToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        user.refreshToken = hashWithCrypto(refreshToken);
        await user.save();

        res.cookie("token", token, cookieOptions(15 * 60 * 1000));
        res.cookie("refreshToken", refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

        return res.status(200).json({
            success: true, message: "Login Successfull", user: {
                name: user.name,
                email: user.email,
                isEmailVerified: user.isEmailVerified
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Login User!", error: error.message });
    }
}

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(200).json({ isAuthenticated: false, user: null });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await userModel.findById(decoded.id);

        if (!user || user.refreshToken !== hashWithCrypto(refreshToken)) {
            return res.status(200).json({ isAuthenticated: false, user: null });
        }

        if (user.passwordChangedAt) {
            const passwordChangedTime =
                parseInt(user.passwordChangedAt.getTime() / 1000, 10);

            if (decoded.iat < passwordChangedTime) {
                return res.status(200).json({ isAuthenticated: false, user: null });
            }
        }

        const newAccessToken = generateToken(user._id);

        res.cookie("token", newAccessToken, cookieOptions(15 * 60 * 1000));

        return res.status(200).json({ isAuthenticated: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        return res.status(200).json({ isAuthenticated: false, user: null });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Provide a Valid Email Type!" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User Doesn't Exists!" });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = hashWithCrypto(otp);
        user.otpExpiry = Date.now() + 10 * 60 * 1000;

        await user.save();

        await sendEmail(email, "OTP for Reset Password", `<p>Your OTP is ${otp} (Validate for 10 min)</p>`);

        return res.status(200).json({ success: true, message: "OTP Sent Successfully!" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Forgot Password!", error: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: "All Fields are Required!" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Provide a Valid Email Type!" });
        }
        if (newPassword.length < 8) {
            return res.status(400).json({ success: false, message: "Password must be 8 characters!" });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User Doesn't Exists!" });
        }
        if (user.otp !== hashWithCrypto(otp) || user.otpExpiry < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid or Expired Otp!" });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.passwordChangedAt = new Date();
        user.refreshToken = null;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.clearCookie("token", cookieOptions(0));
        res.clearCookie("refreshToken", cookieOptions(0));

        return res.status(200).json({ success: true, message: "Password reset successful. Please login again." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Reset Password", error: error.message });
    }
}

export const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;

    try {
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Provide a Valid Email Type!" });
        }
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User Doesn't Found!" });
        }
        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: "Email Already Verified!" });
        }

        const emailToken = generateEmailVerifyToken();
        user.emailVerifyToken = hashWithCrypto(emailToken);
        user.emailVerifyExpiry = Date.now() + 15 * 60 * 1000;

        await user.save();

        const verifyLink = `${process.env.BACKEND_URL}/api/user/verify-email?token=${emailToken}`;

        await sendEmail(email, "Resend Email Verification", `<p>Click <a href=${verifyLink}>here </a>to verify your email address for login (validate for 15m only!)</p>`);

        return res.status(201).json({ success: true, message: "Verification mail Re-sent!" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Resend Verification Email!", error: error.message });
    }
}

export const logoutUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Doesn't Found!" });
        }

        user.refreshToken = null;

        res.clearCookie("token", cookieOptions(0));
        res.clearCookie("refreshToken", cookieOptions(0));

        await user.save();

        return res.status(200).json({ success: true, message: "Logout SuccessFull" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Error in Logout User!", error: error.message });
    }
}