import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllTaskLists = async () => {
  const { data, error } = await supabase
    .from("task_lists")
    .select(
      `
      *,
      task_count:tasks(count)
    `
    )
    .is("deleted_at", null);

  if (error) throw error;
  return data;
};

