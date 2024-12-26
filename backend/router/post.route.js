import express from "express"
import protectorcookie from "../middleware/protectorcookie.js"
import { createPost, deletePost } from "../controller/post.control.js"
const postroute = express.Router()
postroute.post("/create",protectorcookie,createPost)
postroute.delete("/delete/:id",protectorcookie,deletePost)
export default postroute