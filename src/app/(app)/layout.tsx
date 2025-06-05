
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
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/icons/LogoIcon";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutDashboard, Bot, ListChecks, Bell, LineChart, AreaChart, MinusCircle, Info } from "lucide-react";
import MatrixRain from "@/components/effects/MatrixRain";
import Footer from "@/components/layout/Footer";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/strategy", label: "AI Strategy", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: ListChecks },
  { href: "/alerts", label: "Price Alerts", icon: Bell },
  { href: "/charting", label: "Charting Tools", icon: LineChart },
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
               <SidebarGroup className="p-0 mt-2">
                <SidebarGroupLabel className="flex items-center gap-2 px-2 text-xs font-medium text-sidebar-foreground/70">
                  <Info className="h-4 w-4" />
                  Market At A Glance
                </SidebarGroupLabel>
                <SidebarGroupContent className="text-xs space-y-1 p-2 text-sidebar-foreground/90">
                  <div>
                    <p className="font-semibold">Market Cap:</p>
                    <p>$2.41T (Simulated)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Sentiment:</p>
                    <p className="flex items-center gap-1"><MinusCircle className="h-3 w-3 text-yellow-500" /> Neutral (Simulated)</p>
                  </div>
                  <div>
                    <p className="font-semibold">Top Volume (24h):</p>
                    <ul className="list-none pl-1">
                      <li>1. USDT (Simulated)</li>
                      <li>2. BTC (Simulated)</li>
                      <li>3. ETH (Simulated)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Top Gainers (24h):</p>
                    <ul className="list-none pl-1">
                      <li>1. PEPE (Simulated)</li>
                      <li>2. BONK (Simulated)</li>
                      <li>3. WIF (Simulated)</li>
                    </ul>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarMenu>
          </ScrollArea>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-muted-foreground text-center">
            Quantum GPT Alpha
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="h-screen flex flex-col overflow-hidden relative">
        <MatrixRain />
        <header className="sticky top-0 z-20 flex h-14 items-center justify-start gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 flex-shrink-0">
          <SidebarTrigger />
          {/* Other header items can go here if needed */}
        </header>
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 md:p-6 lg:p-8 z-10 relative">
          <div className="flex flex-row h-full min-w-max">
            {children}
          </div>
        </main>
        <Footer />
      </SidebarInset>
    </SidebarProvider>
  );
}
