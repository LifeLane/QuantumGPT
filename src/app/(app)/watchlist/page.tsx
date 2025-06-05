
'use client';

import WatchlistManager from "@/components/features/WatchlistManager";

export default function WatchlistPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-headline font-bold tracking-tight">My Watchlist</h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Keep an eye on your favorite cryptocurrencies with live data from TradingView.
          </p>
        </div>
      </div>
      <WatchlistManager />
    </div>
  );
}
