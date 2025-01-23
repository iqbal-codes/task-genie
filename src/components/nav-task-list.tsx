import { LucideIcon, NotebookIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Badge } from "./ui/badge";

type TaskListType = {
  id: string;
  icon?: LucideIcon;
  title: string;
  taskCount: number;
  isActive?: boolean;
}[];

const taskList: TaskListType = [
  {
    id: "task-list-1",
    icon: NotebookIcon,
    title: "Grocery Shopping List",
    taskCount: 5,
    isActive: true,
  },
];

const NavTaskList = () => {
  return (
    <SidebarMenu>
      {taskList.map((item) => (
        <SidebarMenuItem key={item.title} className="p-2">
          <SidebarMenuButton tooltip={item.title} className="flex">
            {item.icon && <item.icon />}
            <span className="flex-1">{item.title}</span>
            <Badge variant={"secondary"}>{item.taskCount}</Badge>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};

export default NavTaskList;

