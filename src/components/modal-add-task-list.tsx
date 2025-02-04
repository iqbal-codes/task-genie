"use client";

import { useToast } from "@/hooks/use-toast";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "./ui/textarea";
import { IconPicker } from "./ui/icon-picker";
import { FormValuesTaskList, taskListSchema } from "@/schema/task-list";
import { FormFieldComplex } from "./ui/form-field-complex";
import { addTaskList } from "@/services/task-list.service";

interface ModalAddTaskListProps {
  setOpen: (open: boolean) => void;
}

const FORM_DEFAULT_VALUE = {
  name: "",
  description: "",
};

export const ModalAddTaskList = ({ setOpen }: ModalAddTaskListProps) => {
  const { toast } = useToast();
  const form = useForm<FormValuesTaskList>({
    resolver: zodResolver(taskListSchema),
    defaultValues: FORM_DEFAULT_VALUE,
  });

  const onSubmit = async (data: FormValuesTaskList) => {
    try {
      await addTaskList(data);
      toast({
        title: "Success",
        description: "Task list added successfully",
      });
      form.reset(FORM_DEFAULT_VALUE);
      setOpen(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to add task list",
      });
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New List</DialogTitle>
        <DialogDescription>
          Create a new list to organize your tasks.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>List Name</FormLabel>
            <div className="flex gap-2">
              <FormFieldComplex
                form={form}
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem className="w-9">
                    <FormControl>
                      <IconPicker
                        onChange={field.onChange}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input placeholder="Enter list name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add list description..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button type="submit">Create List</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

