
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
// import { useRouter } from "next/navigation"; // For logout
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
import { Settings, LogOut, LayoutDashboard, Bot, ListChecks, Bell, LineChart } from "lucide-react"; // Removed Search icon
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import MatrixRain from "@/components/effects/MatrixRain";


const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  // { href: "/screener", label: "Crypto Screener", icon: Search }, // Removed Crypto Screener
  { href: "/strategy", label: "AI Strategy", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: ListChecks },
  { href: "/alerts", label: "Price Alerts", icon: Bell },
  { href: "/charting", label: "Charting Tools", icon: LineChart },
  { href: "/account/settings", label: "Account Settings", icon: Settings },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toast } = useToast();
  // const router = useRouter(); // For logout

  const handleLogout = async () => {
    // Simulate logout
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      const result = await response.json();
      if (response.ok) {
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        // router.push('/login'); // Redirect to login after logout
         console.log("Logout successful (simulated)", result);
      } else {
        toast({ title: "Logout Failed", description: result.message || "Could not log out.", variant: "destructive" });
      }
    } catch (error) {
        toast({ title: "Logout Error", description: "An unexpected error occurred.", variant: "destructive"});
    }
  };

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center justify-start gap-2 w-full px-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://placehold.co/40x40.png" alt="Quantum User" data-ai-hint="user avatar"/>
                  <AvatarFallback>QG</AvatarFallback>
                </Avatar>
                {/* In a real app, display actual user name */}
                <span className="font-medium group-data-[collapsible=icon]:hidden">Quantum User</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        <footer className="p-6 border-t text-center text-xs text-muted-foreground z-10 relative bg-background/80 backdrop-blur-sm"> {/* Added z-index, relative and bg for footer */}
            &copy; {new Date().getFullYear()} Quantum GPT by BlockSmithAI. All rights reserved.
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
