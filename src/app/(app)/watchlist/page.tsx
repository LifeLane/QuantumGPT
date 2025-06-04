
import WatchlistManager from "@/components/features/WatchlistManager";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListChecks } from "lucide-react";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-headline font-bold tracking-tight">My Watchlist</h2>
          <p className="text-muted-foreground">
            Keep an eye on your favorite cryptocurrencies with live data from TradingView.
          </p>
        </div>
      </div>
      <WatchlistManager />
    </div>
  );
}
