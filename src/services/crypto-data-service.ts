
'use server';
/**
 * @fileOverview Service for fetching cryptocurrency market data.
 * Attempts to use Messari API for live data.
 * Falls back to basic mock data for common cryptocurrencies if Messari API fails.
 */

export interface MarketData {
  symbol: string; // The symbol as returned by the API or normalized input
  price: number;
  volume24h?: number | null;
  priceChange24hPercent?: number | null;
}

// Helper to normalize symbols for Messari (e.g., "BINANCE:BTCUSDT" -> "btc")
function normalizeSymbolForMessari(symbol: string): string {
  let normalized = symbol.toLowerCase();
  if (normalized.includes(':')) {
    normalized = normalized.substring(normalized.indexOf(':') + 1);
  }
  // Remove common pairing symbols if they exist at the end
  const commonPairs = ['usdt', 'usd', 'busd', 'dai', 'usdc', 'eur', 'gbp'];
  for (const pair of commonPairs) {
    if (normalized.endsWith(pair) && normalized.length > pair.length) {
      normalized = normalized.substring(0, normalized.length - pair.length);
      break; 
    }
  }
  return normalized;
}

/**
 * Fetches real-time market data for a given cryptocurrency symbol using Messari API.
 * @param originalSymbol The cryptocurrency symbol (e.g., "BTC", "BINANCE:ETHUSDT").
 * @returns A Promise resolving to MarketData or null if not found/error.
 */
export async function fetchRealTimeData(originalSymbol: string): Promise<MarketData | null> {
  const messariSymbol = normalizeSymbolForMessari(originalSymbol);
  const apiKey = process.env.COINDESK_API_KEY;

  if (!apiKey) {
    console.warn(`CryptoDataService: COINDESK_API_KEY is not set. Falling back to mock data for ${originalSymbol}.`);
    return getMockData(originalSymbol, messariSymbol);
  }

  const url = `https://data.messari.io/api/v1/assets/${messariSymbol}/metrics`;
  const headers = {
    'x-messari-api-key': apiKey,
  };

  try {
    console.log(`CryptoDataService: Attempting to fetch live data for ${messariSymbol} (original: ${originalSymbol}) from Messari.`);
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error(`CryptoDataService: Messari API error for ${messariSymbol} (status ${response.status}):`, errorData.slice(0, 500)); // Log snippet of error
      console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol} due to API error.`);
      return getMockData(originalSymbol, messariSymbol);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.data && jsonResponse.data.market_data) {
      const marketData = jsonResponse.data.market_data;
      return {
        symbol: jsonResponse.data.symbol || originalSymbol.toUpperCase(), // Use symbol from API or fallback to original
        price: marketData.price_usd,
        volume24h: marketData.volume_last_24_hours,
        priceChange24hPercent: marketData.percent_change_usd_last_24_hours,
      };
    } else {
      console.warn(`CryptoDataService: Unexpected response structure from Messari for ${messariSymbol}. Full response:`, JSON.stringify(jsonResponse, null, 2).slice(0, 1000));
      console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol}.`);
      return getMockData(originalSymbol, messariSymbol);
    }
  } catch (error) {
    console.error(`CryptoDataService: Error fetching data from Messari for ${messariSymbol}:`, error);
    console.warn(`CryptoDataService: Falling back to mock data for ${originalSymbol} due to fetch error.`);
    return getMockData(originalSymbol, messariSymbol);
  }
}

/**
 * Provides basic mock data as a fallback.
 * @param originalSymbol The original cryptocurrency symbol input by the user.
 * @param normalizedSymbol The symbol normalized for API calls (e.g., "btc", "eth").
 * @returns Mock MarketData or null.
 */
function getMockData(originalSymbol: string, normalizedSymbol: string): MarketData | null {
  const displaySymbol = originalSymbol.includes(':') ? originalSymbol.toUpperCase() : normalizedSymbol.toUpperCase();
  console.log(`CryptoDataService: Providing MOCK data for ${originalSymbol} (normalized: ${normalizedSymbol}).`);

  if (normalizedSymbol === "btc") {
    return {
      symbol: displaySymbol,
      price: 68000 + Math.random() * 1000 - 500, // More stable mock
      volume24h: 24000000000.34,
      priceChange24hPercent: (Math.random() - 0.5) * 2, // Smaller fluctuation
    };
  } else if (normalizedSymbol === "eth") {
    return {
      symbol: displaySymbol,
      price: 3800 + Math.random() * 100 - 50, // More stable mock
      volume24h: 14000000000.78,
      priceChange24hPercent: (Math.random() - 0.5) * 3, // Smaller fluctuation
    };
  } else if (normalizedSymbol === "sol") {
     return {
      symbol: displaySymbol,
      price: 160 + Math.random() * 20 - 10,
      volume24h: 1900000000.45,
      priceChange24hPercent: (Math.random() - 0.5) * 5,
    };
  }
  // Generic mock for other symbols if specifically requested or as a deep fallback
  console.warn(`CryptoDataService: No specific mock data for ${normalizedSymbol}. Returning generic random mock.`);
  return {
    symbol: displaySymbol,
    price: 100 + (Math.random() - 0.5) * 50, // Wider random range
    volume24h: 100000000 + (Math.random() - 0.5) * 50000000,
    priceChange24hPercent: (Math.random() - 0.5) * 10,
  };
}

/**
 * Fetches data for a market overview (e.g., top N cryptos).
 * Currently uses fetchRealTimeData for a few predefined symbols.
 * For a production app, you'd typically use a dedicated "list top assets" endpoint.
 * @returns A Promise resolving to an array of MarketData.
 */
export async function fetchMarketOverview(): Promise<MarketData[]> {
  console.log("CryptoDataService: Attempting to fetch market overview data using individual real-time calls via Messari.");
  const symbols = ["BTC", "ETH", "SOL", "ADA"]; // Example symbols
  const results = await Promise.all(symbols.map(s => fetchRealTimeData(s)));
  return results.filter(Boolean) as MarketData[];
}
