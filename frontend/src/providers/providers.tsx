"use client";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "../components/ThemeProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { SessionProvider } from "next-auth/react";

const Providers = ({ children }: { children: React.ReactNode }) => { 

    return (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        disableTransitionOnChange={false}
      >
        <SessionProvider>
        <NuqsAdapter>
          {children}
         </NuqsAdapter>
        <Toaster richColors />
        </SessionProvider>
      </ThemeProvider>
    );
}


export default Providers;