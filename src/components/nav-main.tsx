"use client";

import { Calendar, CalendarDays, Inbox } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLiveQuery } from "dexie-react-hooks";
import { getAllTasks } from "@/services/task.service";

const NAVIGATION_LIST = [
  {
    label: "Inbox",
    href: "/inbox",
    icon: Inbox,
  },
  {
    label: "Today",
    href: "/today",
    icon: Calendar,
  },
  {
    label: "Upcoming",
    href: "/upcoming",
    icon: CalendarDays,
  },
];

const NavMain = () => {
  const pathname = usePathname();

  // Get task counts for each view
  const inboxTasks = useLiveQuery(() => getAllTasks("inbox"));
  const todayTasks = useLiveQuery(() => getAllTasks("today"));
  const upcomingTasks = useLiveQuery(() => getAllTasks("upcoming"));

  const getTaskCount = (view: string) => {
    switch (view) {
      case "/inbox":
        return inboxTasks?.length || null;
      case "/today":
        return todayTasks?.length || null;
      case "/upcoming":
        return upcomingTasks?.length || null;
      default:
        return null;
    }
  };

  return (
    <SidebarMenu className="">
      {NAVIGATION_LIST.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} className="w-full">
            <SidebarMenuButton
              tooltip={item.label}
              className="flex items-center gap-2"
              isActive={pathname === item.href}
            >
              <item.icon
                className={cn({
                  "text-indigo-500": pathname === item.href,
                })}
              />
              <span
                className={cn("flex-1", {
                  "text-indigo-500": pathname === item.href,
                })}
              >
                {item.label}
              </span>
            </SidebarMenuButton>
            <SidebarMenuBadge>{getTaskCount(item.href)}</SidebarMenuBadge>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavMain;

