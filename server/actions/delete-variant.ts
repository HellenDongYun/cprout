"use server";

import { createSafeActionClient } from "next-safe-action";
import * as z from "zod";
import { db } from "..";
import { productVariants } from "../schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import algoliasearch from "algoliasearch";

const client = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_ID!,
  process.env.ALGOLIA_ADMIN!
) as any;
const algoliaIndex = client.initIndex("products");

const action = createSafeActionClient();
export const deleteVariant = action(
  z.object({ id: z.number() }),
  async ({ id }) => {
    try {
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath("/dashboard/products");
      algoliaIndex.deleteObject(deletedVariant[0].id.toString());
      return { success: `delete ${deletedVariant[0].productType}` };
    } catch (error) {
      return { error: "Failed to delete variant!" };
    }
  }
);
