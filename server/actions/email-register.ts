"use server";
import { RegisterSchema } from "@/app/type/register-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrpyt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
const action = createSafeActionClient();
export const emailRegister = action(
  RegisterSchema,
  async ({ email, password, name }) => {
    const hashedPassword = await bcrpyt.hash(password, 10);
    console.log(hashedPassword);
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      //NEED TO CHANGE
      // if (!existingUser.emailVerified) {
      //   await db.query.users.update({
      //     where: eq(users.id, existingUser.id),
      //     data: {
      //       emailVerified: true,
      //     },
      //   });
      // }
      return { error: "Email already exists" };
    }
    return { success: "Congrats!" };
  }
);
