"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  // SidebarHeader,
  SidebarRail,
  // useSidebar,
} from "@/components/ui/sidebar";
import NavTaskList from "./nav-task-list";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <SidebarHeader>
        <h1 className={`text-2xl font-bold p-2 ${!open ? "hidden" : ""}`}>
          Private
        </h1>
      </SidebarHeader> */}
      <SidebarContent>
        <NavTaskList />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

