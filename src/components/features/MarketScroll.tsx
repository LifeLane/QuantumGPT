'use client';

import React, { useEffect, useState } from 'react';

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  price_btc: number;
  large: string;
}

interface TrendingItem {
  item: TrendingCoin;
}

const MarketScroll: React.FC = () => {
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/search/trending');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTrending(data.coins);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    const intervalId = setInterval(fetchTrending, 60000); // Update every 60 seconds

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  if (loading) {
    return <div className="text-center py-2 text-gray-500 dark:text-gray-400">Loading trending cryptocurrencies...</div>;
  }

  if (error) {
    return <div className="text-center py-2 text-red-500 dark:text-red-400">Error fetching trending data: {error}</div>;
  }

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-800 py-2 overflow-hidden">
      <div className="flex animate-scroll whitespace-nowrap">
        {trending.map((item) => (
          <div key={item.item.id} className="flex items-center px-4">
            <img src={item.item.large} alt={item.item.name} className="w-5 h-5 mr-2 rounded-full" />
            <span className="font-semibold text-gray-900 dark:text-white">{item.item.name}</span>
            <span className="ml-1 text-gray-600 dark:text-gray-300">({item.item.symbol.toUpperCase()})</span>
            {/* CoinGecko trending endpoint doesn't provide current price directly,
                but we can display something else or fetch it separately if needed */}
            {/* <span className="ml-2 text-green-600">$123.45</span> */}
          </div>
        ))}
        {/* Duplicate elements for seamless looping */}
        {trending.map((item) => (
          <div key={`${item.item.id}-duplicate`} className="flex items-center px-4" aria-hidden="true">
            <img src={item.item.large} alt={item.item.name} className="w-5 h-5 mr-2 rounded-full" />
            <span className="font-semibold text-gray-900 dark:text-white">{item.item.name}</span>
            <span className="ml-1 text-gray-600 dark:text-gray-300">({item.item.symbol.toUpperCase()})</span>
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
          animation-duration: ${trending.length * 4}s; /* Adjust speed based on number of items */
        }
      `}</style>
    </div>
  );
};

export default MarketScroll;