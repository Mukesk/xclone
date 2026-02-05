import express from "express"
import protectorcookie from "../middleware/protectorcookie.js"
import optionalAuth from "../middleware/optionalAuth.js"
import { followingRequest, searchProfile, suggested, updateProfile } from "../controller/user.control.js"
const userRoute = express.Router()
userRoute.get("/profile/:username", protectorcookie, searchProfile)
userRoute.post("/follow/:id", protectorcookie, followingRequest)
userRoute.get("/suggestion", optionalAuth, suggested)
userRoute.post("/updateProfile", protectorcookie, updateProfile)


export default userRoute