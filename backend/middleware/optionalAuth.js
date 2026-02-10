import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jvt;
        if (!token) {
            return next(); // Proceed as guest
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return next(); // Proceed as guest
        }

        const user = await User.findById(decoded.uid).select("-password");
        if (user) {
            req.user = user; // Attach user if found
        }

        next();
    } catch (err) {
        // If token is invalid or any other error, just proceed as guest
        // Don't crash or send error response
        next();
    }
};

export default optionalAuth;
