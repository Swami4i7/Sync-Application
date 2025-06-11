"use client";

import React, { useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import NavBarToggle from "@/components/NavbarToggle";
import { ChevronLeft } from "lucide-react";
import { SideBarItems } from "@/lib/sidebar-data";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
// import { DownloadReportButton } from "@/components/download-report";

export default function ProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isExpanded, setIsExpanded] = useState(true); // Sidebar toggle state
  const [showSidebarContent, setShowSidebarContent] = useState(true); // Sidebar content visibility state
  const pathname = usePathname(); // Current pathname

  // const hideReportRegex = /^(\/user\/\d+|\/role\/\d+)$/;
  // const hideReportButton = hideReportRegex.test(pathname);

  // Compute active sidebar item title based on current path
  const activeItemTitle = useMemo(() => {
    for (const section of SideBarItems) {
      for (const item of section.items) {
        if (
          item.href === pathname ||
          (item.href !== "/" && pathname.startsWith(item.href))
        ) {
          return item.title;
        }
      }
    }
    return "Setup Details"; // Default title
  }, [pathname]);

  // Sidebar toggle handler
  const handleSidebarToggle = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);

    if (newExpandedState) {
      setTimeout(() => {
        setShowSidebarContent(true); // Show content after expanding 
      }, 350);
    } else {
      setShowSidebarContent(false); // Hide content immediately when collapsing
    }
  };

  // const isNumericId = /^\d+$/.test(pathname.split("/").pop() ?? "");
  const isErrorLogsPage = pathname.includes("error-logs");
  const isNumericId = isErrorLogsPage;
  
  return (
    <div className="flex flex-col h-screen dark:bg-[#0C0C0C] dark:text-white bg-[#FEFCF3] text-black ">
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 p-4 dark:bg-[#0C0C0C] bg-[#FEFCF3] text-black  ">
        {/* Sidebar */}
        <div
          className={`hidden md:block transition-all duration-500  ease-in-out transform overflow-hidden ${
            isExpanded
              ? "w-64 opacity-100 translate-x-0  "
              : "w-0 opacity-0 translate-x-[-100%]"
          }`}
        >
          {/* Sidebar content rendered only when fully expanded */}
          {showSidebarContent && <Sidebar  />}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto max-w-full overflow-x-hidden">
          <div className="w-full flex justify-between items-center pt-4">
            <h1 className="font-bold text-black dark:text-gray-200 pl-2 flex items-center">
              {/* Display "Back" button if last segment is numeric */}
              {isNumericId ? (
                <Button
                  className="px-0 flex items-center gap-0"
                  onClick={() => window.history.back()}
                  variant={"link"}
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </Button>
              ) : (
                // activeItemTitle.replace(/\s+/g, "") ?? activeItemTitle
                activeItemTitle
              )}
            </h1>
            <div className="flex items-center gap-2">
              {/* {!hideReportButton && <DownloadReportButton />} */}

              {/* Sidebar Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:flex text-black dark:text-gray-200"
                onClick={handleSidebarToggle}
              >
                <div className="hidden md:block">
                  <NavBarToggle open={isExpanded} />
                </div>
              </Button>
            </div>
          </div>
          {/* Page Content */}
          <main className="flex-1 p-2 md:p-2 overflow-auto max-w-full overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
