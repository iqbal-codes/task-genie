import { db } from "@/lib/db";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const syncService = {
  async syncTasks() {
    // Get all pending tasks
    const pendingTasks = await db.tasks
      .where("sync_status")
      .equals("pending")
      .toArray();

    for (const task of pendingTasks) {
      try {
        const { error } = await supabase.from("tasks").upsert(task);

        if (!error) {
          await db.tasks.update(task.id, { sync_status: "synced" });
        } else {
          await db.tasks.update(task.id, { sync_status: "failed" });
        }
      } catch {
        await db.tasks.update(task.id, { sync_status: "failed" });
      }
    }
  },

  async syncTaskLists() {
    const pendingTaskLists = await db.taskLists
      .where("sync_status")
      .equals("pending")
      .toArray();

    for (const taskList of pendingTaskLists) {
      try {
        const { error } = await supabase.from("task_lists").upsert(taskList);

        if (!error) {
          await db.taskLists.update(taskList.id, { sync_status: "synced" });
        } else {
          await db.taskLists.update(taskList.id, { sync_status: "failed" });
        }
      } catch {
        await db.taskLists.update(taskList.id, { sync_status: "failed" });
      }
    }
  },

  async pullFromServer() {
    // Pull tasks
    const { data: tasks } = await supabase.from("tasks").select("*");
    if (tasks) {
      await db.tasks.bulkPut(
        tasks.map((task) => ({ ...task, sync_status: "synced" }))
      );
    }

    // Pull task lists
    const { data: taskLists } = await supabase.from("task_lists").select("*");
    if (taskLists) {
      await db.taskLists.bulkPut(
        taskLists.map((list) => ({ ...list, sync_status: "synced" }))
      );
    }
  },
};
