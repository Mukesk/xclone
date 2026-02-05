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

// Get directory paths for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

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
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
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

// Serve frontend build
// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
});



// Start server
// Export for Vercel
export default app;

// Start server only if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    dbcon();
  });
} else {
  // For Vercel (imported as module), connect to DB
  // Note: in serverless, connection reuse is handled by mongoose internally
  dbcon();
}
