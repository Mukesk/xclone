import express from "express";
import dotenv from "dotenv";
import router from "../backend/router/router.js";
import dbcon from "../backend/db/dbconnet.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "../backend/router/user.route.js";
import cloudinary from "cloudinary";
import postroute from "../backend/router/post.route.js";
import notRoute from "../backend/router/notification.route.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

// Connect to database
let isConnected = false;
const connectDB = async () => {
    if (!isConnected) {
        await dbcon();
        isConnected = true;
    }
};

// Middleware
app.use(cors({
    origin: function(origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            "http://localhost:5173",
            "http://localhost:5174",
            "https://localhost:5173",
            "https://localhost:5174"
        ];
        
        // Allow Vercel preview deployments and production
        if (!origin || 
            allowedOrigins.includes(origin) || 
            origin.includes('.vercel.app') ||
            origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "Accept", 
        "X-Requested-With",
        "Origin",
        "Cache-Control",
        "Pragma"
    ],
    exposedHeaders: ["Set-Cookie"],
    preflightContinue: false,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Routes
app.use("/api/auth/", router);
app.use("/api/user", userRoute);
app.use("/api/post/", postroute);
app.use("/api/notification/", notRoute);

// Health check
app.get("/api", (req, res) => {
    res.json({ message: "XClone API is running!" });
});

// Serverless function handler
export default async (req, res) => {
    await connectDB();
    return app(req, res);
};