"use client";

import { toggleTaskAction, deletetaskAction } from "@/app/actions/task";
import { Edit2, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { useUser } from "@/hooks/use-user";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { Task } from "@/types/database";

export function ContainerTaskList({ view }: { view?: string }) {
  const { user: userData } = useUser();
  const supabase = createClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", view],
    queryFn: async () => {
      let query = supabase.from("tasks").select("*");
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (view === "today") {
        query = query.gte("start_date", today.toISOString())
          .lt("start_date", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString());
      } else if (view === "upcoming") {
        query = query
          .gt("start_date", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
          .lte("end_date", new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString()); // Get tasks within next 30 days
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Task[];
    },
  });

  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTaskAction(id, completed);
  };

  const handleDelete = async (id: string) => {
    await deletetaskAction(id);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  console.log({ view });

  return (
    <main className="flex-1 py-2 items-center">
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto pt-2 px-2">
        <div suppressHydrationWarning={true}>
          <h1 className="text-2xl font-bold">
            {getGreeting()}, {userData?.user_metadata?.name || userData?.email}!
            👋
          </h1>
          {view?.includes("today") && (
            <p className="text-gray-500">
              Today, {format(new Date(), "EEE d MMMM yyyy")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* <Button variant={"outline"}>Today</Button> */}
        </div>
      </header>
      <ul className="space-y-2 max-w-4xl mx-auto px-2">
        {tasks?.map((task) => (
          <li
            key={task.id}
            className="flex items-center justify-between p-2 bg-white rounded-md shadow"
          >
            <div className="flex items-center gap-3 ml-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggle(task.id, task.completed)}
              />
              <span
                className={cn(
                  "text-sm",
                  task.completed && "line-through text-gray-500"
                )}
              >
                {task.name}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant={"ghost"}>
                  <MoreVertical />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-24">
                <DropdownMenuItem className="justify-between">
                  Edit
                  <Edit2 className="h-4 w-4" />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-500 justify-between"
                  onClick={() => handleDelete(task.id)}
                >
                  <div>Remove</div>
                  <Trash2 className="h-4 w-4" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        ))}
        {isLoading && (
          <li className="p-2">
            <Loader2 className="h-8 w-8 animate-spin" />
          </li>
        )}
      </ul>
      <ButtonAddTask />
    </main>
  );
}

