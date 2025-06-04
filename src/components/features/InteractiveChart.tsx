
"use client";

import * as React from "react";
import { useSearchParams } from 'next/navigation';
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

const TradingViewChartWidget: React.FC<{ symbol: string; key?: string }> = React.memo(({ symbol }) => {
  const containerId = `tradingview-chart-widget-${React.useId().replace(/:/g, "")}`;

  React.useEffect(() => {
    // TradingView script is loaded globally via src/app/layout.tsx
    // We just need to ensure the TradingView object and container exist.
    if (typeof window.TradingView === 'undefined' || !document.getElementById(containerId)) {
      // Retry if TradingView is not loaded yet
      const timeoutId = setTimeout(() => {
        if (typeof window.TradingView !== 'undefined' && document.getElementById(containerId)) {
          const widgetContainer = document.getElementById(containerId);
          if (widgetContainer) {
              widgetContainer.innerHTML = ''; // Clear previous widget
              new window.TradingView.widget({
                  "autosize": true,
                  "symbol": symbol || "BITSTAMP:BTCUSD", 
                  "interval": "D",
                  "timezone": "Etc/UTC",
                  "theme": "dark",
                  "style": "1",
                  "locale": "en",
                  "toolbar_bg": "#f1f3f6", // This might be overridden by dark theme
                  "enable_publishing": false,
                  "allow_symbol_change": true, // User can change symbol in widget
                  "container_id": containerId,
                  "hide_side_toolbar": false,
              });
          }
        }
      }, 200); // Short delay to allow TV script to potentially finish loading
      return () => clearTimeout(timeoutId);
    }
    
    const widgetContainer = document.getElementById(containerId);
    if (widgetContainer) {
        widgetContainer.innerHTML = ''; // Clear previous widget
        new window.TradingView.widget({
            "autosize": true,
            "symbol": symbol || "BITSTAMP:BTCUSD", 
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

    return () => {
      const widgetContainer = document.getElementById(containerId);
      if (widgetContainer) {
        widgetContainer.innerHTML = '';
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbol, containerId]); // Re-render the widget if the symbol changes

  return <div id={containerId} className="h-[500px] w-full" />;
});
TradingViewChartWidget.displayName = 'TradingViewChartWidget';


export default function InteractiveChart() {
  const searchParams = useSearchParams();
  const initialSymbolFromUrl = searchParams.get('symbol');

  const [selectedSymbol, setSelectedSymbol] = React.useState(initialSymbolFromUrl || "BITSTAMP:BTCUSD");
  const [symbolInput, setSymbolInput] = React.useState(initialSymbolFromUrl || "BITSTAMP:BTCUSD");

  // Update symbol if URL param changes after initial load
  React.useEffect(() => {
    const symbolFromUrl = searchParams.get('symbol');
    if (symbolFromUrl && symbolFromUrl !== selectedSymbol) {
      setSelectedSymbol(symbolFromUrl);
      setSymbolInput(symbolFromUrl);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);


  const handleSymbolChangeFromSelect = (value: string) => {
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
      // Optionally update URL query param here if desired
      // router.push(`/charting?symbol=${encodeURIComponent(symbolInput.trim())}`);
    }
  };
  

  return (
    <Card className="shadow-lg w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="font-headline">Advanced Real-Time Chart</CardTitle>
          <CardDescription>Powered by TradingView. Enter a symbol like "BINANCE:ETHUSD" or "NASDAQ:TSLA".</CardDescription>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
           <Input 
            type="text" 
            value={symbolInput}
            onChange={handleInputChange}
            placeholder="e.g., BINANCE:ETHUSD" 
            className="bg-background w-full sm:w-[200px]"
          />
          <Button type="submit" variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
          <Select value={selectedSymbol} onValueChange={handleSymbolChangeFromSelect}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background">
              <SelectValue placeholder="Select Symbol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BITSTAMP:BTCUSD">BTC/USD (Bitstamp)</SelectItem>
              <SelectItem value="BINANCE:ETHUSDT">ETH/USDT (Binance)</SelectItem>
              <SelectItem value="COINBASE:SOLUSD">SOL/USD (Coinbase)</SelectItem>
              <SelectItem value="BINANCE:ADAUSDT">ADA/USDT (Binance)</SelectItem>
              <SelectItem value="NASDAQ:AAPL">AAPL (NASDAQ)</SelectItem>
              <SelectItem value="NASDAQ:TSLA">TSLA (NASDAQ)</SelectItem>
              <SelectItem value="FX:EURUSD">EUR/USD (FX)</SelectItem>
            </SelectContent>
          </Select>
        </form>
      </CardHeader>
      <CardContent>
        {/* Use a key to force re-mount when symbol changes, ensuring widget re-initializes */}
        <TradingViewChartWidget symbol={selectedSymbol} key={selectedSymbol} />
      </CardContent>
    </Card>
  );
}
