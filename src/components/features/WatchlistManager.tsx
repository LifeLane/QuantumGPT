"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, LineChartIcon, TrendingUp, TrendingDown } from "lucide-react"; // Changed LineChart to LineChartIcon
import { useToast } from "@/hooks/use-toast";

interface WatchlistItem {
  id: string;
  symbol: string;
  price: number; // Mock price
  change: number; // Mock change
}

export default function WatchlistManager() {
  const [watchlist, setWatchlist] = React.useState<WatchlistItem[]>([
    { id: "btc", symbol: "BTC", price: 68500.75, change: 1.25 },
    { id: "eth", symbol: "ETH", price: 3500.20, change: -0.50 },
    { id: "sol", symbol: "SOL", price: 170.10, change: 2.75 },
  ]);
  const [newSymbol, setNewSymbol] = React.useState("");
  const { toast } = useToast();

  const addCryptoToWatchlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol.trim() === "") {
      toast({ title: "Error", description: "Symbol cannot be empty.", variant: "destructive" });
      return;
    }
    if (watchlist.some(item => item.symbol.toUpperCase() === newSymbol.trim().toUpperCase())) {
      toast({ title: "Info", description: `${newSymbol.toUpperCase()} is already in your watchlist.`, variant: "default" });
      setNewSymbol("");
      return;
    }
    // In a real app, you'd fetch price data here.
    const newItem: WatchlistItem = {
      id: newSymbol.toLowerCase(),
      symbol: newSymbol.toUpperCase(),
      price: Math.random() * 100000, // Mock price
      change: (Math.random() - 0.5) * 10, // Mock change
    };
    setWatchlist([...watchlist, newItem]);
    setNewSymbol("");
    toast({ title: "Success", description: `${newItem.symbol} added to watchlist.` });
  };

  const removeCryptoFromWatchlist = (id: string) => {
    const itemToRemove = watchlist.find(item => item.id === id);
    setWatchlist(watchlist.filter(item => item.id !== id));
    if (itemToRemove) {
        toast({ title: "Removed", description: `${itemToRemove.symbol} removed from watchlist.` });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Your Watchlist</CardTitle>
        <CardDescription>Monitor your preferred cryptocurrencies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={addCryptoToWatchlist} className="flex gap-2">
          <Input
            type="text"
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value)}
            placeholder="e.g., ADA, DOT"
            className="bg-background flex-grow"
          />
          <Button type="submit" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add
          </Button>
        </form>

        {watchlist.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">Your watchlist is empty. Add some cryptocurrencies to monitor!</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Change (24h)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {watchlist.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                       <LineChartIcon className="h-5 w-5 text-accent" />
                      {item.symbol}
                    </TableCell>
                    <TableCell className="text-right">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                    <TableCell className={`text-right font-medium ${item.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      <span className="inline-flex items-center">
                        {item.change >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {item.change.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCryptoFromWatchlist(item.id)}
                        aria-label={`Remove ${item.symbol} from watchlist`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
