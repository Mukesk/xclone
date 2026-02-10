import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import router from "./router/router.js";
import dbcon from "./db/dbconnet.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoute from "./router/user.route.js";
import cloudinary from "cloudinary";
import postroute from "./router/post.route.js";
import notRoute from "./router/notification.route.js";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Debug environment loading
console.log('Environment loaded:', {
  MONGO: process.env.MONGO ? 'Present' : 'Missing',
  JWT_SECRET: process.env.JWT_SECRET ? 'Present' : 'Missing',
  PORT: process.env.PORT || 'Using default'
});

// __dirname is already defined above

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();
const PORT = process.env.PORT || 8080; // Default port fallback

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow localhost for development
    if (origin.includes('localhost')) {
      return callback(null, true);
    }

    // Allow Render deployments
    if (origin.includes('.onrender.com')) {
      return callback(null, true);
    }

    // Allow specific frontend URL if set
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    // Allow Vercel deployments (in case still using)
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

app.use(express.json({ limit: "5000mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
app.use(cookieParser());

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use("/api/", limiter);

// Routes
app.use("/api/auth/", router);
app.use("/api/user", userRoute);
app.use("/api/post/", postroute);
app.use("/api/notification/", notRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'XClone Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'XClone API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth/*',
      users: '/api/user/*',
      posts: '/api/post/*',
      notifications: '/api/notification/*'
    }
  });
});


// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  dbcon();
});
