import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({
  path: ".env.local",
});
export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema.ts",
  //driver: "pg",
  out: "./server/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!, // 从环境变量中读取连接字符串
  },
});
