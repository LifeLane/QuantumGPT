
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, PlusCircle, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

declare global {
  interface Window {
    TradingView: any;
  }
}

// Default symbols for TradingView widget if none are in localStorage
const defaultSymbols = ["BINANCE:BTCUSDT", "BINANCE:ETHUSDT", "BINANCE:SOLUSDT"];

export default function WatchlistManager() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const loadSymbolsFromLocalStorage = useCallback(() => {
    const storedSymbols = localStorage.getItem('watchlistSymbols');
    if (storedSymbols) {
      setSymbols(JSON.parse(storedSymbols));
    } else {
      setSymbols(defaultSymbols); // Initialize with default if nothing in localStorage
    }
  }, []);

  const saveSymbolsToLocalStorage = useCallback((currentSymbols: string[]) => {
    localStorage.setItem('watchlistSymbols', JSON.stringify(currentSymbols));
  }, []);

  useEffect(() => {
    loadSymbolsFromLocalStorage();
  }, [loadSymbolsFromLocalStorage]);

  useEffect(() => {
    if (symbols.length > 0 && widgetContainerRef.current && window.TradingView) {
      // Clear previous widget if any
      widgetContainerRef.current.innerHTML = '';
      
      new window.TradingView.widget({
        "width": "100%",
        "height": 550,
        "symbolsGroups": [
          {
            "name": "My Watchlist",
            "originalName": "My Watchlist",
            "symbols": symbols.map(s => ({ name: s, displayName: s.split(':').pop()?.replace('USDT', '/USD') || s }))
          }
        ],
        "showSymbolLogo": true,
        "colorTheme": "dark",
        "isTransparent": true,
        "locale": "en",
        "container_id": widgetContainerRef.current.id
      });
    } else if (symbols.length === 0 && widgetContainerRef.current) {
        widgetContainerRef.current.innerHTML = '<p class="text-muted-foreground text-center py-8">Your watchlist is empty. Add some symbols to get started!</p>';
    }
  }, [symbols]);


  const handleAddSymbol = () => {
    if (newSymbol && !symbols.includes(newSymbol.toUpperCase())) {
      const updatedSymbols = [...symbols, newSymbol.toUpperCase()];
      setSymbols(updatedSymbols);
      saveSymbolsToLocalStorage(updatedSymbols);
      setNewSymbol('');
      toast({ title: "Symbol Added", description: `${newSymbol.toUpperCase()} added to your watchlist.` });
    } else if (symbols.includes(newSymbol.toUpperCase())) {
      toast({ title: "Symbol Exists", description: `${newSymbol.toUpperCase()} is already in your watchlist.`, variant: "destructive" });
    } else {
       toast({ title: "Invalid Input", description: "Please enter a symbol to add.", variant: "destructive" });
    }
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    const updatedSymbols = symbols.filter(s => s !== symbolToRemove);
    setSymbols(updatedSymbols);
    saveSymbolsToLocalStorage(updatedSymbols);
    toast({ title: "Symbol Removed", description: `${symbolToRemove} removed from your watchlist.` });
  };

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">Manage Watchlist</CardTitle>
        <CardDescription>
          Add or remove cryptocurrency symbols (e.g., BINANCE:BTCUSDT, COINBASE:ETHUSD). 
          Changes are saved locally in your browser.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="Enter symbol (e.g., BINANCE:ADAUSDT)"
            className="text-base"
          />
          <Button onClick={handleAddSymbol} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </div>

        {symbols.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Current Symbols:</h3>
            <div className="flex flex-wrap gap-2">
              {symbols.map(symbol => (
                <div key={symbol} className="flex items-center gap-2 p-2 rounded-md bg-secondary text-secondary-foreground text-xs">
                  <span>{symbol}</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-destructive" onClick={() => handleRemoveSymbol(symbol)}>
                    <X className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild className="h-5 w-5 text-muted-foreground hover:text-primary">
                     <Link href={`/charting?symbol=${encodeURIComponent(symbol)}`} title={`View chart for ${symbol}`}>
                        <Eye className="h-3 w-3" />
                     </Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div id="tradingview-watchlist-widget-container" ref={widgetContainerRef} style={{minHeight: symbols.length > 0 ? '550px' : '100px'}} className="rounded-lg overflow-hidden bg-card shadow-inner"/>

      </CardContent>
    </Card>
  );
}
