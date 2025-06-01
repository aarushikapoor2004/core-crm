import { ThemeToggleButton } from "../theme-toggle-button"
import { BreadcrumbHeader } from "./bread-crum-header"
import { SearchCommand } from "./search-command"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function NavBar() {
  return (
    <header className="sticky top-0 z-50  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border px-2 h-13 w-full flex gap-2 items-center justify-between pr-4 rounded-full">
      <div className="flex items-center">
        <SidebarTrigger className="" />
        <Separator className="h-7 mx-2" orientation="vertical" />
        <span className="lg:block hidden">
          <BreadcrumbHeader />
        </span>
      </div>

      <div className=" flex items-center gap-2 ">
        <SearchCommand />
        <ThemeToggleButton />
      </div>
    </header >
  );
}
