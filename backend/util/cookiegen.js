import jwt from "jsonwebtoken"
const generatreCookie=(uid,res)=>{
const token =jwt.sign({uid},process.env.JWT_SECRET,{expiresIn:"15d"})
    res.cookie("jvt",token,{
        maxAge:15*24*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV  !== "development"
    })

}
export default generatreCookie