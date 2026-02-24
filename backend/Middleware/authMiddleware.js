import jwt from 'jsonwebtoken';
import userModel from '../Model/userModel.js';

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized, token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        if (user.passwordChangedAt) {
            const passwordChangedTime = parseInt(user.passwordChangedAt.getTime() / 1000, 10);

            if (decoded.iat < passwordChangedTime) {
                return res.status(401).json({ success: false, message: "Password Recently Changed, Please Login Again"});
            }
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
}

export default authMiddleware