"use server";
// server action only implement in server side

import { db } from "@/server";
export async function getPosts() {
  const posts = await db.query.posts.findMany();
  // if (!posts) throw new Error("No posts found");
  if (!posts) return { error: "No posts found" };
  // return { success: true, posts };
  return { success: posts };
}
