import { InboxIcon, PlusCircleIcon, RepeatIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { getAllTaskLists } from "@/services/task-list.service";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { FormValuesTask, taskSchema } from "@/schema/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/query-client";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ReminderField } from "./reminder-field";
import { FormFieldComplex } from "./ui/form-field-complex";
import { DueDateField } from "./due-date-field";
import { addTask } from "@/services/task.service";
import { useMutation } from "@tanstack/react-query";
import { useLiveQuery } from "dexie-react-hooks";

const FORM_DEFAULT_VALUE: FormValuesTask = {
  name: "",
  notes: "",
  task_list_id: "inbox",
  due_date: null,
  reminder: null,
};

export const AddTaskField = () => {
  const [inputFieldVisible, setInputFieldVisible] = useState(false);

  const taskLists = useLiveQuery(() => getAllTaskLists());

  const addTaskMutation = useMutation({
    mutationFn: addTask,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Task added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset(FORM_DEFAULT_VALUE);
      setInputFieldVisible(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  const onSubmit = (formValues: FormValuesTask) => {
    addTaskMutation.mutate(formValues);
  };

  const { toast } = useToast();
  const form = useForm<FormValuesTask>({
    resolver: zodResolver(taskSchema),
    defaultValues: FORM_DEFAULT_VALUE,
  });

  if (!inputFieldVisible)
    return (
      <Button
        onClick={() => setInputFieldVisible(true)}
        variant={"ghost"}
        className="hover:text-indigo-500"
      >
        <PlusCircleIcon />
        Add Task
      </Button>
    );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <li
          key={"add-task"}
          className="flex flex-col p-2 bg-white rounded-md shadow gap-2"
        >
          <div className="flex flex-row items-center gap-3 ml-2 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Add a task"
                  className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none"
                />
              )}
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <FormFieldComplex
              form={form}
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <DueDateField onChange={field.onChange} value={field.value} />
              )}
            />
            <FormFieldComplex
              form={form}
              control={form.control}
              name="reminder"
              render={({ field }) => (
                <ReminderField onChange={field.onChange} value={field.value} />
              )}
            />
            <Button size="icon" variant="ghost" tooltip="Repeat">
              <RepeatIcon />
            </Button>
          </div>
          <Separator />
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <FormField
                control={form.control}
                name="task_list_id"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      {...field}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-[160px]">
                          <SelectValue placeholder="Task List" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={"inbox"} className="cursor-pointer">
                          <div className="flex items-center gap-1">
                            <InboxIcon className="size-4" />
                            Inbox
                          </div>
                        </SelectItem>
                        <SelectGroup>
                          <SelectLabel>Task List</SelectLabel>
                          {!taskLists?.length && (
                            <SelectItem disabled value={"empty"}>
                              No task lists found
                            </SelectItem>
                          )}
                          {taskLists?.map((list) => (
                            <SelectItem
                              className="cursor-pointer"
                              key={list.id}
                              value={list.id}
                            >
                              {list.icon} {list.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                type="submit"
                onClick={() => setInputFieldVisible(false)}
              >
                Cancel
              </Button>
              <Button size="sm" type="submit" disabled={!form.watch("name")}>
                Add Task
              </Button>
            </div>
          </div>
        </li>
      </form>
    </Form>
  );
};

