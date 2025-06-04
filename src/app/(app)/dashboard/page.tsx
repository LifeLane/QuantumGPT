"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Search, BotMessageSquare, ListChecks, LineChartIcon } from 'lucide-react';
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { date: 'Jan', value: 60 },
  { date: 'Feb', value: 80 },
  { date: 'Mar', value: 70 },
  { date: 'Apr', value: 90 },
  { date: 'May', value: 75 },
  { date: 'Jun', value: 100 },
];

const chartConfig = {
  value: {
    label: "Market Trend",
    color: "hsl(var(--accent))",
  },
} as const;

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
            <LineChartIcon className="h-6 w-6 text-accent" />
            Market Overview
          </CardTitle>
          <CardDescription>A quick glance at the current market trend (mock data).</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <RechartsLineChart data={chartData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} />
              <Tooltip cursor={{ fill: 'hsl(var(--card))' }} content={<ChartTooltipContent />} />
              <Line dataKey="value" type="monotone" stroke="var(--color-value)" strokeWidth={2} dot={false} />
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
