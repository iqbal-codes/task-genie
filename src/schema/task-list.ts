import { z } from "zod";

export const taskListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export type FormValuesTaskList = z.infer<typeof taskListSchema>;