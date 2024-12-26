import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbcon = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Database connection successful");
  } catch (err) {
    console.error("Error in database connection:", err.message);
    process.exit(1); // Exit the process if the database connection fails
  }
};

export default dbcon;
