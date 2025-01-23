import { create } from 'zustand';

type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

type TodoStore = {
  todos: Todo[];
  addTodo: (title: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
};

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  addTodo: (title) =>
    set((state) => ({
      todos: [
        ...state.todos,
        {
          id: Math.random().toString(36).substring(7),
          title,
          completed: false,
          createdAt: new Date(),
        },
      ],
    })),
  toggleTodo: (id) =>
    set((state) => ({
      todos: state.todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
}));