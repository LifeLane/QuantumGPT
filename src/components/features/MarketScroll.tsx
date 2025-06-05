
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react'; // Using Activity as a neutral indicator

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  price_btc: number;
  large: string;
  market_cap_rank: number; // available in trending
}

interface TrendingItem {
  item: TrendingCoin;
}

const MarketScroll: React.FC = () => {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [btcPriceUsd, setBtcPriceUsd] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const trendingResponse = await fetch('https://api.coingecko.com/api/v3/search/trending');
      if (!trendingResponse.ok) {
        throw new Error(`HTTP error! status: ${trendingResponse.status} on trending`);
      }
      const trendingData = await trendingResponse.json();
      
      const btcPriceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
      if (!btcPriceResponse.ok) {
          throw new Error(`HTTP error! status: ${btcPriceResponse.status} on BTC price`);
      }
      const btcPriceData = await btcPriceResponse.json();

      setTrending(trendingData.coins);
      if (btcPriceData.bitcoin && btcPriceData.bitcoin.usd) {
        setBtcPriceUsd(btcPriceData.bitcoin.usd);
      } else {
        console.warn("Could not fetch BTC to USD price. USD prices for trending coins will not be available.");
        setBtcPriceUsd(null); // Explicitly set to null if fetch fails
      }
      setError(null);
    } catch (err: any) {
      console.error("Error fetching market scroll data:", err);
      setError(err.message);
      // Keep existing data if partial fetch failed, or clear if preferred
      // setTrending([]); 
      // setBtcPriceUsd(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60000); // Update every 60 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  if (loading && trending.length === 0) { // Show loading only on initial load
    return <div className="text-center py-2 text-muted-foreground">Loading trending cryptocurrencies...</div>;
  }

  if (error && trending.length === 0) { // Show error only if no data could be loaded initially
    return <div className="text-center py-2 text-destructive dark:text-red-400">Error: {error}</div>;
  }
  
  if (trending.length === 0) {
    return <div className="text-center py-2 text-muted-foreground">No trending data available.</div>;
  }

  const getPriceDisplay = (priceBtc: number) => {
    if (btcPriceUsd !== null) {
      const usdPrice = priceBtc * btcPriceUsd;
      return `$${usdPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: usdPrice < 0.01 ? 8 : 4 })}`;
    }
    return `${priceBtc.toFixed(8)} BTC`;
  };
  
  // Placeholder for trend indicator. Cycle for visual effect or use static.
  const getTrendIcon = (rank: number) => {
    const mod = rank % 3;
    if (mod === 0) return <ArrowUpRight className="h-3 w-3 text-green-500 ml-1" />;
    if (mod === 1) return <ArrowDownRight className="h-3 w-3 text-red-500 ml-1" />;
    return <Activity className="h-3 w-3 text-gray-500 ml-1" />;
  };


  return (
    <div className="w-full bg-card/50 dark:bg-gray-800/50 py-2 overflow-hidden border-y border-border backdrop-blur-sm">
      <div className="flex animate-scroll whitespace-nowrap">
        {trending.map((item) => (
          <div key={item.item.id} className="flex items-center px-4 py-1 mx-2 rounded-md bg-background/30 shadow-sm">
            <img src={item.item.large} alt={item.item.name} className="w-5 h-5 mr-2 rounded-full" />
            <span className="font-semibold text-sm text-foreground">{item.item.name}</span>
            <span className="ml-1 text-xs text-muted-foreground">({item.item.symbol.toUpperCase()})</span>
            <span className="ml-2 text-sm font-medium text-accent">
              {getPriceDisplay(item.item.price_btc)}
            </span>
            {getTrendIcon(item.item.market_cap_rank || 0)} 
            {/* Using market_cap_rank to vary icon for demo, API doesn't give live trend for this list */}
          </div>
        ))}
        {/* Duplicate elements for seamless looping */}
        {trending.map((item) => (
          <div key={`${item.item.id}-duplicate`} className="flex items-center px-4 py-1 mx-2 rounded-md bg-background/30 shadow-sm" aria-hidden="true">
            <img src={item.item.large} alt={item.item.name} className="w-5 h-5 mr-2 rounded-full" />
            <span className="font-semibold text-sm text-foreground">{item.item.name}</span>
            <span className="ml-1 text-xs text-muted-foreground">({item.item.symbol.toUpperCase()})</span>
             <span className="ml-2 text-sm font-medium text-accent">
              {getPriceDisplay(item.item.price_btc)}
            </span>
            {getTrendIcon(item.item.market_cap_rank || 0)}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll linear infinite;
          animation-duration: ${trending.length * 5}s; /* Adjust speed based on number of items, make it a bit slower */
        }
      `}</style>
    </div>
  );
};

export default MarketScroll;

