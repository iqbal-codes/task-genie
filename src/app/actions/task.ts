"use server";

import { revalidatePath } from "next/cache";
import { Task } from "@/types/database";
import { taskSchema, FormValuesTask } from "@/schema/task";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { queryClient } from "@/lib/query-client";

export async function addtaskAction(formData: FormValuesTask) {
  const { name, notes, date, task_list_id } = formData;

  const result = taskSchema.safeParse({
    name,
    notes,
    date,
    task_list_id,
  });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const userData = queryClient.getQueriesData({
    queryKey: ["user"],
  });

  console.log({ userData });

  if (!userData) return { error: "Unauthorized" };

  const supabase = await createClient();

  const { error } = await supabase.from("tasks").insert<Partial<Task>>([
    {
      name,
      notes,
      start_date: date?.from?.toISOString() || null,
      end_date: date?.to?.toISOString() || null,
      task_list_id,
      // user_id: userData.data?.id,
    },
  ]);

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
    end_date: formData.get("end_date"),
    task_list_id: formData.get("task_list_id"),
  } as { [key: string]: string | undefined };

  const { id, name, notes, start_date, end_date, task_list_id } = formFields;

  const result = taskSchema.safeParse({
    name,
    notes,
    start_date,
    end_date,
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
      start_date: start_date || null,
      end_date: end_date || null,
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

