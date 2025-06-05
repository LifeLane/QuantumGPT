
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Bot, ListChecks, Bell, LineChart } from "lucide-react";
import MatrixRain from "@/components/effects/MatrixRain";
import Footer from "@/components/layout/Footer";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/strategy", label: "AI Strategy", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: ListChecks },
  { href: "/alerts", label: "Price Alerts", icon: Bell },
  { href: "/charting", label: "Charting Tools", icon: LineChart },
  // { href: "/account/settings", label: "Account Settings", icon: Settings }, // Removed account settings
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <LogoIcon className="w-8 h-8 text-primary" />
            <div className="flex flex-col">
              <h1 className="text-xl font-headline font-semibold text-primary">Quantum GPT</h1>
              <span className="text-xs text-muted-foreground -mt-1">Powered by BlockSmithAI</span>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent className="p-0">
          <ScrollArea className="h-full">
            <SidebarMenu className="p-4 pt-0">
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                    tooltip={{ children: item.label, className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          {/* User avatar and logout removed */}
          <div className="text-xs text-muted-foreground text-center">
            Quantum GPT Alpha
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="flex flex-col relative"> {/* Added relative positioning */}
        <MatrixRain /> {/* Added MatrixRain component */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-sm px-6 md:justify-end"> {/* Increased z-index for header */}
          <SidebarTrigger className="md:hidden" />
          {/* User info or search could go here in header */}
        </header>
        <main className="flex-1 overflow-y-auto p-6 z-10 relative"> {/* Added z-index and relative for main content */}
          {children}
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
