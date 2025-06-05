
"use client"; 

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, ListChecks, Bot } from 'lucide-react';
import MarketScroll from '@/components/features/MarketScroll';

export default function DashboardPage() {

  return (
    <div className="flex flex-row items-start h-full min-w-max py-2 space-x-6">
      {/* MarketScroll can be a column if desired, or integrated differently */}
      <div className="flex-shrink-0 w-full md:w-[calc(100vw-18rem)]"> {/* Example width for scroll */}
         <MarketScroll />
      </div>
      
      {/* Welcome Text and Feature Cards container - as a column */}
      <div className="flex flex-col space-y-6 flex-shrink-0 w-auto">
        <div>
          <h1 className="text-4xl font-headline font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
            Welcome to Quantum GPT!
          </h1>
          <p className="text-lg text-muted-foreground mt-1">
            Your AI-powered companion for navigating the crypto markets.
          </p>
        </div>

        {/* Feature Cards - arranged horizontally within their parent column */}
        <div className="flex flex-row space-x-6">
          <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105 flex-shrink-0 w-72">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <Bot className="h-7 w-7 text-accent" />
                AI Trading Strategy
              </CardTitle>
              <CardDescription className="text-sm">Unlock personalized trading strategies with our advanced AI.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full group border-accent text-accent hover:bg-accent hover:text-background">
                <Link href="/strategy">Uncover AI Insights</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105 flex-shrink-0 w-72">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <BarChart3 className="h-7 w-7 text-accent" />
                Advanced Market Analytics
              </CardTitle>
              <CardDescription className="text-sm">Dive deep into market trends with real-time charts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full group border-accent text-accent hover:bg-accent hover:text-background">
                 <Link href="/charting">Chart the Future</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105 flex-shrink-0 w-72">
            <CardHeader>
              <CardTitle className="font-headline text-xl flex items-center gap-2">
                <ListChecks className="h-7 w-7 text-accent" />
                My Watchlist
              </CardTitle>
              <CardDescription className="text-sm">Monitor your favorite cryptos and stay ahead.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full group border-accent text-accent hover:bg-accent hover:text-background">
                <Link href="/watchlist">Track My Coins</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}
