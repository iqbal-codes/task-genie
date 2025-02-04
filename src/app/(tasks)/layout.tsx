"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { queryClient } from "@/lib/query-client";
import { syncManager } from "@/lib/sync-manager";
import { QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    syncManager.init();
  }, []);

  return (
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <AppSidebar />
        <SidebarInset className="bg-accent">{children}</SidebarInset>
      </QueryClientProvider>
    </SidebarProvider>
  );
}
