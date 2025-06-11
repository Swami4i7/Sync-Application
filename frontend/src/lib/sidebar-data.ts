import { LayoutPanelLeft } from "lucide-react";
export interface SidebarItem {
  title: string;
  href: string;
  active?: boolean; // Optional: Indicates if the item is initially active
}

export interface SidebarSection {
  title: string;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
  items: SidebarItem[];
}

export const SideBarItems: SidebarSection[] = [
  {
    title: "Sync Application",
    icon: LayoutPanelLeft,
    items: [
      {
        title: "Setup details",
        href: "/setup-details",
        active: true, 
      },
      {
        title: "Schedule Details",
        href: "/schedule-details",
      },
      {
        title: "Schedule logs",
        href: "/schedule-logs",
      },
      {
        title: "Users",
        href: "/users",
      },
    ],
  },
];
