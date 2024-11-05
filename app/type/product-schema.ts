import * as z from "zod";
export const ProductSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number" })
    .positive({ message: "Price must be positive" }),
  description: z
    .string()
    .min(50, { message: "Description must be at least 50 characters long" }),
});
export type zProductSchema = z.infer<typeof ProductSchema>;
