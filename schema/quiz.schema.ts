import { z } from "zod";

export const titleValidator = z
  .string({
    required_error: "Title is required",
  })
  .min(1, "Must not be empty")
  .max(255, "Must be at most 255 characters");

export const descriptionValidator = z
  .string({
    required_error: "Description is required",
  })
  .min(1, "Must not be empty")
  .max(1023, "Must be at most 1023 characters");

export const imageValidator = z
  .string({
    required_error: "Image is required",
  })
  .url("Must be a valid URL")
  .min(1, "Must not be empty")
  .max(1024, "Must be at most 255 characters");

export const QuizCreateSchema = z.object({
  title: titleValidator,
  description: descriptionValidator.optional(),
  image: imageValidator.optional(),
});
export type QuizCreateSchema = z.infer<typeof QuizCreateSchema>;

export const QuizUpdateSchema = z.object({
  title: titleValidator.optional(),
  description: descriptionValidator.optional(),
  image: imageValidator.optional(),
});
export type QuizUpdateSchema = z.infer<typeof QuizUpdateSchema>;
