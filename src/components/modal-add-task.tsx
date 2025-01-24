"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useForm } from "react-hook-form";
import { useTodoStore } from "@/lib/store";
import { TodoFormData, todoSchema } from "@/schema/todo";

interface ModalAddTaskProps {
  setOpen: (open: boolean) => void;
}

export const ModalAddTask = ({ setOpen }: ModalAddTaskProps) => {
  const { addTodo } = useTodoStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoFormData>({
    resolver: zodResolver(todoSchema),
  });

  const onSubmit = (data: TodoFormData) => {
    addTodo(data.title);
    reset();
    setOpen(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogDescription>
          Create a new task to manage your work effectively.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            {...register("title")}
            placeholder="Enter your task..."
            className={cn(errors.title && "border-red-500")}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="submit">Add Task</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
