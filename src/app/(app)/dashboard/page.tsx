"use client";

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, BotMessageSquare, ListChecks } from 'lucide-react'; // Removed LineChartIcon

// TradingView Market Overview Widget
const MarketOverviewWidget: React.FC = () => {
  const containerId = "tradingview-market-overview";
  React.useEffect(() => {
    if (document.getElementById(containerId) && typeof TradingView !== 'undefined') {
      // Ensure the container is empty before appending a new widget
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = ''; // Clear previous widget if any
      }
      new TradingView.MarketOverview({
        "container_id": containerId,
        "colorTheme": "dark",
        "dateRange": "12M",
        "showChart": true,
        "locale": "en",
        "largeChartUrl": "",
        "isTransparent": true,
        "showSymbolLogo": true,
        "showFloatingTooltip": false,
        "width": "100%",
        "height": "450",
        "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
        "plotLineColorFalling": "rgba(255, 71, 71, 1)",
        "gridLineColor": "rgba(240, 243, 250, 0)",
        "scaleFontColor": "rgba(120, 123, 134, 1)",
        "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
        "belowLineFillColorFalling": "rgba(255, 71, 71, 0.12)",
        "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
        "belowLineFillColorFallingBottom": "rgba(255, 71, 71, 0)",
        "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
        "tabs": [
          {
            "title": "Indices",
            "symbols": [
              { "s": "FOREXCOM:SPXUSD", "d": "S&P 500" },
              { "s": "FOREXCOM:NSXUSD", "d": "US 100" },
              { "s": "BITSTAMP:BTCUSD", "d": "Bitcoin" },
              { "s": "BITSTAMP:ETHUSD", "d": "Ethereum" }
            ],
            "originalTitle": "Indices"
          },
          {
            "title": "Cryptocurrencies",
            "symbols": [
              { "s": "BITSTAMP:BTCUSD", "d": "Bitcoin" },
              { "s": "BITSTAMP:ETHUSD", "d": "Ethereum" },
              { "s": "BINANCE:SOLUSD", "d": "Solana" },
              { "s": "BINANCE:ADAUSD", "d": "Cardano" },
              { "s": "BINANCE:XRPUSD", "d": "Ripple" },
              { "s": "BINANCE:DOGEUSD", "d": "Dogecoin" }
            ],
            "originalTitle": "Cryptocurrencies"
          }
        ]
      });
    }
  }, []);

  return <div id={containerId} style={{ height: '450px', width: '100%' }} />;
};


export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-headline font-semibold">Welcome to CryptoSage</h1>
      <p className="text-muted-foreground">
        Your AI-powered companion for navigating the crypto markets.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Search className="h-6 w-6 text-accent" />
              Crypto Screener
            </CardTitle>
            <CardDescription>Discover promising cryptocurrencies with our AI-powered screener.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/screener">Start Screening <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BotMessageSquare className="h-6 w-6 text-accent" />
              AI Trading Strategy
            </CardTitle>
            <CardDescription>Get AI-suggested trading strategies tailored to your risk profile.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/strategy">Get Strategy <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <ListChecks className="h-6 w-6 text-accent" />
              Your Watchlist
            </CardTitle>
            <CardDescription>Monitor your favorite cryptocurrencies and their performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/watchlist">View Watchlist <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            {/* Using a generic icon as LineChartIcon might imply a custom chart */}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-accent"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            Market Overview
          </CardTitle>
          <CardDescription>Live market data powered by TradingView.</CardDescription>
        </CardHeader>
        <CardContent>
          <MarketOverviewWidget />
        </CardContent>
      </Card>
    </div>
  );
}
