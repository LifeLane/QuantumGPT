"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Trash2, LineChartIcon, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WatchlistItem {
  id: string;
  symbol: string;
  price: number;
  change: number;
}

const initialWatchlist: WatchlistItem[] = [
  { id: "btc", symbol: "BTC", price: 68500.75, change: 1.25 },
  { id: "eth", symbol: "ETH", price: 3500.20, change: -0.50 },
  { id: "sol", symbol: "SOL", price: 170.10, change: 2.75 },
];

export default function WatchlistManager() {
  const [watchlist, setWatchlist] = React.useState<WatchlistItem[]>(initialWatchlist);
  const [newSymbol, setNewSymbol] = React.useState("");
  const { toast } = useToast();

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setWatchlist(currentWatchlist =>
        currentWatchlist.map(item => {
          // Simulate price change: +/- 0.05% to 0.5% of current price
          const priceChangePercent = (Math.random() - 0.5) * 0.01; // Max 0.5% change
          const newPrice = item.price * (1 + priceChangePercent);
          // Simulate 24h change: a random number between -5% and 5%
          const newChange = (Math.random() - 0.5) * 10; 
          return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(newChange.toFixed(2)),
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(intervalId);
  }, []);


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
    
    const newItem: WatchlistItem = {
      id: newSymbol.toLowerCase().trim(),
      symbol: newSymbol.toUpperCase().trim(),
      price: parseFloat((Math.random() * 70000 + 100).toFixed(2)), // Mock price between $100 and $70100
      change: parseFloat(((Math.random() - 0.5) * 10).toFixed(2)), // Mock change
    };
    setWatchlist(prevWatchlist => [...prevWatchlist, newItem]);
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
        <CardDescription>Monitor your preferred cryptocurrencies (prices update every 3s - simulation).</CardDescription>
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
