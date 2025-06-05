
'use client';

import React, { useEffect, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight } from 'lucide-react';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  price_btc: number;
  large: string;
  market_cap_rank: number;
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
    // Reset error state at the beginning of each fetch attempt
    setError(null); 
    setLoading(true);
    try {
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

      setTrending(trendingData.coins || []); // Ensure trendingData.coins is not undefined
      if (btcPriceData.bitcoin && btcPriceData.bitcoin.usd) {
        setBtcPriceUsd(btcPriceData.bitcoin.usd);
      } else {
        console.warn("Could not fetch BTC to USD price. USD prices for trending coins will not be available.");
        setBtcPriceUsd(null);
      }
      // setError(null); // Already done at the beginning
    } catch (err: any) {
      console.error("Error fetching market scroll data:", err);
      setError(err.message || "An unknown error occurred while fetching market data.");
      setTrending([]); // Clear trending data on error
      setBtcPriceUsd(null); // Clear BTC price on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const intervalId = setInterval(fetchPrices, 60000); 
    return () => clearInterval(intervalId);
  }, []);

  if (loading && trending.length === 0 && !error) { // Only show initial loading if no error
    return <div className="text-center py-1 text-xs text-muted-foreground">Loading trending...</div>;
  }

  if (error) { // Prioritize showing error message
    return <div className="text-center py-1 text-xs text-destructive dark:text-red-400">Error: {error.length > 50 ? error.substring(0,50) + "..." : error}</div>;
  }
  
  if (!loading && trending.length === 0) { // If not loading, no error, but no data
    return <div className="text-center py-1 text-xs text-muted-foreground">No trending data.</div>;
  }

  const getPriceDisplay = (priceBtc: number) => {
    if (btcPriceUsd !== null) {
      const usdPrice = priceBtc * btcPriceUsd;
      return `$${usdPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: usdPrice < 0.01 ? 8 : 4 })}`;
    }
    return `${priceBtc.toFixed(8)} BTC`;
  };
  
  const getTrendIcon = (rank: number) => {
    // Cycle icons for visual effect as API doesn't provide live trend for this specific list
    const mod = rank % 3;
    if (mod === 0) return <ArrowUpRight className="h-3 w-3 text-green-500 ml-0.5 shrink-0" />;
    if (mod === 1) return <ArrowDownRight className="h-3 w-3 text-red-500 ml-0.5 shrink-0" />;
    return <Activity className="h-3 w-3 text-gray-500 ml-0.5 shrink-0" />;
  };

  // Only render the scroll if there's data to show and no critical error preventing data display.
  if (trending.length === 0) return null; 

  const duplicatedTrending = [...trending, ...trending]; // Duplicate for seamless scroll

  return (
    <div className="w-full py-1 overflow-hidden h-full flex items-center"> {/* Adjusted for header height */}
      <div className="flex animate-scroll whitespace-nowrap h-full items-center">
        {duplicatedTrending.map((item, index) => (
          <div 
            key={`${item.item.id}-${index}`} 
            className="flex items-center px-3 py-1 mx-1.5 rounded-md bg-background/30 shadow-sm h-[calc(100%-0.25rem)]" // Slightly less height to avoid touching header borders
            aria-hidden={index >= trending.length ? "true" : undefined}
          >
            <img src={item.item.large} alt={item.item.name} className="w-4 h-4 mr-1.5 rounded-full shrink-0" />
            <span className="font-semibold text-xs text-foreground truncate max-w-[60px] sm:max-w-[80px]">{item.item.name}</span>
            <span className="ml-1 text-[10px] text-muted-foreground hidden sm:inline">({item.item.symbol.toUpperCase()})</span>
            <span className="ml-1.5 text-xs font-medium text-accent whitespace-nowrap">
              {getPriceDisplay(item.item.price_btc)}
            </span>
            {getTrendIcon(item.item.market_cap_rank || 0)}
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); } /* Scroll one full set of items */
        }
        .animate-scroll {
          animation: scroll linear infinite;
          animation-duration: ${trending.length * 6}s; /* Adjust speed: 6s per item */
        }
        /* Ensure items don't wrap if flex calculation is slightly off */
        .animate-scroll > div {
          flex-shrink: 0;
        }
      `}</style>
    </div>
  );
};

export default MarketScroll;

