
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { NavBar } from "@/components/navbar";
import { AppSidebar } from "@/components/app-sidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <NavBar />
        <div className="ml-3">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

