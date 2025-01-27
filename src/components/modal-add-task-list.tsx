"use client";

import { addTaskListAction } from "@/app/actions/task-list";
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
import { z } from "zod";
import { IconPicker } from "./ui/icon-picker";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useActionStateWithUser } from "@/hooks/use-action-state-with-user";

interface ModalAddTaskListProps {
  setOpen: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  icon: z.string().min(1, "Icon is required"),
});

type FormValues = z.infer<typeof formSchema>;

const FORM_DEFAULT_VALUE = {
  name: "",
  description: "",
};

export const ModalAddTaskList = ({ setOpen }: ModalAddTaskListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [state, formAction, pending] = useActionStateWithUser(
    addTaskListAction,
    null
  );
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      queryClient.invalidateQueries({ queryKey: ["taskLists"] });
      form.reset(FORM_DEFAULT_VALUE);
      setOpen(false);
    }
  }, [state, toast, queryClient, setOpen, form]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create New List</DialogTitle>
        <DialogDescription>
          Create a new list to organize your tasks.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form ref={formRef} action={formAction} className="space-y-4">
          <div className="space-y-2">
            <FormLabel>List Name</FormLabel>
            <div className="flex gap-2">
              <FormField
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
              <input type="hidden" name="icon" value={form.getValues("icon")} />
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
            <Button type="submit" loading={pending}>
              Create List
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

