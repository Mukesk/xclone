import express from "express"
import protectorcookie from "../middleware/protectorcookie.js"
import { followingRequest, searchProfile, suggested, updateProfile } from "../controller/user.control.js"
const userRoute = express.Router()
userRoute.get("/profile/:username",protectorcookie,searchProfile)
userRoute.post("/follow/:id",protectorcookie,followingRequest)
userRoute.get("/suggestion",protectorcookie,suggested)
userRoute.post("/updateProfile",protectorcookie,updateProfile)


export default userRoute