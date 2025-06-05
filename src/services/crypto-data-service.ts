
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
  const apiKey = process.env.COINDESK_API_KEY; // Note: User needs to set this to their Messari API key

  if (!apiKey) {
    console.warn(`CryptoDataService: COINDESK_API_KEY (for Messari) is not set. Falling back to mock data for ${originalSymbol}.`);
    return getMockData(originalSymbol);
  }

  const url = `https://data.messari.io/api/v1/assets/${messariSymbol}/metrics`;
  const headers = {
    'x-messari-api-key': apiKey,
  };

  try {
    console.log(`CryptoDataService: Attempting to fetch live data for ${messariSymbol} (original: ${originalSymbol}) from Messari.`);
    const response = await fetch(url, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CryptoDataService: Messari API error for ${messariSymbol} (status ${response.status}): ${errorText.substring(0, 200)}...`);
      console.warn(`CryptoDataService: Falling back to MOCK data for ${originalSymbol} due to API error from Messari.`);
      return getMockData(originalSymbol);
    }

    const jsonResponse = await response.json();

    if (jsonResponse.data && jsonResponse.data.market_data) {
      const marketData = jsonResponse.data.market_data;
      const fetchedSymbol = jsonResponse.data.symbol || originalSymbol.toUpperCase();
      console.log(`CryptoDataService: Successfully fetched live data for ${fetchedSymbol} from Messari.`);
      return {
        symbol: fetchedSymbol,
        price: marketData.price_usd,
        volume24h: marketData.volume_last_24_hours,
        priceChange24hPercent: marketData.percent_change_usd_last_24_hours,
      };
    } else {
      console.warn(`CryptoDataService: Unexpected response structure from Messari for ${messariSymbol}. Full response (truncated):`, JSON.stringify(jsonResponse, null, 2).substring(0, 500));
      console.warn(`CryptoDataService: Falling back to MOCK data for ${originalSymbol} due to unexpected response structure.`);
      return getMockData(originalSymbol);
    }
  } catch (error) {
    console.error(`CryptoDataService: Network or other error fetching data from Messari for ${messariSymbol}:`, error);
    console.warn(`CryptoDataService: Falling back to MOCK data for ${originalSymbol} due to fetch error.`);
    return getMockData(originalSymbol);
  }
}

/**
 * Provides basic mock data as a fallback.
 * @param originalSymbol The original cryptocurrency symbol input by the user.
 * @returns Mock MarketData or null.
 */
function getMockData(originalSymbol: string): MarketData | null {
  const displaySymbol = originalSymbol.toUpperCase();
  const normalizedForMock = normalizeSymbolForMessari(originalSymbol); // Use the same normalization for mock keys

  console.log(`CryptoDataService: Providing MOCK data for ${displaySymbol} (normalized for mock lookup: ${normalizedForMock}).`);

  if (normalizedForMock === "btc") {
    return {
      symbol: "BTC", // Standardized symbol
      price: 68000 + Math.random() * 1000 - 500,
      volume24h: 24000000000.34,
      priceChange24hPercent: (Math.random() - 0.5) * 2,
    };
  } else if (normalizedForMock === "eth") {
    return {
      symbol: "ETH", // Standardized symbol
      price: 3800 + Math.random() * 100 - 50,
      volume24h: 14000000000.78,
      priceChange24hPercent: (Math.random() - 0.5) * 3,
    };
  } else if (normalizedForMock === "sol") {
     return {
      symbol: "SOL", // Standardized symbol
      price: 160 + Math.random() * 20 - 10,
      volume24h: 1900000000.45,
      priceChange24hPercent: (Math.random() - 0.5) * 5,
    };
  }
  console.warn(`CryptoDataService: No specific mock data for ${normalizedForMock}. Returning generic random mock for ${displaySymbol}.`);
  return {
    symbol: displaySymbol,
    price: 100 + (Math.random() - 0.5) * 50,
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

