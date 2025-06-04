
"use client"; // Keep client component for potential future interactivity

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Lightbulb, Settings } from 'lucide-react';

// Placeholder for TradingView MarketOverviewWidget if needed later
// const MarketOverviewWidget: React.FC = () => {
//   const containerId = "tradingview-market-overview";
//   React.useEffect(() => { /* ... TradingView widget logic ... */ }, []);
//   return <div id={containerId} style={{ height: '450px', width: '100%' }} />;
// };


export default function DashboardPage() {
  // const userName = "Quantum User"; // Replace with actual user data later

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-headline font-semibold">
          {/* Welcome back, {userName}! */}
          Welcome to your Quantum GPT Dashboard!
        </h1>
        <p className="text-muted-foreground">
          Your AI-powered companion for navigating the crypto markets.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              Explore AI Features
            </CardTitle>
            <CardDescription>Discover AI Screener, Strategy tools, and more. (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group" disabled>
              Access AI Tools
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-accent" />
              Market Analytics
            </CardTitle>
            <CardDescription>Advanced charting and market data. (Coming Soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group" disabled>
              View Charts
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Settings className="h-6 w-6 text-accent" />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your profile, preferences, and subscription.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/account/settings">Go to Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for Market Overview or other widgets */}
      {/* <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            Market Overview
          </CardTitle>
          <CardDescription>Live market data. (TradingView integration placeholder)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[450px] bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Market Overview Widget Placeholder</p>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
}
