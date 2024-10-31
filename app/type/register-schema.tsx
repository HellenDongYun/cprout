import * as z from "zod";
export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  name: z.string().min(1, {
    message: "Name must be at least 1 character",
  }),
});