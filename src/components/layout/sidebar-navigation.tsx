"use client";

import { usePathname } from "next/navigation";
import { type SectionType } from "@/constants";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function SideBarNavigation({ data }: { data: SectionType[] }) {
  const pathname = usePathname();

  return (
    <>
      {data.map((section) => (
        <SidebarGroup key={section.sectionName}>
          {/* SECTION */}
          <SidebarGroupLabel>{section.sectionName}</SidebarGroupLabel>
          {/* NAV ITEMS */}
          <SidebarMenu key={section.sectionName}>
            {section.items.map((item) =>
              item.isCollapsible ? (
                <Collapsible
                  key={item.itemName}
                  defaultOpen={true}
                  asChild
                  className="group/collapsible"
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.itemName}>
                        {item.icon && <item.icon />}
                        <span> {item.itemName}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.subItems?.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.subItemName}>
                            <SidebarMenuSubButton asChild>
                              <Link href={subItem.url} className={cn(pathname === subItem.url ? "ring" : "")} >
                                <span> {subItem.subItemName}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.itemName}>
                  <SidebarMenuButton tooltip={item.itemName} asChild>
                    <Link href={item.url ? item.url : "#"} className={cn("flex items-center", pathname === item.url ? "ring" : "")} >
                      {item.icon && <item.icon />}
                      <span>{item.itemName}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
