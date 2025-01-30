"use client";

import { Calendar, CalendarDays, Inbox } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

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

  return (
    <SidebarMenu className="">
      {NAVIGATION_LIST.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} className="w-full">
            <SidebarMenuButton
              tooltip="Inbox"
              className="flex space-x-1"
              isActive={pathname === item.href}
            >
              <item.icon />
              <span className="flex-1">{item.label}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavMain;

