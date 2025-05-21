import DashboardNav from "@/components/dashboard/dashboard-nav";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex-1 flex">
        <aside className="hidden w-64 border-r bg-card lg:block">
          <ScrollArea className="h-[calc(100vh-3.5rem)]">
            <div className="py-6 px-3">
              <DashboardNav />
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1">
          <div className="h-[calc(100vh-3.5rem)] overflow-y-auto p-4 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

