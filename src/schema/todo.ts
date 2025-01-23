import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Task title is required"),
});

export type TodoFormData = z.infer<typeof todoSchema>;