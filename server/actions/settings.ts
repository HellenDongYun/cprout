"use server";
import { SettingsSchema } from "@/app/type/settings-schema";
import { createSafeActionClient } from "next-safe-action";
import { auth } from "../auth";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";
const action = createSafeActionClient();
export const settings = action(SettingsSchema, async (values) => {
  const user = await auth();
  if (!user) return { error: "user not found!" };
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.user.id),
  });
  if (!dbUser) return { error: "user not found!" };
  if (user.user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.password && values.newPassword && dbUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    );
    if (!passwordMatch) return { error: "password is incorrect!" };
    const samePassword = await bcrypt.compare(
      values.newPassword,
      dbUser.password
    );
    if (samePassword) return { error: "new password is same as old password!" };
    const hashedPassword = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPassword;
    values.newPassword = undefined;
  }
  const updatedUser = await db
    .update(users)
    .set({
      twoFactorEnabled: values.isTwoFactorEnabled,
      name: values.name,
      email: values.email,
      password: values.password,
      image: values.image,
    })
    .where(eq(users.id, dbUser.id));
  //this will refresh the settings page and see the updated info
  revalidatePath("/dashboard/settings");
  return { success: "settings updated!" };
});
