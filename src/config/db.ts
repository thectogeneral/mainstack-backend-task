import log from "../utils/logger";
import mongoose from "mongoose";

// connection to the database
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    log.info("DB connected successfully");
  } catch (err) {
    log.error("DB connection failed", err);
  }
};

export default connectDB;