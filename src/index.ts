require("dotenv").config();

import cors from "cors";
import express, { Express, Request, Response } from "express";
import config from "./config";
//import log from "./utils/logger";
import { connectDB } from "./config/db";
import userRouter from "./routes/auth";
import productRouter from "./routes/product";

const port = config.port || 4000;
const server: Express = express();

server.use(express.json());
server.options("*", cors());
server.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Authorization",
    ],
  }),
);

server.use("/", userRouter);
server.use("/api/v1", productRouter);


let serverInstance: any; // To store the reference to the running server

connectDB()
  .then(async () => {
    serverInstance = server.listen(port, () => {
      //console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((error: Error) => console.error(error));

/**
 * Function to close the server instance.
 * Useful for gracefully shutting down the server in tests.
 */
export const closeServer = () => {
  if (serverInstance) {
    serverInstance.close()
  }
};


export default server;