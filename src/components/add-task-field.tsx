import { InboxIcon, RepeatIcon } from "lucide-react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllTaskLists } from "@/services/task-list.service";
import { useActionStateWithUser } from "@/hooks/use-action-state-with-user";
import { addTaskAction } from "@/app/actions/task";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { FormValuesTask, taskSchema } from "@/schema/task";
import { zodResolver } from "@hookform/resolvers/zod";
import { queryClient } from "@/lib/query-client";
import { useEffect } from "react";
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

const FORM_DEFAULT_VALUE: FormValuesTask = {
  name: "",
  notes: "",
  task_list_id: "inbox",
  due_date: null,
  reminder: null,
};

export const AddTaskField = () => {
  const { data: taskLists } = useQuery({
    queryKey: ["tasklists"],
    queryFn: () => getAllTaskLists(),
  });

  const [state, formAction] = useActionStateWithUser(addTaskAction, null);

  const { toast } = useToast();
  const form = useForm<FormValuesTask>({
    resolver: zodResolver(taskSchema),
    defaultValues: FORM_DEFAULT_VALUE,
  });

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    } else if (state?.success) {
      toast({
        title: "Success",
        description: "Task list added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      form.reset(FORM_DEFAULT_VALUE);
    }
  }, [state, toast, form]);

  return (
    <Form {...form}>
      <form action={formAction}>
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
            <Button size="sm" type="submit" disabled={!form.watch("name")}>
              Add Task
            </Button>
          </div>
        </li>
      </form>
    </Form>
  );
};

