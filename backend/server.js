import express from "express"
import dotenv from 'dotenv'
import router from './router/router.js'
import dbcon from "./db/dbconnet.js"
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser"
import userRoute from "./router/user.route.js"
import cloudinary from "cloudinary"
import postroute from "./router/post.route.js"
cloudinary.config(process.env.CLOUDINARY_KEY ,process.env.CLOUDINARY_SECERT)
dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use( bodyParser.json() );      
app.use(cookieParser())
app.use(bodyParser.urlencoded({  extended: true }));
app.use("/api/auth/",router)
app.use("/api/user" ,userRoute)
app.use("/api/post/",postroute)
app.use(express.json())
app.listen(PORT,()=>{
    dbcon();
})