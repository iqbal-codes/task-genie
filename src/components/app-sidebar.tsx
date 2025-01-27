"use client";

import * as React from "react";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  // SidebarHeader,
  SidebarRail,
  // useSidebar,
} from "@/components/ui/sidebar";
import NavTaskList from "./nav-task-list";
import NavMain from "./nav-main";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <NavMain />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold">
            Task Lists
          </SidebarGroupLabel>
          <NavTaskList />
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

