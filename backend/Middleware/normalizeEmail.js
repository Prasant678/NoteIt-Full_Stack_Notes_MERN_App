export const normalizeEmail = (req, res, next) => {
    if (req.body.email) {
        req.body.email = req.body.email.trim().toLowerCase();
    }
    next();
};