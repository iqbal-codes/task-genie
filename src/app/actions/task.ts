"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Database, Task } from "@/types/database";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  notes: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  task_list_id: z.string().min(1, "Task list is required"),
});

export async function addtaskAction(formData: FormData) {
  const formFields = {
    title: formData.get("title"),
    notes: formData.get("notes"),
    start_date: formData.get("start_date"),
    task_list_id: formData.get("task_list_id"),
    end_date: formData.get("end_date"),
  } as { [key: string]: string | undefined };

  const { title, notes, start_date, end_date, task_list_id } = formFields;

  const result = taskSchema.safeParse({
    title,
    notes,
    start_date,
    end_date,
    task_list_id,
  });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("tasks").insert<Partial<Task>>([
    {
      title,
      notes,
      start_date: start_date || null,
      end_date: end_date || null,
      user_id: user.id,
      task_list_id,
    },
  ]);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function deletetaskAction(id: string) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { error } = await supabase
    .from("tasks")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function updateTaskAction(formData: FormData) {
  const formFields = {
    id: formData.get("id"),
    title: formData.get("title"),
    notes: formData.get("notes"),
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date"),
    task_list_id: formData.get("task_list_id"),
  } as { [key: string]: string | undefined };

  const { id, title, notes, start_date, end_date, task_list_id } = formFields;

  const result = taskSchema.safeParse({
    title,
    notes,
    start_date,
    end_date,
    task_list_id,
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("tasks")
    .update<Partial<Task>>({
      title,
      notes,
      start_date: start_date || null,
      end_date: end_date || null,
      task_list_id,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

