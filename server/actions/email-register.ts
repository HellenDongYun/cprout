"use server";
import { RegisterSchema } from "@/app/type/register-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrpyt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
const action = createSafeActionClient();
export const emailRegister = action(
  RegisterSchema,
  async ({ email, password, name }) => {
    //hash password
    const hashedPassword = await bcrpyt.hash(password, 10);
    //check existing user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (existingUser) {
      //NEED TO CHANGE
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "email confimation resent!" };
      }
      return { error: "Email already exists" };
    }
    //logic when the user is not registered
    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });
    const verificationToken = await generateEmailVerificationToken(email);
    await sendVerificationEmail(
      verificationToken[0].email,
      verificationToken[0].token
    );
    return { success: "email confimation sent!" };
  }
);
