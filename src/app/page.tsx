import { AppSidebar } from "@/components/app-sidebar";
import { TodoList } from "@/components/todo-list";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
          <TodoList />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

