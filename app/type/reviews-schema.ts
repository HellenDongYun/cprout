import * as z from "zod";
export const reviewsSchema = z.object({
  productID: z.number(),
  rating: z
    .number()
    .min(1, { message: "Rating must be at least 1" })
    .max(5, { message: "Rating must be at most 5" }),
  comment: z
    .string()
    .min(10, { message: "Comment must be at least 10 character" }),
});
