import Dexie, { Table } from "dexie";
import { Task, TaskList } from "@/types/database";
import { User } from "@supabase/supabase-js";

export type SyncStatus = "pending" | "synced" | "failed";

export class TaskGenieDatabase extends Dexie {
  tasks!: Table<Task & { sync_status?: SyncStatus }>;
  taskLists!: Table<TaskList & { sync_status?: SyncStatus }>;
  users!: Table<User>;

  constructor() {
    super("TaskGenieDB");

    this.version(1).stores({
      tasks:
        "&id, name, notes, due_date, task_list_id, user_id, completed, reminder, created_at, updated_at, deleted_at, sync_status",
      taskLists:
        "&id, name, icon, description, user_id, created_at, updated_at, deleted_at, sync_status",
      users: "&id, email, created_at, updated_at, deleted_at",
    });

    this.tasks.hook("creating", (_primKey, obj) => {
      const now = new Date().toISOString();
      obj.created_at = now;
      obj.updated_at = now;
      obj.deleted_at =  null;
    });

    this.tasks.hook("updating", (modifications) => {
      (modifications as Task).updated_at = new Date().toISOString();
    });
  }
}

export const db = new TaskGenieDatabase();

// Helper function to get current user
export const getCurrentUser = async () => {
  const users = await db.users.toArray();
  return users[0]; // Assuming we only store the current user
};

