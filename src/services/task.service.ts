import { Task } from "@/types/database";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const getAllTasks = async (view: string) => {
  let query = supabase.from("tasks").select("*");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (view === "inbox") {
    query = query.is("task_list_id", null);
  } else if (view === "today") {
    query = query
      .gte("due_date", today.toISOString())
      .lt(
        "due_date",
        new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
      );
  } else if (view === "upcoming") {
    query = query.gt(
      "due_date",
      new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Task[];
};

