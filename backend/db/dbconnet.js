import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Debug: Check if MONGO variable is loaded
console.log('MongoDB URI loaded:', process.env.MONGO ? 'Yes' : 'No');

const dbcon = async () => {
  try {
    if (!process.env.MONGO) {
      console.warn('⚠️  No MongoDB connection string found. Running without database.');
      return;
    }
    
    await mongoose.connect(process.env.MONGO);
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.warn('⚠️  Continuing without database. Some features may not work.');
    console.warn('💡 To fix: Install MongoDB locally or check your internet connection for Atlas.');
    // Don't exit - continue without database for development
  }
};

export default dbcon;
