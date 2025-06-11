import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import Image from "next/image";
import logo from "../../public/4i Logo_white.svg";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import SheetSidebar from "./SheetSidebar";
import { ModeToggle } from "./ModeToggle";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const pathname = usePathname();
  const isHiddenLogout = pathname === "/login" || pathname === "/";
  const { setTheme, theme, systemTheme } = useTheme();

  const isDarkMode =
    theme === "dark" || (theme === "system" && systemTheme === "dark");

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div>
      <nav className="flex items-center justify-between bg-[#0C0C0C] text-white relative min-h-[60px]">
        <div className="flex items-center gap-4 space-x-2">
          <SheetSidebar />
          {/* Desktop Logo and Application Name */}
          <div className="hidden md:flex items-center space-x-2 px-2">
            <Link href="/">
              <Image
                src={logo}
                alt="Application Object Library Logo"
                className="object-contain"
                height={42}
                width={42}
              />
            </Link>
            <span className="text-lg font-semibold hidden md:inline">
              Sync Application
            </span>
          </div>
        </div>

        {/* Center Section: Mobile Logo */}
        <div className="flex-1 flex justify-center md:hidden">
          <Link href="/">
            <Image
              src={logo}
              alt="4i Logo"
              className="object-contain"
              height={42}
              width={42}
            />
          </Link>
        </div>

        {/* Right Section: Search and User Avatar */}
        <div className="flex items-center gap-4">
          {/* Global Search Component */}
          {/* <div className={`pt-4 ${isHiddenLogout ? "hidden" : "block"}`}>
            <SearchComponent />
          </div> */}

          {/* User Avatar and Dropdown Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full mr-2"
                aria-label="User Menu"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@user"
                  />
                  <AvatarFallback>SN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-36">
              {/* Theme Toggle */}
              <DropdownMenuItem asChild>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  aria-label="Toggle Theme"
                >
                  <span className="font-semibold">Theme</span>
                  <ModeToggle checked={isDarkMode} onChange={toggleTheme} />
                </button>
              </DropdownMenuItem>
              {!isHiddenLogout && <DropdownMenuSeparator />}
              {!isHiddenLogout && (
                <DropdownMenuItem asChild>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <span>Logout</span>
                    <LogOut className="h-4 w-4 ml-2" />
                  </button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      {/* Background Image Section Below Navbar */}
      <div
        className="relative h-2 bg-cover"
        style={{
          backgroundImage: "url('/navbar.png')",
        }}
      ></div>
    </div>
  );
}
