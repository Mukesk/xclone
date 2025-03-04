import express from "express";
import dotenv from "dotenv";
import router from "./router/router.js";
import dbcon from "./db/dbconnet.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "./router/user.route.js";
import cloudinary from "cloudinary";
import postroute from "./router/post.route.js";
import notRoute from "./router/notification.route.js";
import cors from "cors";
import path from "path";

// Load environment variables
dotenv.config();

const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const app = express();
const PORT = process.env.PORT || 8080; // Default port fallback

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true, 
  methods: "GET, POST, PUT, DELETE",
  allowedHeaders: "Content-Type, Authorization"
}));

app.use(express.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth/", router);
app.use("/api/user", userRoute);
app.use("/api/post/", postroute);
app.use("/api/notification/", notRoute);

// Serve frontend build
// Serve static frontend files
app.use(express.static(path.join(__dirname, "frontend", "dist")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});



// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbcon();
});
