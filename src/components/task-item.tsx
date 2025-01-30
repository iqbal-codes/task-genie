import { cn } from "@/lib/utils";
import { Checkbox } from "./ui/checkbox";
import { deletetaskAction, toggleTaskAction } from "@/app/actions/task";
import { Task } from "@/types/database";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Edit2, MoreVertical, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/query-client";

export type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const handleToggle = async (id: string, completed: boolean) => {
    await toggleTaskAction(id, completed);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  const handleDelete = async (id: string) => {
    await deletetaskAction(id);
  };

  return (
    <li className="flex items-center justify-between p-2 bg-white rounded-md shadow">
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
  );
};

