
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NavBar } from "@/components/layout/navbar";
import { AppSidebar } from "@/components/layout/app-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <div className="ml-3.5">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

