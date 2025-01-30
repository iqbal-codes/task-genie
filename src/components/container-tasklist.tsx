"use client";

import {
  Loader2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { TaskItem } from "./task-item";
import { getAllTasks } from "@/services/task.service";
import { AddTaskField } from "./add-task-field";

export function ContainerTaskList({ view }: { view: string }) {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", view],
    queryFn: () => getAllTasks(view),
  });

  return (
    <main className="flex-1 pb-2 items-center px-8">
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto pt-2 px-2">
        <h1 className="font-bold text-2xl">
          {view?.charAt(0).toUpperCase() + view?.slice(1)}
        </h1>
      </header>
      <ul className="space-y-2 max-w-4xl mx-auto px-2">
        {tasks?.map((task) => (
          <TaskItem task={task} key={task.id} />
        ))}
        <AddTaskField />
      </ul>
      {isLoading && (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
    </main>
  );
}

