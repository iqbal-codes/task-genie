import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  due_date: z.date().optional().nullable(),
  task_list_id: z.string().min(1, "Task is required"),
  repeat: z.string().optional().nullable(),
  reminder: z.date().optional().nullable(),
});

export type FormValuesTask = z.infer<typeof taskSchema>;

