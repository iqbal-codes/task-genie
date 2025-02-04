"use client";

import { NotebookIcon, PlusIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { ModalAddTaskList } from "./modal-add-task-list";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getAllTaskLists } from "@/services/task-list.service";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";

const NavTaskList = () => {
  const pathname = usePathname();
  const [openModal, setOpenModal] = useState(false);

  const taskLists = useLiveQuery(() => getAllTaskLists());

  return (
    <SidebarMenu>
      {taskLists?.map((item) => {
        const href = `/${item.name.replace(/\s+/g, "-")}-${
          item.id.split("-")[0]
        }`.toLowerCase();
        return (
          <SidebarMenuItem key={item.id}>
            <Link href={`${href}`} className="w-full">
              <SidebarMenuButton
                tooltip={item.name}
                className="flex space-x-1"
                isActive={pathname === href}
              >
                {item.icon ? (
                  <div className="h-5 w-4 text-center">{item.icon}</div>
                ) : (
                  <NotebookIcon
                    className={cn({
                      "text-indigo-500": pathname === href,
                    })}
                  />
                )}
                <span
                  className={cn("flex-1", {
                    "text-indigo-500": pathname === href,
                  })}
                >
                  {item.name}
                </span>
              </SidebarMenuButton>
              {item.task_count > 0 && (
                <SidebarMenuBadge>{item.task_count}</SidebarMenuBadge>
              )}
            </Link>
          </SidebarMenuItem>
        );
      })}
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

