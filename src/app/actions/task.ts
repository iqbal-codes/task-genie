"use server";

import { revalidatePath } from "next/cache";
import { Task } from "@/types/database";
import { taskSchema, FormValuesTask } from "@/schema/task";
import { createClient } from "@/utils/supabase/server";
import { ActionStateWithUser } from "@/hooks/use-action-state-with-user";

export async function addTaskAction(
  _state: Awaited<ActionStateWithUser> | null,
  formData: FormData
) {
  const formFields = Object.fromEntries(formData.entries());
  const { name, notes, due_date, task_list_id, reminder } =
    formFields as unknown as FormValuesTask;

  const result = taskSchema.safeParse({
    name,
    notes,
    due_date: due_date ? new Date(due_date) : null,
    task_list_id,
    reminder: reminder ? new Date(reminder) : null,
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert({
    name,
    notes,
    due_date: due_date ? new Date(due_date).toISOString() : null,
    task_list_id: task_list_id === "inbox" ? null : task_list_id,
    user_id: _state?.userId,
    reminder: reminder ? new Date(reminder).toISOString() : null,
  });

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function deletetaskAction(id: string) {
  const supabase = await createClient();

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
    name: formData.get("name"),
    notes: formData.get("notes"),
    start_date: formData.get("start_date"),
    due_date: formData.get("due_date"),
    task_list_id: formData.get("task_list_id"),
  } as { [key: string]: string | undefined };

  const { id, name, notes, start_date, due_date, task_list_id } = formFields;

  const result = taskSchema.safeParse({
    name,
    notes,
    start_date,
    due_date,
    task_list_id,
  });

  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("tasks")
    .update<Partial<Task>>({
      name,
      notes,

      task_list_id,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function toggleTaskAction(id: string, completed: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tasks")
    .update({ completed: !completed })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

