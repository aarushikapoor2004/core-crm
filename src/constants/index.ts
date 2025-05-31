import {
  type LucideIcon,
  LayoutDashboard,
} from "lucide-react";

export interface SectionType {
  sectionName: string;
  items: ItemType[];
}

export interface ItemType {
  itemName: string;
  url?: string;
  icon: LucideIcon;
  isCollapsible: boolean;
  subItems?: SubItemType[];
}

export interface SubItemType {
  subItemName: string;
  url: string;
}

export const PROTECTED_ROUTES: string[] = ["/home"];

export const sidebarNavigationSection: SectionType[] = [
  {
    sectionName: "main",
    items: [
      {
        itemName: "dashboard",
        isCollapsible: false,
        icon: LayoutDashboard,
        url: "/",
      },
    ],
  },
];
