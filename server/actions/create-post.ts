"use server";

import { db } from "@/server";
import { posts } from "../schema";

export default async function createPost(formData: FormData) {
  const title = formData.get("title")?.toString();
  if (!title) return { error: "Title is required" };
  const post = await db.insert(posts).values({
    title,
  });
  return { success: post };
}
