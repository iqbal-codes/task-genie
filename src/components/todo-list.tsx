"use client";

import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/lib/store";
import { format } from "date-fns";
import ButtonAddTask from "./button-add-task";
import { Checkbox } from "./ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";
import { useUser } from "@/hooks/use-user";

export function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodoStore();
  const { user: userData } = useUser();

  return (
    <main className="flex-1 py-2">
      <SidebarTrigger size={"icon"} />
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto pt-2 px-2">
        <div>
          <h1 className="text-2xl font-bold">
            Good Morning, {userData?.user_metadata?.name || userData?.email}! 👋
          </h1>
          <p className="text-gray-500">
            Today, {format(new Date(), "EEE d MMMM yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ButtonAddTask />
          {/* <Button variant={"outline"}>Today</Button> */}
        </div>
      </header>
      <ul className="space-y-2 max-w-4xl mx-auto px-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-2 bg-white rounded-md shadow"
          >
            <div className="flex items-center gap-3 ml-2">
              <Checkbox onClick={() => toggleTodo(todo.id)} />
              <span
                className={cn(
                  "text-sm",
                  todo.completed && "line-through text-gray-500"
                )}
              >
                {todo.title}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button size="icon" variant={"ghost"}>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24 cursor-pointer">
                <DropdownMenuItem
                  className="text-red-500 justify-between cursor-pointer"
                  onClick={() => {
                    deleteTodo(todo.id);
                  }}
                >
                  <div>Remove</div>
                  <Trash2 />
                </DropdownMenuItem>
                <DropdownMenuItem className="justify-between cursor-pointer">
                  Edit
                  <Edit2 />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
      </ul>
    </main>
  );
}

