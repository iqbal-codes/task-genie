"use client";

import { addtaskAction } from "@/app/actions/task";
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
import { FormValuesTask, taskSchema } from "@/schema/task";

import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { createClient } from "@/utils/supabase/client";

interface ModalAddTaskProps {
  setOpen: (open: boolean) => void;
}

export const ModalAddTask = ({ setOpen }: ModalAddTaskProps) => {
  const supabase = createClient();
  const { data: taskLists } = useQuery({
    queryKey: ["taskLists"],
    queryFn: async () => {
      const { data } = await supabase
        .from("task_lists")
        .select("*")
        .is("deleted_at", null);
      return data;
    },
  });

  const { toast } = useToast();
  const form = useForm<FormValuesTask>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      name: "",
      notes: "",
    },
  });

  async function onSubmit(values: FormValuesTask) {
    const result = await addtaskAction(values);

    if (result.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error,
      });
      return;
    }

    toast({
      title: "Success",
      description: "Task added successfully",
    });
    setOpen(false);
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogDescription>
          Create a new task to manage your work effectively.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your task..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any additional notes..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  const value = field.value as DateRange;
                  return (
                    <FormItem className="flex-1">
                      <FormLabel>Date</FormLabel>
                      <div className={"grid gap-2"}>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="date"
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon />
                              {value?.from ? (
                                value.to ? (
                                  <>
                                    {format(value.from, "LLL dd, y")} -{" "}
                                    {format(value.to, "LLL dd, y")}
                                  </>
                                ) : (
                                  format(value.from, "LLL dd, y")
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              initialFocus
                              mode="range"
                              defaultMonth={value?.from}
                              selected={value}
                              onSelect={field.onChange}
                              numberOfMonths={2}
                              disabled={{ before: new Date() }}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="task_list_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Task List</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a task list" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
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
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

