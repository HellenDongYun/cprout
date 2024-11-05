"use server";

import { ProductSchema } from "@/app/type/product-schema";
import { createSafeActionClient } from "next-safe-action";
import { db } from "..";
import { eq } from "drizzle-orm";
import { products } from "../schema";

const action = createSafeActionClient();
export const createProduct = action(
  ProductSchema,
  async ({ title, description, price, id }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) return { error: "Product not found!" };
        const editProduct = await db
          .update(products)
          .set({ description, title, price })
          .where(eq(products.id, id))
          .returning();
        return {
          success: `product ${editProduct[0].title} edited successfully!`,
        };
      }
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({ title, description, price })
          .returning();
        return {
          success: `new product ${newProduct[0].title} has been created!`,
        };
      }
    } catch (error) {
      // Handle error
      return { error: JSON.stringify(error) };
    }
  }
);
