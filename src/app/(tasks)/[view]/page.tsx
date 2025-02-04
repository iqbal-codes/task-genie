import { ContainerTaskList } from "@/components/container-tasklist";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{
    view: string;
  }>;
}

export default async function TaskViewPage({ params }: PageProps) {
  const { view } = await params;

  return (
    <Suspense>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <ContainerTaskList view={view} />
      </div>
    </Suspense>
  );
}

