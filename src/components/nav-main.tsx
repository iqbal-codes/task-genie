"use client";

import { Calendar, CalendarDays, List } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const NavMain = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu className="">
      <SidebarMenuItem>
        <Link href="/all" className="w-full">
          <SidebarMenuButton
            tooltip="Inbox"
            className="flex space-x-1"
            isActive={pathname === "/all"}
          >
            <List />
            <span className="flex-1">All Tasks</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/today" className="w-full">
          <SidebarMenuButton
            tooltip="Today"
            className="flex space-x-1"
            isActive={pathname === "/today"}
          >
            <Calendar />
            <span className="flex-1">Today</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <Link href="/upcoming" className="w-full">
          <SidebarMenuButton
            tooltip="Upcoming"
            className="flex space-x-1"
            isActive={pathname === "/upcoming"}
          >
            <CalendarDays />
            <span className="flex-1">Upcoming</span>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavMain;

