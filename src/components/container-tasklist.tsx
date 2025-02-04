"use client";

import { TaskItem } from "./task-item";
import { getAllTasks } from "@/services/task.service";
import { AddTaskField } from "./add-task-field";
import { useLiveQuery } from "dexie-react-hooks";
import { syncManager } from "@/lib/sync-manager";
import { useEffect, useMemo } from "react";
import { getAllTaskLists } from "@/services/task-list.service";
import Link from "next/link";

export function ContainerTaskList({ view }: { view: string }) {
  const taskLists = useLiveQuery(() => getAllTaskLists());

  useEffect(() => {
    syncManager.init(); // Initialize sync manager
  }, []);

  const [title = "", isValidNavigation, taskListId] = useMemo(() => {
    if (["inbox", "today", "upcoming"].indexOf(view) !== -1)
      return [view, true, null];

    if (!taskLists || taskLists?.length === 0) return ["", null, null];

    const taskListItem = taskLists?.find((item) => {
      const viewId = view.split("-").pop();
      if (!viewId) return false;
      return item.id.includes(viewId);
    });

    return [taskListItem?.name, !!taskListItem, taskListItem?.id];
  }, [taskLists, view]);

  const tasks = useLiveQuery(() => getAllTasks(taskListId || view));

  if (isValidNavigation === false)
    return (
      <div className="flex h-full flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 text-lg text-muted-foreground">
            Oops, it looks like the page you&apos;re looking for doesn&apos;t
            exist.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              prefetch={false}
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
    );

  if (!isValidNavigation) return null;

  return (
    <main className="flex-1 pb-2 items-center px-8">
      <header className="flex items-center justify-between mb-8 max-w-4xl mx-auto pt-2 px-2">
        <h1 className="font-bold text-2xl">
          {title?.charAt(0).toUpperCase() + title?.slice(1)}
        </h1>
      </header>
      <ul className="space-y-2 max-w-4xl mx-auto px-2">
        {tasks?.map((task) => (
          <TaskItem task={task} key={task.id} />
        ))}
        <AddTaskField />
      </ul>
    </main>
  );
}

