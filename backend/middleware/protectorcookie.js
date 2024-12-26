import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

const protectorcookie= async (req, res, next) => {
  try {
    // Check if the token exists in cookies
    const token = req.cookies.jvt;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECERT);
    if (!decoded) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.uid).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Attach the user object to the request
    req.user = user;
    next();
  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ error: "Internal server error. Please try again." });
  }
};

export default protectorcookie;
