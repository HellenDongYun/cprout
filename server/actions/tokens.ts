"use server";
import { eq } from "drizzle-orm";
import { db } from "..";
import { emailTokens, passwordResetTokens, users } from "../schema";

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

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByEmail(token);
  if (!existingToken) return { error: "token not found" };
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "token has expired" };
  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });
  if (!existingUser) return { error: "user not found" };
  await db.update(users).set({
    emailVerified: new Date(), // 这里应该是更新emailVerified字段为当前时间,这是一个时间戳字段，用来看expired没有
    email: existingToken.email,
  });
  //删除过期的token
  await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  return { success: "email verified" };
};

export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(emailTokens.token, token),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    return passwordResetToken;
  } catch (error) {
    return null;
  }
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60 * 24); // 24 hours
    const existingToken = await getPasswordResetTokenByEmail(email);
    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.id, existingToken.id));
    }
    const passwordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return passwordResetToken;
    
  } catch (error) {
    return null;
    
  }
};
