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
// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
        console.log('CORS Origin:', origin);
        
        // Allow no origin (for mobile apps, Postman, etc.)
        if (!origin) {
            return callback(null, true);
        }
        
        // Allow localhost for development
        if (origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // Allow any mukesks-projects.vercel.app subdomain
        if (origin.includes('mukesks-projects.vercel.app')) {
            return callback(null, true);
        }
        
        // Allow any .vercel.app domain (for other deployments)
        if (origin.includes('.vercel.app')) {
            return callback(null, true);
        }
        
        console.log('CORS Blocked:', origin);
        callback(new Error('Not allowed by CORS'));
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

// Add explicit preflight handling
app.options('*', cors());

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