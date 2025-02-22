import { z } from "zod";

export const usernameValidator = z
  .string({
    required_error: "Username is required",
  })
  .trim()
  .min(2, "Must be at least 2 characters long")
  .max(32, "Must be at most 32 characters long");

export const UsernameSchema = z.object({
  username: usernameValidator,
});
export type UsernameSchema = z.infer<typeof UsernameSchema>;
