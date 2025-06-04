'use server';
/**
 * @fileOverview Service for fetching cryptocurrency market data.
 * IMPORTANT: This is a placeholder service. In a real application,
 * you would integrate with a live cryptocurrency data API provider
 * (e.g., CoinGecko, CoinMarketCap, a paid service) here.
 */

export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  priceChange24hPercent: number;
  // Add other fields as needed, e.g., marketCap, high24h, low24h
}

/**
 * Fetches real-time market data for a given cryptocurrency symbol.
 * THIS IS A MOCK IMPLEMENTATION.
 * @param symbol The cryptocurrency symbol (e.g., "BTC", "ETH").
 * @returns A Promise resolving to MarketData or null if not found.
 */
export async function fetchRealTimeData(symbol: string): Promise<MarketData | null> {
  console.log(`CryptoDataService: Simulating fetching real-time data for ${symbol}`);
  // Replace this with actual API call
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Mock data based on symbol - very simplified
  const symbolUpper = symbol.toUpperCase();
  if (symbolUpper === "BTC") {
    return {
      symbol: "BTC",
      price: 68000 + (Math.random() - 0.5) * 2000, // Price around 68k +/- 1k
      volume24h: 25000000000 + (Math.random() - 0.5) * 5000000000,
      priceChange24hPercent: (Math.random() - 0.5) * 5, // +/- 2.5%
    };
  } else if (symbolUpper === "ETH") {
    return {
      symbol: "ETH",
      price: 3800 + (Math.random() - 0.5) * 200, // Price around 3.8k +/- 100
      volume24h: 15000000000 + (Math.random() - 0.5) * 3000000000,
      priceChange24hPercent: (Math.random() - 0.5) * 6,
    };
  } else {
    // Generic mock for other symbols
     return {
      symbol: symbolUpper,
      price: 100 + (Math.random() - 0.5) * 50, 
      volume24h: 100000000 + (Math.random() - 0.5) * 50000000,
      priceChange24hPercent: (Math.random() - 0.5) * 10,
    };
  }
  // return null; // If API doesn't find the symbol
}

/**
 * Fetches data for a market overview (e.g., top N cryptos).
 * THIS IS A MOCK IMPLEMENTATION.
 * @returns A Promise resolving to an array of MarketData.
 */
export async function fetchMarketOverview(): Promise<MarketData[]> {
  console.log("CryptoDataService: Simulating fetching market overview data");
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate network delay

  // In a real app, fetch top cryptos from an API
  return [
    (await fetchRealTimeData("BTC"))!,
    (await fetchRealTimeData("ETH"))!,
    (await fetchRealTimeData("SOL")) || { symbol: "SOL", price: 170, volume24h: 2000000000, priceChange24hPercent: 2.5},
    (await fetchRealTimeData("ADA")) || { symbol: "ADA", price: 0.45, volume24h: 500000000, priceChange24hPercent: -1.0},
  ].filter(Boolean) as MarketData[];
}
