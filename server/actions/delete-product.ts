"use server";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { db } from "..";
import { products } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const action = createSafeActionClient();
export const deleteProduct = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const data = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      return { success: `product ${data[0].title}deleted successfully!` };
    } catch (error) {
      return { error: "fail to delete product!" };
    }
  }
);
