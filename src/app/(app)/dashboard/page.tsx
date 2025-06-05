
"use client"; 

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { BarChart3, ListChecks, Bot, TrendingUp } from 'lucide-react';
import MarketScroll from '@/components/features/MarketScroll';

export default function DashboardPage() {

  return (
    <div className="flex flex-col gap-8">
      <MarketScroll />

      {/* Daily Crypto Market Insight Section */}
      <div className="p-6 bg-card/70 backdrop-blur-sm border border-slate-700 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="h-8 w-8 text-accent" />
          <h2 className="text-2xl font-headline font-bold text-foreground">Daily Crypto Pulse</h2>
        </div>
        <p className="text-md text-muted-foreground leading-relaxed">
          BTC holds steady above $68k, ETH eyes a breakout. Altcoin season simmering? QuantumGPT is monitoring key signals 24/7. Your personalized AI insights await below.
        </p>
      </div>

      <div>
        <h1 className="text-4xl font-headline font-semibold text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-pulse">
          Welcome to Quantum GPT!
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Your AI-powered companion for navigating the crypto markets.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        
        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105">
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

        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105">
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

        <Card className="bg-card/70 backdrop-blur-sm border-slate-700 shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out hover:scale-105">
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
  );
}
