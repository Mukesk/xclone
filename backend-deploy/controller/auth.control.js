import monogoose from 'mongoose'
import User from '../model/usermodel.js'
import bcryptjs from "bcryptjs"
import generatreCookie from "../util/cookiegen.js"
import jwt from 'jsonwebtoken'
export const signup = async (req,res)=>{
    const {username,firstname,lastname,password,email}=req.body
    const existsuser= await User.findOne({username:username})
    
    const existsemail=  await User.findOne({email:email})
    
     if(existsuser){
        return res.status(400).json({ error:"404- username already exits"})
     }
    if(existsemail){
        return res.status(400).json({ error:"404- email already exits"})
    }
    const re = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    if (!re.test(email)){
        res.status(400).json({error:"enter valid email"})
    }
    if (!password.length>6){
        res.status(400).json({error:"enter valid pass"})

    }
    const salt =  await bcryptjs.genSalt(10)
    const hashpass = await bcryptjs.hash(password,salt)
    const newUser= new User({
        username,
        firstname,
        password:hashpass,
        email,
        lastname
    })
    
    if (newUser)
{
    generatreCookie(newUser._id,res)
    await newUser.save()
    res.status(200).json({
        _id:newUser._id,
        username:newUser.username,
        firstname:newUser.firstname,
        lastname:newUser.lastname,
        email:newUser.email,
        password:newUser.password,
        followers:newUser.followers,


    })
    
}
else{
    res.status(400).json({error:"invalid details"})
}
     
    

}
     
export const login = async(req,res)=>{
    const {username,password }=req.body
    const existsusername=await User.findOne({username})
    const ispasscorrect= await bcryptjs.compare(password, existsusername?.password||"")
   if(!existsusername ||!ispasscorrect){
    res.status(400).json({err:"invalid passwor and username"})
   }
   else{generatreCookie(existsusername._id,res)
   res.status(200).json({
    _id:existsusername._id,
    username:existsusername.username,
    firstname:existsusername.firstname,
    lastname:existsusername.lastname,
    email:existsusername.email,
    password:existsusername.password,
    followers:existsusername.followers,
   }


)


    }
}
export const logout = async(req,res)=>{
    try {
        res.cookie("jvt", "", {
          maxAge: 0, // Expire immediately
          httpOnly: true, // Secure and inaccessible from client-side scripts
          secure: true, // Use true if running over HTTPS
          sameSite: "Strict", // Prevent cross-site cookie issues
        });
        res.status(200).json({ msg: "Logout successful" });
      } catch (err) {
        res.status(500).json({ err: "Error during logout" });
      }
      
                }
        
        export const getme = async (req, res) => {
            try {
              // Check if req.user exists
              if (!req.user || !req.user._id) {
                return res.status(401).json({ error: "Unauthorized. User not found in request." });
              }
          
              // Fetch user from the database
              const user = await User.findById(req.user._id).select("-password");
          
              if (!user) {
                return res.status(404).json({ error: "User not found." });
              }
          
              // Respond with user data
              res.status(200).json(user);
            } catch (err) {
              console.error("Error fetching user:", err);
              res.status(500).json({ error: "Internal server error. Please try again." });
            }
          };
          