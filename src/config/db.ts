// import log from "../utils/logger";
import mongoose from "mongoose";
import config from "./";

// connection to the database
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.MONGO_URI as string);
    // console.info("DB connected successfully");
  } catch (err) {
    // console.error("DB connection failed", err);
  }
};

// close the database connection
const closeDB = async (): Promise<void> => {
  try {
    await mongoose.connection.close();
    // console.info("DB connection closed");
  } catch (err) {
    // console.error("Failed to close DB connection", err);
  }
};

export { connectDB, closeDB };