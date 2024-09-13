require("dotenv").config();

import cors from "cors";
import express, { Express, Request, Response } from "express";
import config from "./config";
import log from "./utils/logger";
import connectDB from "./config/db";
import userRouter from "./routes/auth";
import bodyParser from 'body-parser';
import productRouter from "./routes/product";

const port = config.port;
const server: Express = express();

server.use(bodyParser.json());

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
server.use("/api", productRouter);


connectDB()
.then(async () => {
  server.listen(port, () => {
    log.info(`Server is listening on port ${port}`);
  });
})

/**
 * Catches any errors that occur in the preceding Promise chain and logs the error.
 *
 * @param {Error} error - The error object caught from the Promise chain.
 */
.catch((error: Error) => log.error(error));



export default server;