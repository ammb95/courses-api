import { config } from "dotenv";

export const getEnvVariables = () => {
  config();
  return {
    APP_PORT: process.env.APP_PORT,
    DB_PORT: process.env.DB_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_REGION: process.env.DB_REGION,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  };
};
