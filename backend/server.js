import express from "express"
import dotenv from 'dotenv'
import router from './router/router.js'
import dbcon from "./db/dbconnet.js"
import bodyParser from 'body-parser'
import cookieParser from "cookie-parser"
import userRoute from "./router/user.route.js"
import cloudinary from "cloudinary"
import postroute from "./router/post.route.js"
import notRoute from "./router/notification.route.js"
import cors from "cors"


cloudinary.config(process.env.CLOUDINARY_KEY ,process.env.CLOUDINARY_SECERT)
dotenv.config()
const app = express()
const PORT = process.env.PORT
app.use( bodyParser.json({ limit: "5000mb" }) );      
app.use(cookieParser())



app.use(cors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    credentials: true // Allow cookies if needed
  }));
  app.use(express.json({ limit: "5000mb" })); // Increase JSON request limit
// Increase URL-encoded limit

  app.use(cors({ origin: "http://localhost:5173", credentials: true }))


app.use(bodyParser.json({ limit: "150mb" })); // Increase JSON payload limit
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));

app.use("/api/auth/",router)
app.use("/api/user" ,userRoute)
app.use("/api/post/",postroute)

app.use("/api/notification/",notRoute)

app.listen(PORT,()=>{
    dbcon();
})