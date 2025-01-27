import { DateRange } from "react-day-picker";
import { z } from "zod";

export const taskSchema = z.object({
  name: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  date: z
    .object({
      from: z.date().optional(),
      to: z.date().optional(),
    })
    .optional(),
  task_list_id: z.string().min(1, "Task list is required"),
});

export type FormValuesTask = {
  name: string;
  notes?: string;
  date?: DateRange;
  task_list_id: string;
};

