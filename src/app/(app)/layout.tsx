
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
import { LayoutDashboard, Bot, ListChecks, Bell, LineChart, Info, TrendingUp, TrendingDown, MinusCircle } from "lucide-react";
import MatrixRain from "@/components/effects/MatrixRain";
import Footer from "@/components/layout/Footer";
import MarketScroll from "@/components/features/MarketScroll";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/strategy", label: "AI Strategy", icon: Bot },
  { href: "/watchlist", label: "Watchlist", icon: ListChecks },
  { href: "/alerts", label: "Price Alerts", icon: Bell },
  { href: "/charting", label: "Charting Tools", icon: LineChart },
];

interface MarketGlanceData {
  marketCap: string | null;
  marketCapChange24h: number | null;
  topVolumeCoins: { name: string; symbol: string; total_volume: number }[];
  topGainerCoins: { name: string; symbol: string; price_change_percentage_24h: number }[];
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [marketData, setMarketData] = React.useState<MarketGlanceData | null>(null);
  const [isLoadingData, setIsLoadingData] = React.useState(true);

  const formatMarketCap = (num: number | undefined | null): string => {
    if (num === null || num === undefined) return 'N/A';
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  React.useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoadingData(true);
      try {
        const globalRes = await fetch('https://api.coingecko.com/api/v3/global');
        const globalData = await globalRes.json();

        const coinsRes = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h');
        const coinsData = await coinsRes.json();

        const marketCap = globalData?.data?.total_market_cap?.usd;
        const marketCapChange24h = globalData?.data?.market_cap_change_percentage_24h_usd;

        let topVolumeCoins: MarketGlanceData['topVolumeCoins'] = [];
        let topGainerCoins: MarketGlanceData['topGainerCoins'] = [];

        if (Array.isArray(coinsData)) {
          topVolumeCoins = [...coinsData]
            .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
            .slice(0, 3)
            .map(coin => ({ name: coin.name, symbol: coin.symbol.toUpperCase(), total_volume: coin.total_volume }));

          topGainerCoins = [...coinsData]
            .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
            .filter(coin => (coin.price_change_percentage_24h || 0) > 0) 
            .slice(0, 3)
            .map(coin => ({ name: coin.name, symbol: coin.symbol.toUpperCase(), price_change_percentage_24h: coin.price_change_percentage_24h }));
        }
        
        setMarketData({
          marketCap: formatMarketCap(marketCap),
          marketCapChange24h: marketCapChange24h || 0,
          topVolumeCoins,
          topGainerCoins,
        });

      } catch (error) {
        console.error("Failed to fetch market glance data:", error);
        setMarketData({ 
          marketCap: 'N/A',
          marketCapChange24h: 0,
          topVolumeCoins: [
            { name: 'ErrorCoin', symbol: 'ERR', total_volume: 0 },
          ],
          topGainerCoins: [
            { name: 'ErrorCoin', symbol: 'ERR', price_change_percentage_24h: 0 },
          ],
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchMarketData();
    const intervalId = setInterval(fetchMarketData, 60000); 
    return () => clearInterval(intervalId);
  }, []);

  const getSentimentIcon = () => {
    if (isLoadingData || !marketData || marketData.marketCapChange24h === null) return <MinusCircle className="h-3 w-3 text-yellow-500" />;
    if (marketData.marketCapChange24h > 0.1) return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (marketData.marketCapChange24h < -0.1) return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <MinusCircle className="h-3 w-3 text-yellow-500" />;
  };

  const getSentimentText = () => {
    if (isLoadingData || !marketData || marketData.marketCapChange24h === null) return "Loading...";
    if (marketData.marketCapChange24h > 0.1) return `Bullish (${marketData.marketCapChange24h.toFixed(2)}%)`;
    if (marketData.marketCapChange24h < -0.1) return `Bearish (${marketData.marketCapChange24h.toFixed(2)}%)`;
    return `Neutral (${marketData.marketCapChange24h.toFixed(2)}%)`;
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
               <SidebarGroup className="p-0 mt-2">
                <SidebarGroupLabel className="flex items-center gap-2 px-2 text-xs font-medium text-sidebar-foreground/70">
                  <Info className="h-4 w-4" />
                  Market At A Glance
                </SidebarGroupLabel>
                <SidebarGroupContent className="text-xs space-y-1 p-2 text-sidebar-foreground/90">
                  {isLoadingData ? (
                    <div className="space-y-2 p-2">
                      <p>Loading market data...</p>
                    </div>
                  ) : marketData ? (
                    <Tabs defaultValue="market_cap" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 h-auto mb-2 text-xs p-0.5">
                        <TabsTrigger value="market_cap" className="px-1 py-0.5 text-xs h-auto">Cap</TabsTrigger>
                        <TabsTrigger value="sentiment" className="px-1 py-0.5 text-xs h-auto">Sentiment</TabsTrigger>
                        <TabsTrigger value="top_volume" className="px-1 py-0.5 text-xs h-auto">Volume</TabsTrigger>
                        <TabsTrigger value="top_gainers" className="px-1 py-0.5 text-xs h-auto">Gainers</TabsTrigger>
                      </TabsList>
                      <TabsContent value="market_cap" className="mt-0 p-1 border rounded-md bg-sidebar-background/50">
                        <p className="font-semibold">Market Cap:</p>
                        <p>{marketData.marketCap}</p>
                      </TabsContent>
                      <TabsContent value="sentiment" className="mt-0 p-1 border rounded-md bg-sidebar-background/50">
                        <p className="font-semibold">Sentiment:</p>
                        <p className="flex items-center gap-1">{getSentimentIcon()} {getSentimentText()}</p>
                      </TabsContent>
                      <TabsContent value="top_volume" className="mt-0 p-1 border rounded-md bg-sidebar-background/50">
                        <p className="font-semibold">Top Volume (24h):</p>
                        <ul className="list-none pl-1">
                          {marketData.topVolumeCoins.length > 0 ? marketData.topVolumeCoins.map((coin, index) => (
                            <li key={`vol-${index}`}>{index + 1}. {coin.symbol} ({formatMarketCap(coin.total_volume)})</li>
                          )) : <li>N/A</li>}
                        </ul>
                      </TabsContent>
                      <TabsContent value="top_gainers" className="mt-0 p-1 border rounded-md bg-sidebar-background/50">
                        <p className="font-semibold">Top Gainers (24h):</p>
                        <ul className="list-none pl-1">
                          {marketData.topGainerCoins.length > 0 ? marketData.topGainerCoins.map((coin, index) => (
                            <li key={`gain-${index}`}>{index + 1}. {coin.symbol} (+{coin.price_change_percentage_24h.toFixed(2)}%)</li>
                          )) : <li>N/A</li>}
                        </ul>
                      </TabsContent>
                    </Tabs>
                  ) : (
                     <div className="p-2"><p className="font-semibold text-destructive">Error loading market data.</p></div>
                  )}
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
          <div className="flex-1 overflow-hidden"> {/* Container for MarketScroll */}
            <MarketScroll />
          </div>
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
    
