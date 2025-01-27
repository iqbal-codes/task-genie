import { ContainerTaskList } from "@/components/container-task-list";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { notFound } from "next/navigation";
import { Suspense } from "react";

const validViews = ["today", "upcoming", "completed"];

interface PageProps {
  params: Promise<{
    view: string;
  }>;
}

export default async function TaskViewPage({ params }: PageProps) {
  const { view } = await params;

  if (!validViews.includes(view)) {
    notFound();
  }

  return (
    <Suspense>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
        <ContainerTaskList view={view} />
      </div>
    </Suspense>
  );
}