
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, ListChecks } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Ensure TradingView is declared globally if not already
declare global {
  interface Window { TradingView?: any; }
}

const TV_WATCHLIST_WIDGET_CONTAINER_ID = "tv-watchlist-widget-container";

export default function WatchlistManager() {
  const [watchlistSymbols, setWatchlistSymbols] = React.useState<string[]>([
    "BITSTAMP:BTCUSD",
    "BINANCE:ETHUSDT",
    "COINBASE:SOLUSD",
  ]);
  const [newSymbol, setNewSymbol] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    if (typeof window.TradingView === 'undefined' || !document.getElementById(TV_WATCHLIST_WIDGET_CONTAINER_ID)) {
      // TradingView script might not be loaded yet, or container not ready
      return;
    }

    const container = document.getElementById(TV_WATCHLIST_WIDGET_CONTAINER_ID);
    if (container) {
        container.innerHTML = ''; // Clear previous widget
    } else {
        return;
    }

    if (watchlistSymbols.length === 0) {
      return;
    }

    new window.TradingView.widget({
      "container_id": TV_WATCHLIST_WIDGET_CONTAINER_ID,
      "width": "100%",
      "height": 450,
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt", // General crypto market, filtered by symbols
      "displayCurrency": "USD",
      "colorTheme": "dark", // Matches the app's theme
      "locale": "en",
      "isTransparent": true,
      "showSymbolLogo": true,
      "enableScrolling": true,
      "watchlist": watchlistSymbols, // This should work for the screener widget type
      "market": "crypto",
      "symbols": { // Alternative way if watchlist direct property doesn't work in this context
        "tickers": watchlistSymbols,
      },
      "gridLineColor": "rgba(240, 243, 250, 0.06)", // Adjusted for dark theme
      "headerBackgroundColor": "rgba(0,0,0,0.1)", // Darker header for the widget
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchlistSymbols]); // Re-run when watchlistSymbols change

  const addCryptoToWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim() === "") {
      toast({ title: "Error", description: "Symbol cannot be empty.", variant: "destructive" });
      return;
    }
    const symbolUpper = newSymbol.trim().toUpperCase();
    if (!symbolUpper.includes(':')) {
        toast({ title: "Info", description: "Please enter a full symbol with exchange, e.g., BINANCE:BTCUSDT or BITSTAMP:ETHUSD.", variant: "default", duration: 5000 });
        return;
    }
    if (watchlistSymbols.some(s => s.toUpperCase() === symbolUpper)) {
      toast({ title: "Info", description: `${symbolUpper} is already in your watchlist.`, variant: "default" });
      setNewSymbol("");
      return;
    }
    
    setWatchlistSymbols(prevWatchlist => [...prevWatchlist, symbolUpper]);
    setNewSymbol("");
    toast({ title: "Success", description: `${symbolUpper} added to watchlist.` });
  };

  const removeCryptoFromWatchlist = (symbolToRemove: string) => {
    setWatchlistSymbols(watchlistSymbols.filter(s => s !== symbolToRemove));
    toast({ title: "Removed", description: `${symbolToRemove} removed from watchlist.` });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"> <ListChecks className="h-6 w-6 text-accent" /> Your Watchlist</CardTitle>
        <CardDescription>Monitor your preferred cryptocurrencies with real-time data from TradingView. Enter symbols like "BINANCE:SOLUSD".</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addCryptoToWatchlist} className="flex gap-2 items-center">
          <Input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="e.g., BINANCE:ADAUSDT"
            className="bg-background flex-grow"
          />
          <Button type="submit" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        <div id={TV_WATCHLIST_WIDGET_CONTAINER_ID} style={{ minHeight: '450px' }}>
          {watchlistSymbols.length === 0 && (
            <p className="text-muted-foreground text-center py-4">Your watchlist is empty. Add some cryptocurrencies to monitor!</p>
          )}
        </div>
        
        {watchlistSymbols.length > 0 && (
            <div className="mt-4 space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">Symbols in Watchlist:</h3>
                <ul className="max-h-40 overflow-y-auto rounded-md border p-2 bg-secondary/50">
                    {watchlistSymbols.map(symbol => (
                        <li key={symbol} className="flex items-center justify-between p-1.5 hover:bg-accent/10 rounded-md">
                            <span className="text-sm">{symbol}</span>
                            <Button variant="ghost" size="icon" onClick={() => removeCryptoFromWatchlist(symbol)} aria-label={`Remove ${symbol}`}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
