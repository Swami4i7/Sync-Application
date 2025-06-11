"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SideBarItems, SidebarSection } from "@/lib/sidebar-data";
import { Card } from "./ui/card";
import Link from "next/link"; // Import the Link component for routing
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation

interface SidebarProps {
  sections?: SidebarSection[];
}

export default function Sidebar({
  sections = SideBarItems,
}: Readonly<SidebarProps>) {
  const pathname = usePathname(); // Get the current pathname
  const [openSections, setOpenSections] = React.useState<{
    [key: string]: boolean;
  }>(() => {
    // Set default state to open all sections
    const initialState: { [key: string]: boolean } = {};
    sections.forEach((section) => {
      initialState[section.title] = true; // Set each section to be open
    });
    return initialState;
  });

  // Helper function to check if the route is active
  const isActive = React.useCallback(
    (href: string) => {
      if (href === "/") {
        return pathname === "/";
      }

      if (pathname === href) return true;

      // Handle nested routes, e.g., /function/123 matching /function
      if (pathname.startsWith(href) && href !== "/") {
        return true;
      }

      return false;
    },
    [pathname]
  );

  // Toggle the open state of a specific section
  const toggleSection = (sectionTitle: string) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionTitle]: !prevState[sectionTitle], // Toggle the open state
    }));
  };

  // Determine the active item title based on the current route
  const activeItemTitle = React.useMemo(() => {
    for (const section of sections) {
      for (const item of section.items) {
        if (isActive(item.href)) {
          return item.title;
        }
      }
    }
    return ""; // Return empty string if no item matches
  }, [sections, isActive]);

  return (
    <div className="hidden flex-1 md:block">
      <Card className="flex mr-2 min-h-[200px] dark:bg-transparent rounded-md py-0">
        <div className="w-full">
          <div className=" p-4 mr-2 ">
            {sections.map((section) => (
              <div key={section.title}>
                <Collapsible defaultOpen={openSections[section.title] || false}>
                  <CollapsibleTrigger
                    className="flex w-full items-center justify-between py-4"
                    onClick={() => toggleSection(section.title)}
                  >
                    <div className="flex items-center space-x-3">
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition  ease-in-out",
                          openSections[section.title] ? "rotate-180" : ""
                        )}
                      />
                      {section.icon && (
                        <section.icon
                          className={cn(
                            "h-4 w-4",
                            // Optionally, change icon color based on active item
                            activeItemTitle === section.items[0].title
                              ? "text-[#7E51FE]"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                      )}
                      <span className="text-sm font-bold ">
                        {section.title}
                      </span>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="relative ml-2 pl-4 ">
                      <div className="absolute left-0 top-0 h-full border-l-2 border-dashed border-gray-200 dark:border-gray-600" />
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href}
                          className={cn(
                            "relative flex items-center py-2 mb-1 pl-4 text-sm rounded-sm",
                            isActive(item.href)
                              ? "text-[#7E51FE] bg-[#FFF5F5]"
                              : "text-black dark:text-gray-200",
                            "before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:border-gray-200 dark:before:border-gray-500",
                            "hover:bg-gray-50 dark:hover:bg-gray-600"
                          )}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
