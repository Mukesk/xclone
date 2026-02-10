import jwt from "jsonwebtoken"
const generatreCookie=(uid,res)=>{
    const token = jwt.sign({uid}, process.env.JWT_SECRET, {expiresIn:"15d"})
    
    // Set cookie with production-friendly settings
    res.cookie("jvt", token, {
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        secure: process.env.NODE_ENV === "production", // Only secure in production
        domain: process.env.NODE_ENV === "production" ? undefined : "localhost"
    })
    
    // Also send token in response for frontend to store
    return token;
}
export default generatreCookie