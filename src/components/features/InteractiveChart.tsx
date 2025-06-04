"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

declare global {
  interface Window {
    TradingView: any;
  }
}

const TradingViewChart: React.FC<{ symbol: string }> = ({ symbol }) => {
  const containerId = `tradingview-chart-${React.useId().replace(/:/g, "")}`; // Ensure unique ID

  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (document.getElementById(containerId) && typeof window.TradingView !== 'undefined') {
        const widgetContainer = document.getElementById(containerId);
        if (widgetContainer) {
            widgetContainer.innerHTML = ''; // Clear previous widget
            new window.TradingView.widget({
                "autosize": true,
                "symbol": symbol || "NASDAQ:AAPL", // Default to AAPL if no symbol
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": containerId,
                "hide_side_toolbar": false,
            });
        }
      }
    };
    document.body.appendChild(script);

    return () => {
      // Clean up widget if component unmounts
      const widgetContainer = document.getElementById(containerId);
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
      // Potentially remove script if it's the last chart, but usually fine to leave it
    };
  }, [symbol, containerId]);

  return <div id={containerId} className="h-[500px] w-full" />;
};

export default function InteractiveChart() {
  const [selectedSymbol, setSelectedSymbol] = React.useState("BITSTAMP:BTCUSD");
  const [symbolInput, setSymbolInput] = React.useState("BITSTAMP:BTCUSD");

  const handleSymbolChange = (value: string) => {
    setSymbolInput(value);
    setSelectedSymbol(value);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSymbolInput(event.target.value.toUpperCase());
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (symbolInput.trim()) {
      setSelectedSymbol(symbolInput.trim());
    }
  };
  

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Advanced Real-Time Chart</CardTitle>
          <CardDescription>Powered by TradingView. Enter a symbol like BINANCE:ETHUSD or NASDAQ:TSLA.</CardDescription>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
           <Input 
            type="text" 
            value={symbolInput}
            onChange={handleInputChange}
            placeholder="e.g., BINANCE:ETHUSD" 
            className="bg-background w-[200px]"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Select value={selectedSymbol} onValueChange={handleSymbolChange}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BITSTAMP:BTCUSD">BTC/USD (Bitstamp)</SelectItem>
              <SelectItem value="BINANCE:ETHUSD">ETH/USD (Binance)</SelectItem>
              <SelectItem value="COINBASE:SOLUSD">SOL/USD (Coinbase)</SelectItem>
              <SelectItem value="NASDAQ:AAPL">AAPL (NASDAQ)</SelectItem>
              <SelectItem value="NASDAQ:TSLA">TSLA (NASDAQ)</SelectItem>
              <SelectItem value="FX:EURUSD">EUR/USD (FX)</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </CardHeader>
      <CardContent>
        <TradingViewChart symbol={selectedSymbol} />
      </CardContent>
    </Card>
  );
}
