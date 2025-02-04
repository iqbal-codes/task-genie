import { db, getCurrentUser, SyncStatus } from "@/lib/db";
import { FormValuesTask } from "@/schema/task";
import { Task } from "@/types/database";
import { v4 as uuidv4 } from "uuid";

export const addTask = async (taskData: FormValuesTask) => {
  const { id } = await getCurrentUser();
  const task = {
    ...taskData,
    id: uuidv4(),
    user_id: id,
    task_list_id:
      taskData.task_list_id === "inbox" ? null : taskData.task_list_id,
    completed: false,
    syncStatus: "pending" as SyncStatus,
    created_at: new Date().toISOString(),
  } as unknown as Task;

  await db.tasks.add(task);
  return task;
};

export const getAllTasks = async (param: string) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!param) return [];

  const defaultQuery = db.tasks.filter((task) => !task.deleted_at && !task.completed);

  switch (param) {
    case "inbox":
      return await defaultQuery
        .and((item) => item.task_list_id === null)
        .toArray();
    case "today":
      return await defaultQuery
        .and((item) => {
          const dueDate = item.due_date ? new Date(item.due_date) : null;
          return Boolean(
            dueDate &&
              dueDate >= today &&
              dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
          );
        })
        .toArray();
    case "upcoming":
      return await defaultQuery
        .and((item) => {
          const dueDate = item.due_date ? new Date(item.due_date) : null;
          return Boolean(
            dueDate &&
              dueDate >= new Date(today.getTime() + 24 * 60 * 60 * 1000)
          );
        })
        .toArray();

    default:
      return await db.tasks
        .where("task_list_id")
        .equals(param)
        .and((task) => !task.deleted_at)
        .toArray();
  }
};

export const toggleTask = async (id: string, completed: boolean) => {
  await db.tasks.update(id, {
    completed,
    sync_status: "pending" as SyncStatus,
  });
  return await db.tasks.get(id);
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  await db.tasks.update(id, {
    ...task,
    sync_status: "pending" as SyncStatus,
  });
  return await db.tasks.get(id);
};

export const deleteTask = async (id: string) => {
  const now = new Date().toISOString();
  await db.tasks.update(id, {
    deleted_at: now,
    sync_status: "pending" as SyncStatus,
  });
};

