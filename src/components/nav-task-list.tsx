"use client";

import { NotebookIcon, PlusIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import { TaskList } from "@/types/database";
import { useState } from "react";
import { ModalAddTaskList } from "./modal-add-task-list";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";

const NavTaskList = () => {
  const [openModal, setOpenModal] = useState(false);
  const supabase = createClient();

  const { data: taskLists, isLoading } = useQuery({
    queryKey: ["taskLists"],
    queryFn: async () => {
      const { data, error } = await supabase.from("task_lists").select(`
          *,
          task_count:tasks(count)
        `);

      if (error) throw error;
      return data?.map((item) => ({
        ...item,
        task_count: item.task_count?.[0]?.count ?? 0,
      })) as TaskList[];
    },
  });

  if (isLoading) {
    return (
      <SidebarMenu className="gap-2 p-2">
        <div className="animate-pulse space-y-2">
          <div className="h-10 bg-muted rounded-md" />
          <div className="h-10 bg-muted rounded-md" />
        </div>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      {taskLists?.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton tooltip={item.name} className="flex space-x-1">
            {item.icon ? (
              <div className="h-5 w-4 text-center">{item.icon}</div>
            ) : (
              <NotebookIcon />
            )}
            <span className="flex-1">{item.name}</span>
            {item.task_count > 0 && (
              <SidebarMenuBadge className="font-bold">
                {item.task_count}
              </SidebarMenuBadge>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <Separator />
      <SidebarMenuItem key={"btn-add-new-list"}>
        <Dialog open={openModal} onOpenChange={setOpenModal}>
          <DialogTrigger asChild>
            <SidebarMenuButton
              tooltip={"Add New List"}
              className="flex space-x-1"
            >
              <PlusIcon />
              <span className="flex-1">Add New List</span>
            </SidebarMenuButton>
          </DialogTrigger>
          <ModalAddTaskList setOpen={setOpenModal} />
        </Dialog>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavTaskList;

