
'use server';
/**
 * @fileOverview Service for fetching cryptocurrency market data.
 * Attempts to use CoinDesk (Messari) API for live data.
 * Falls back to basic mock data if API fails or symbol not supported.
 */

export interface MarketData {
  symbol: string;
  price: number;
  volume24h: number;
  priceChange24hPercent: number;
  // Add other fields as needed, e.g., marketCap, high24h, low24h
}

// Helper to normalize symbols for Messari API (e.g., "BINANCE:BTCUSDT" -> "btc")
function normalizeSymbolForMessari(symbol: string): string {
  let normalized = symbol.toLowerCase();
  if (normalized.includes(':')) {
    normalized = normalized.substring(normalized.indexOf(':') + 1);
  }
  const commonPairs = ['usdt', 'usd', 'busd', 'dai', 'usdc'];
  commonPairs.forEach(pair => {
    if (normalized.endsWith(pair)) {
      normalized = normalized.substring(0, normalized.length - pair.length);
    }
  });
  return normalized;
}

/**
 * Fetches real-time market data for a given cryptocurrency symbol.
 * Attempts to use CoinDesk (Messari) API.
 * @param originalSymbol The cryptocurrency symbol (e.g., "BTC", "BINANCE:ETHUSDT").
 * @returns A Promise resolving to MarketData or null if not found/error.
 */
export async function fetchRealTimeData(originalSymbol: string): Promise<MarketData | null> {
  const apiKey = process.env.COINDESK_API_KEY;

  if (!apiKey) {
    console.warn("CryptoDataService: COINDESK_API_KEY is not set. Falling back to mock data for", originalSymbol);
    return getMockData(originalSymbol);
  }

  const messariSymbol = normalizeSymbolForMessari(originalSymbol);
  const url = `https://data.messari.io/api/v1/assets/${messariSymbol}/metrics`;

  try {
    console.log(`CryptoDataService: Attempting to fetch live data for ${originalSymbol} (as ${messariSymbol}) from Messari.`);
    const response = await fetch(url, {
      headers: {
        'x-messari-api-key': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`CryptoDataService: Messari API error for ${messariSymbol} (status ${response.status}):`, errorData);
      console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol} due to API error.`);
      return getMockData(originalSymbol);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.data && jsonResponse.data.market_data) {
      const marketData = jsonResponse.data.market_data;
      const dataSymbol = jsonResponse.data.symbol || originalSymbol.toUpperCase();
      return {
        symbol: dataSymbol,
        price: marketData.price_usd ?? 0,
        volume24h: marketData.volume_last_24_hours ?? 0,
        priceChange24hPercent: marketData.percent_change_usd_last_24_hours ?? 0,
      };
    } else {
      console.warn(`CryptoDataService: Unexpected response structure from Messari for ${messariSymbol}. Data or market_data field missing.`);
      console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol}.`);
      return getMockData(originalSymbol);
    }
  } catch (error) {
    console.error(`CryptoDataService: Error fetching data from Messari for ${messariSymbol}:`, error);
    console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol} due to fetch error.`);
    return getMockData(originalSymbol);
  }
}

/**
 * Provides basic mock data as a fallback.
 * @param symbol The cryptocurrency symbol.
 * @returns Mock MarketData or null.
 */
function getMockData(symbol: string): MarketData | null {
  console.log(`CryptoDataService: Providing MOCK data for ${symbol}.`);
  const symbolUpper = symbol.toUpperCase();
  if (symbolUpper.includes("BTC")) {
    return {
      symbol: symbolUpper.includes(':') ? symbolUpper : "BTC",
      price: 68500.12,
      volume24h: 24000000000.34,
      priceChange24hPercent: 0.05,
    };
  } else if (symbolUpper.includes("ETH")) {
    return {
      symbol: symbolUpper.includes(':') ? symbolUpper : "ETH",
      price: 3850.56,
      volume24h: 14000000000.78,
      priceChange24hPercent: -0.15,
    };
  } else if (symbolUpper.includes("SOL")) {
     return {
      symbol: symbolUpper.includes(':') ? symbolUpper : "SOL",
      price: 165.23,
      volume24h: 1900000000.45,
      priceChange24hPercent: 1.2,
    };
  }
  // Generic mock for other symbols
  return {
    symbol: symbolUpper,
    price: 100 + (Math.random() - 0.5) * 50,
    volume24h: 100000000 + (Math.random() - 0.5) * 50000000,
    priceChange24hPercent: (Math.random() - 0.5) * 10,
  };
  // To simulate a symbol not found by the API:
  // if (symbolUpper === "UNKNOWN") return null;
}


/**
 * Fetches data for a market overview (e.g., top N cryptos).
 * Currently uses fetchRealTimeData for a few predefined symbols.
 * For a production app, this should ideally call a dedicated "top N assets" API endpoint.
 * @returns A Promise resolving to an array of MarketData.
 */
export async function fetchMarketOverview(): Promise<MarketData[]> {
  console.log("CryptoDataService: Simulating fetching market overview data using individual real-time calls.");

  const symbols = ["BTC", "ETH", "SOL", "ADA"];
  const results = await Promise.all(symbols.map(s => fetchRealTimeData(s)));

  return results.filter(Boolean) as MarketData[];
}
