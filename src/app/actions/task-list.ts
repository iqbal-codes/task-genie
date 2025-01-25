"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Database, TaskList } from "@/types/database";

const taskListSchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export async function addTaskListAction(formData: FormData) {
  const formFields = {
    name: formData.get("name"),
    icon: formData.get("icon"),
    description: formData.get("description"),
  } as { [key: string]: string | undefined };

  const { name, icon, description } = formFields;

  const result = taskListSchema.safeParse({
    name,
    icon,
    description,
  });
  if (!result.success) {
    return { error: result.error.errors[0].message };
  }

  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("task_lists").insert<Partial<TaskList>>([
    {
      name,
      icon,
      description,
      created_by: user.id,
    },
  ]);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function deleteTaskListAction(id: string) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { error } = await supabase
    .from("task_lists")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function updateTaskListAction(formData: FormData) {
  const formFields = {
    id: formData.get("id"),
    name: formData.get("name"),
    icon: formData.get("icon"),
    description: formData.get("description"),
  } as { [key: string]: string | undefined };

  const { id, name, icon, description } = formFields;

  const result = taskListSchema.safeParse({
    name,
    icon,
    description,
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
    .from("task_lists")
    .update<Partial<TaskList>>({
      name,
      icon,
      description,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  return { success: true };
}

export async function getTaskListsAction() {
  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("task_lists")
    .select("*")
    .is("deleted_at", null)
    .eq("created_by", user.id);

  if (error) return { error: error.message };

  return { data };
}

export async function getTaskListByIdAction(id: string) {
  const supabase = createServerActionClient<Database>({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("task_lists")
    .select("*")
    .is("deleted_at", null)
    .eq("id", id)
    .eq("created_by", user.id)
    .single();

  if (error) return { error: error.message };

  return { data };
}