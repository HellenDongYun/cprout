"use server";
import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens } from "../schema";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      ///这里kennel是错误的， token 怎么可能等于email呢？
      where: eq(emailTokens.token, email),
      // where: eq(emailTokens.email, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};
export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24); // 24 hours
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }
  const verificationToken = await db
    .insert(emailTokens)
    .values({
      token,
      email,
      expires,
    })
    .returning();
  return verificationToken;
};
