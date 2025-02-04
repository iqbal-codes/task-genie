export interface TaskList {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  tasks?: Task[];
  user_id: string;
  task_count?: number;
}

export interface Task {
  id: string;
  name: string;
  notes: string | null;
  due_date: string | null;
  task_list_id: string;
  user_id: string;
  completed: boolean;
  reminder: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: Omit<Task, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Task, "id" | "created_at" | "updated_at">>;
      };
      task_lists: {
        Row: TaskList;
        Insert: Omit<TaskList, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TaskList, "id" | "created_at" | "updated_at">>;
      };
    };
  };
};
