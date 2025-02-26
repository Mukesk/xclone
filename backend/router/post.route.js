import express from "express"
import protectorcookie from "../middleware/protectorcookie.js"
import { createPost, deletePost, getallPost, getLikedpost, likeUnlike } from "../controller/post.control.js"
import Route from "express/lib/router/route.js"
import { followingPost, forYou, likedPost ,commentPost} from "../controller/post.control.js"
const postroute = express.Router()
postroute.post("/create",protectorcookie,createPost)
postroute.delete("/delete/:id",protectorcookie,deletePost)
postroute.post("/like/:id",protectorcookie,likeUnlike)
postroute.get("/liked/:id",protectorcookie,likedPost)
postroute.get("/foryou",protectorcookie,forYou)
postroute.get("/following",protectorcookie,followingPost)
postroute.get("/likedpost",protectorcookie,getLikedpost)
postroute.get("/getallPosts",protectorcookie,getallPost)
postroute.post("/comment/:id",protectorcookie,commentPost)
export default postroute