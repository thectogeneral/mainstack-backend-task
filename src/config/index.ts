import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT ?? 8000,
  "api-prefix": "api/v1",
  MONGO_URI: process.env.MONGO_URI
};

export default config;
