
'use server';
/**
 * @fileOverview Service for fetching cryptocurrency market data.
 * Attempts to use CoinDesk BPI for live Bitcoin data.
 * Falls back to basic mock data for other cryptocurrencies.
 */

export interface MarketData {
  symbol: string;
  price: number;
  volume24h?: number | null; // Made optional as BPI doesn't provide it
  priceChange24hPercent?: number | null; // Made optional as BPI doesn't provide it
}

// Helper to normalize symbols for comparison (e.g., "BINANCE:BTCUSDT" -> "BTC")
function getBaseSymbol(symbol: string): string {
  let normalized = symbol.toUpperCase();
  if (normalized.includes(':')) {
    normalized = normalized.substring(normalized.indexOf(':') + 1);
  }
  const commonPairs = ['USDT', 'USD', 'BUSD', 'DAI', 'USDC', 'EUR', 'GBP']; // Added common fiat pairs
  commonPairs.forEach(pair => {
    if (normalized.endsWith(pair) && normalized.length > pair.length) { // ensure it's not just "USD"
      normalized = normalized.substring(0, normalized.length - pair.length);
    }
  });
  return normalized;
}

/**
 * Fetches real-time market data for a given cryptocurrency symbol.
 * Uses CoinDesk BPI for Bitcoin. Other symbols will use mock data.
 * @param originalSymbol The cryptocurrency symbol (e.g., "BTC", "BINANCE:ETHUSDT").
 * @returns A Promise resolving to MarketData or null if not found/error.
 */
export async function fetchRealTimeData(originalSymbol: string): Promise<MarketData | null> {
  const baseSymbol = getBaseSymbol(originalSymbol);
  const apiKey = process.env.COINDESK_API_KEY; // Stored but not used by public BPI

  if (baseSymbol === "BTC") {
    const url = `https://api.coindesk.com/v1/bpi/currentprice.json`;
    try {
      console.log(`CryptoDataService: Attempting to fetch live BTC data from CoinDesk BPI.`);
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`CryptoDataService: CoinDesk BPI API error (status ${response.status}):`, errorData);
        console.warn(`CryptoDataService: Falling back to mock data for BTC due to API error.`);
        return getMockData(originalSymbol); // Fallback to mock if BPI fails
      }

      const jsonResponse = await response.json();

      if (jsonResponse.bpi && jsonResponse.bpi.USD) {
        return {
          symbol: jsonResponse.chartName || "BTC", // Use chartName or default to BTC
          price: jsonResponse.bpi.USD.rate_float,
          volume24h: null, // CoinDesk BPI does not provide 24h volume
          priceChange24hPercent: null, // CoinDesk BPI does not provide 24h change
        };
      } else {
        console.warn(`CryptoDataService: Unexpected response structure from CoinDesk BPI.`);
        console.warn(`CryptoDataService: Falling back to mock data for BTC.`);
        return getMockData(originalSymbol);
      }
    } catch (error) {
      console.error(`CryptoDataService: Error fetching data from CoinDesk BPI:`, error);
      console.warn(`CryptoDataService: Falling back to mock data for BTC due to fetch error.`);
      return getMockData(originalSymbol);
    }
  } else {
    console.warn(`CryptoDataService: The configured CoinDesk API (BPI) primarily provides Bitcoin data. For ${originalSymbol}, mock data will be used. The API key COINDESK_API_KEY is not used for public BPI access.`);
    return getMockData(originalSymbol);
  }
}

/**
 * Provides basic mock data as a fallback.
 * @param symbol The cryptocurrency symbol.
 * @returns Mock MarketData or null.
 */
function getMockData(symbol: string): MarketData | null {
  const baseSymbol = getBaseSymbol(symbol).toUpperCase();
  console.log(`CryptoDataService: Providing MOCK data for ${symbol} (base: ${baseSymbol}).`);

  if (baseSymbol === "BTC") { // Mock for BTC if BPI fails
    return {
      symbol: symbol.includes(':') ? symbol.toUpperCase() : "BTC",
      price: 68500.12,
      volume24h: 24000000000.34,
      priceChange24hPercent: 0.05,
    };
  } else if (baseSymbol === "ETH") {
    return {
      symbol: symbol.includes(':') ? symbol.toUpperCase() : "ETH",
      price: 3850.56,
      volume24h: 14000000000.78,
      priceChange24hPercent: -0.15,
    };
  } else if (baseSymbol === "SOL") {
     return {
      symbol: symbol.includes(':') ? symbol.toUpperCase() : "SOL",
      price: 165.23,
      volume24h: 1900000000.45,
      priceChange24hPercent: 1.2,
    };
  }
  // Generic mock for other symbols
  return {
    symbol: symbol.toUpperCase(),
    price: 100 + (Math.random() - 0.5) * 50,
    volume24h: 100000000 + (Math.random() - 0.5) * 50000000,
    priceChange24hPercent: (Math.random() - 0.5) * 10,
  };
}

/**
 * Fetches data for a market overview (e.g., top N cryptos).
 * Currently uses fetchRealTimeData for a few predefined symbols.
 * @returns A Promise resolving to an array of MarketData.
 */
export async function fetchMarketOverview(): Promise<MarketData[]> {
  console.log("CryptoDataService: Simulating fetching market overview data using individual real-time calls.");
  const symbols = ["BTC", "ETH", "SOL", "ADA"]; // ADA will use mock data here
  const results = await Promise.all(symbols.map(s => fetchRealTimeData(s)));
  return results.filter(Boolean) as MarketData[];
}
