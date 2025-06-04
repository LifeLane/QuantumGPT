
'use server';
/**
 * @fileOverview Service for fetching cryptocurrency market data.
 * IMPORTANT: This is a placeholder service with MOCK DATA.
 * For live, real-time data, you MUST replace the mock implementations
 * in this file with actual API calls to a cryptocurrency data provider
 * (e.g., CoinGecko, CoinMarketCap, a paid exchange API, etc.).
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
 * THIS IS A MOCK IMPLEMENTATION. Replace with live API calls.
 * @param symbol The cryptocurrency symbol (e.g., "BTC", "ETH").
 * @returns A Promise resolving to MarketData or null if not found.
 */
export async function fetchRealTimeData(symbol: string): Promise<MarketData | null> {
  console.log(`CryptoDataService: Simulating fetching data for ${symbol}. THIS IS MOCK DATA.`);
  // Replace this with actual API call
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 400)); // Simulate network delay

  const symbolUpper = symbol.toUpperCase();

  // For more stable (but still MOCK) BTC and ETH prices:
  if (symbolUpper === "BTC" || symbolUpper === "BITSTAMP:BTCUSD" || symbolUpper === "BINANCE:BTCUSDT") {
    return {
      symbol: symbolUpper.includes(':') ? symbolUpper : "BTC",
      price: 68500 + (Math.random() - 0.5) * 100, // Base 68.5k, fluctuation +/- $50
      volume24h: 24000000000 + (Math.random() - 0.5) * 1000000000, // Base 24B, fluctuation +/- 0.5B
      priceChange24hPercent: (Math.random() - 0.5) * 1, // Fluctuation +/- 0.5%
    };
  } else if (symbolUpper === "ETH" || symbolUpper === "BITSTAMP:ETHUSD" || symbolUpper === "BINANCE:ETHUSDT") {
    return {
      symbol: symbolUpper.includes(':') ? symbolUpper : "ETH",
      price: 3850 + (Math.random() - 0.5) * 20, // Base 3.85k, fluctuation +/- $10
      volume24h: 14000000000 + (Math.random() - 0.5) * 500000000, // Base 14B, fluctuation +/- 0.25B
      priceChange24hPercent: (Math.random() - 0.5) * 1.5, // Fluctuation +/- 0.75%
    };
  } else if (symbolUpper.includes("SOL")) { // Catching common variations like COINBASE:SOLUSD
     return {
      symbol: symbolUpper,
      price: 165 + (Math.random() - 0.5) * 10, 
      volume24h: 1900000000 + (Math.random() - 0.5) * 200000000,
      priceChange24hPercent: (Math.random() - 0.5) * 5,
    };
  }
  else {
    // Generic mock for other symbols (more noticeable fluctuation)
     return {
      symbol: symbolUpper,
      price: 100 + (Math.random() - 0.5) * 50, 
      volume24h: 100000000 + (Math.random() - 0.5) * 50000000,
      priceChange24hPercent: (Math.random() - 0.5) * 10,
    };
  }
  // To simulate a symbol not found by the API:
  // if (symbolUpper === "UNKNOWN") return null; 
}

/**
 * Fetches data for a market overview (e.g., top N cryptos).
 * THIS IS A MOCK IMPLEMENTATION. Replace with live API calls.
 * @returns A Promise resolving to an array of MarketData.
 */
export async function fetchMarketOverview(): Promise<MarketData[]> {
  console.log("CryptoDataService: Simulating fetching market overview data. THIS IS MOCK DATA.");
  await new Promise(resolve => setTimeout(resolve, 700)); 

  return [
    (await fetchRealTimeData("BTC"))!,
    (await fetchRealTimeData("ETH"))!,
    (await fetchRealTimeData("SOL"))!,
    (await fetchRealTimeData("ADA")) || { symbol: "ADA", price: 0.45, volume24h: 500000000, priceChange24hPercent: -1.0},
  ].filter(Boolean) as MarketData[];
}
