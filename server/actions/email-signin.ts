"use server";
import { LoginSchema } from "@/app/type/login-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";
import { sendVerificationEmail } from "./email";
import { signIn } from "../auth";
import { AuthError } from "next-auth";

// 创建安全动作客户端
export const action = createSafeActionClient();

export const emailSignIn = action(
  LoginSchema,
  async ({ email, password, code }) => {
    try {
      //make a query to the database to check if the user exist
      //check if the user is in the database
      const existingUser = await db.query.users.findFirst({
        where: eq(users.email, email),
      });
      if (existingUser?.email !== email) {
        return { error: "Email not found" };
      }
      // check if the user is verify or not
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(
          existingUser.email
        );
        await sendVerificationEmail(
          verificationToken[0].email,
          verificationToken[0].token
        );
        return { success: "confirmation email sent!" };
      }
      //sign in will triger next-auth, so need to set up the next-auth credentials
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/",
        callbackUrl: "/",
      });
      return { success: email };
    } catch (error) {
      console.log(error);
      if (error instanceof AuthError) {
        switch (error.type) {
          case "AccessDenied":
            return { error: "Invalid email or password" };
          case "OAuthSignInError":
            return { error: "An error occurred during sign in" };
          case "OAuthCallbackError":
            return { error: "An error occurred during callback" };
          case "OAuthAccountNotLinked":
            return { error: "Account not linked" };
          case "CredentialsSignin":
            return { error: "An error occurred during sign in" };
          default:
            return { error: "An error occurred" };
        }
      }
      throw error;
    }
  }
);
