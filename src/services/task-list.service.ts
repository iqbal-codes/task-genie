import { db, getCurrentUser, SyncStatus } from "@/lib/db";
import { TaskList } from "@/types/database";
import { v4 as uuidv4 } from "uuid";

export const getAllTaskLists = async () => {
  // Get non-deleted task lists
  const taskLists = await db.taskLists
    .filter((item) => !item.deleted_at)
    .toArray();

  // Calculate task count for each list
  const tasksCountPromises = taskLists.map(async (list) => {
    const count = await db.tasks
      .where("task_list_id")
      .equals(list.id)
      .and((task) => !task.deleted_at && !task.completed)
      .count();

    return {
      ...list,
      task_count: count,
    };
  });

  return Promise.all(tasksCountPromises);
};

export const addTaskList = async (data: Partial<TaskList>) => {
  const { id: userId } = await getCurrentUser();

  const taskList = {
    ...data,
    id: uuidv4(),
    user_id: userId,
    sync_status: "pending" as SyncStatus,
    created_at: new Date().toISOString(),
  } as TaskList;

  await db.taskLists.add(taskList);
  return taskList;
};

export const updateTaskList = async (id: string, data: Partial<TaskList>) => {
  await db.taskLists.update(id, {
    ...data,
    updated_at: new Date().toISOString(),
    sync_status: "pending" as SyncStatus,
  });
  return await db.taskLists.get(id);
};

export const deleteTaskList = async (id: string) => {
  await db.taskLists.update(id, {
    deleted_at: new Date().toISOString(),
    sync_status: "pending" as SyncStatus,
  });
};

