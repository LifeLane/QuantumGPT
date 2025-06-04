
"use client"; // Keep client component for potential future interactivity

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, Lightbulb, Settings, Bot } from 'lucide-react'; // Removed Search icon
import MarketScroll from '@/components/features/MarketScroll';

export default function DashboardPage() {
  // const userName = "Quantum User"; // Replace with actual user data later

  return (
    <div className="flex flex-col gap-8">
      {/* Add the MarketScroll component */}
      <MarketScroll />
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
        {/* Removed AI Crypto Screener Card
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Search className="h-6 w-6 text-accent" />
              AI Crypto Screener
            </CardTitle>
            <CardDescription>Discover promising cryptocurrencies with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/screener">Access AI Screener</Link>
            </Button>
          </CardContent>
        </Card>
        */}
        
        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Bot className="h-6 w-6 text-accent" />
              AI Trading Strategy
            </CardTitle>
            <CardDescription>Get AI-powered trading strategy suggestions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
              <Link href="/strategy">Explore AI Strategies</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-accent" />
              Market Analytics
            </CardTitle>
            <CardDescription>Advanced charting and market data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full group">
               <Link href="/charting">View Charts</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-105">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-accent" />
              More Tools (Coming Soon)
            </CardTitle>
            <CardDescription>Watchlist, Price Alerts and more.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full group" disabled>
              Explore More
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

    </div>
  );
}
