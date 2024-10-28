import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "@/server/schema";
import dotenv from "dotenv";

dotenv.config();

//schema might have all kinds of schema thats why we import *(all)
const sql = neon(
  process.env.POSTGRES_URL ||
    "postgres://neondb_owner:v0m4WpDJGXiq@ep-billowing-unit-a7rc9d4q-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require"
);
export const db = drizzle(sql, { schema, logger: true });
