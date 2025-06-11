"use client";

import * as React from "react";
import { ChevronDown, Menu } from "lucide-react"; // Ensure Menu icon is imported
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { SideBarItems, SidebarSection } from "@/lib/sidebar-data";
import Link from "next/link"; // Import the Link component for routing
import { usePathname } from "next/navigation"; // Import usePathname from next/navigation
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"; // Import Sheet components
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; // Import VisuallyHidden
import { useState } from "react";

interface SheetSidebarProps {
  sections?: SidebarSection[];
}

export default function SheetSidebar({
  sections = SideBarItems,
}: Readonly<SheetSidebarProps>) {
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

  const [open, setOpen] = useState(false);
  const closeSheet = () => setOpen(false);

  return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="md:hidden" asChild>
          <button
            className="flex items-center  justify-center p-4 rounded-md focus:outline-none  focus:ring-inset focus:ring-blue-500"
            aria-label="Open Menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-4">
          {/* Accessible Sheet Title */}
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Sidebar Menu</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>

          <div className="space-y-4">
            {sections.map((section) => (
              <div key={section.title}>
                <Collapsible defaultOpen={openSections[section.title] || false}>
                  <CollapsibleTrigger
                    className="flex w-full items-center justify-between py-4 mt-2"
                    onClick={() => toggleSection(section.title)} // Toggle the section on click
                  >
                    <div className="flex items-center space-x-2">
                      {section.icon && (
                        <section.icon
                          className={cn(
                            "h-4 w-4",
                            isActive(section.items[0].href)
                              ? "text-[#7E51FE]"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        />
                      )}
                      <span className="text-sm font-bold">{section.title}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        openSections[section.title] ? "rotate-180" : ""
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-4 space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href ?? "#"}
                          className={cn(
                            "block px-2 py-1 text-sm rounded-md",
                            isActive(item.href)
                              ? "text-[#7E51FE] bg-gray-100 dark:bg-gray-700"
                              : "text-gray-700 dark:text-gray-300",
                            "hover:bg-gray-200 dark:hover:bg-gray-600"
                          )}
                          onClick={closeSheet}
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
        </SheetContent>
      </Sheet>
  );
}
