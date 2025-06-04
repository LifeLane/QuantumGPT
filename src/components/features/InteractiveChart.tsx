"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CalendarDays, ZoomIn, ZoomOut } from "lucide-react";

const initialChartData = [
  { date: "2024-01-01", price: 42000, volume: 1000000000 },
  { date: "2024-01-08", price: 45000, volume: 1200000000 },
  { date: "2024-01-15", price: 43500, volume: 900000000 },
  { date: "2024-01-22", price: 46000, volume: 1500000000 },
  { date: "2024-01-29", price: 47500, volume: 1300000000 },
  { date: "2024-02-05", price: 52000, volume: 1800000000 },
  { date: "2024-02-12", price: 51000, volume: 1600000000 },
  { date: "2024-02-19", price: 55000, volume: 2000000000 },
  { date: "2024-02-26", price: 60000, volume: 2500000000 },
  { date: "2024-03-04", price: 68000, volume: 3000000000 },
  { date: "2024-03-11", price: 65000, volume: 2800000000 },
  { date: "2024-03-18", price: 70000, volume: 3200000000 },
];

const chartConfig = {
  price: {
    label: "Price (USD)",
    color: "hsl(var(--accent))",
  },
  volume: {
    label: "Volume (USD)",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function InteractiveChart() {
  const [timeframe, setTimeframe] = React.useState("3M");
  const [chartType, setChartType] = React.useState<"line" | "area">("line");
  // In a real app, chartData would update based on timeframe and selected crypto
  const [chartData, setChartData] = React.useState(initialChartData); 

  const handleTimeframeChange = (value: string) => {
    setTimeframe(value);
    // Mock data change for demo
    const dataLength = initialChartData.length;
    let sliceEnd;
    switch(value) {
        case "1M": sliceEnd = Math.max(3, Math.floor(dataLength / 3)); break;
        case "3M": sliceEnd = Math.max(5, Math.floor(dataLength / 2)); break;
        case "1Y": sliceEnd = dataLength; break;
        default: sliceEnd = dataLength;
    }
    const newData = initialChartData.slice(0, Math.min(dataLength, sliceEnd));
    setChartData(newData);
  };

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">BTC/USD Price Chart</CardTitle>
          <CardDescription>Interactive chart for Bitcoin price analysis (mock data).</CardDescription>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1 Month</SelectItem>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="1Y">1 Year</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>
           <Select value={chartType} onValueChange={(v: "line" | "area") => setChartType(v)}>
            <SelectTrigger className="w-[120px] bg-background">
              <SelectValue placeholder="Chart Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line</SelectItem>
              <SelectItem value="area">Area</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" aria-label="Date Range (Placeholder)">
            <CalendarDays className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          {chartType === 'line' ? (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-xs"
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="hsl(var(--accent))" 
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--primary))" 
                tickFormatter={(value) => `${(value/1000000000).toFixed(1)}B`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
                domain={[0, 'dataMax + 1000000000']} // Ensure volume axis starts at 0 and has some padding
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--card))' }}
                content={<ChartTooltipContent 
                  formatter={(value, name) => (name === 'price' ? `$${Number(value).toLocaleString()}` : `$${Number(value).toLocaleString()}`)}
                  indicator="line" 
                />} 
              />
              <Legend content={<ChartLegendContent />} />
              <Line yAxisId="left" type="monotone" dataKey="price" stroke="var(--color-price)" strokeWidth={2} dot={false} name="Price" />
              <Line yAxisId="right" type="monotone" dataKey="volume" stroke="var(--color-volume)" strokeWidth={2} dot={false} name="Volume" />
            </LineChart>
          ) : (
             <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border) / 0.5)" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-xs"
              />
              <YAxis 
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                className="text-xs"
              />
              <Tooltip
                cursor={{ fill: 'hsl(var(--card))' }}
                content={<ChartTooltipContent 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  indicator="dot" 
                />}
              />
              <Legend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="price" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorPrice)" name="Price" />
            </AreaChart>
          )}
        </ChartContainer>
        <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="icon" aria-label="Zoom In (Placeholder)">
                <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" aria-label="Zoom Out (Placeholder)">
                <ZoomOut className="h-4 w-4" />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

