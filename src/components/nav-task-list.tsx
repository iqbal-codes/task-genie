import { LucideIcon, NotebookIcon, PlusIcon } from "lucide-react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

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
    <SidebarMenu className="gap-2 p-2">
      {taskList.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton tooltip={item.title} className="flex">
            {item.icon && <item.icon />}
            <span className="flex-1">{item.title}</span>
            <Badge variant={"secondary"}>{item.taskCount}</Badge>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
      <Separator />
      <SidebarMenuItem key={"btn-add-new-list"}>
        <SidebarMenuButton tooltip={"Add New List"} className="flex">
          {<PlusIcon />}
          <span className="flex-1">Add New List</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default NavTaskList;

