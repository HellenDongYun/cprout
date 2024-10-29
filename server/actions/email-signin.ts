"use server";
import { LoginSchema } from "@/app/type/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

// 创建安全动作客户端
export const action = createSafeActionClient();

export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    //make a query to the database to check if the user exist
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser?.email !== email) {
      return { error: "Email not found" };
    }

    console.log(email, password, code);
  }
);
