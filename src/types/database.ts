export interface TaskList {
  id: string;
  name: string;
  icon: string | null;
  description: string | null;
  created_by: string;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export interface Task {
  id: string;
  title: string;
  notes: string | null;
  start_date: string | null;
  end_date: string | null;
  task_list_id: string;
  user_id: string;
  completed: boolean;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
}

export type Database = {
  public: {
    Tables: {
      tasks: {
        Row: Task;
        Insert: Omit<Task, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>;
      };
      task_lists: {
        Row: TaskList;
        Insert: Omit<TaskList, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TaskList, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};