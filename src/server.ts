import app from "."; // Import the app from app.ts
import { connectDB, closeDB } from "./config/db"; // Import the DB connection logic
import config from "./config";

const port = config.port;
let serverInstance: any; // To hold the server instance

// Function to start the server
export const startServer = async () => {
  try {
    await connectDB(); // Connect to the database
    serverInstance = app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
};

// Function to stop the server
export const stopServer = async () => {
  if (serverInstance) {
    serverInstance.close(() => {
      console.log("Server has been stopped");
    });
    await closeDB(); // Close the database connection
  }
};

// Automatically start the server if this file is executed directly
if (require.main === module) {
  startServer();
}