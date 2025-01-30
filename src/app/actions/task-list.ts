"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Database, TaskList } from "@/types/database";
import { taskListSchema } from "@/schema/task-list";
import { createClient } from "@/utils/supabase/server";
import { ActionStateWithUser } from "@/hooks/use-action-state-with-user";

export async function addTaskListAction(
  _state: Awaited<ActionStateWithUser> | null,
  formData: FormData
) {
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

  const supabase = await createClient();

  const { error } = await supabase
    .from("task_lists")
    .insert<Partial<TaskList>>([
      {
        name,
        icon,
        description,
        user_id: _state?.userId,
      },
    ]);

  if (error) return { error: error.message };

  return { success: true };
}

export async function deleteTaskListAction(
  _state: ActionStateWithUser,
  id: string
) {
  const supabase = createServerActionClient<Database>({ cookies });

  const { error } = await supabase
    .from("task_lists")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);

  if (error) return { error: error.message };

  return { success: true };
}

export async function updateTaskListAction(
  _state: ActionStateWithUser,
  formData: FormData
) {
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

