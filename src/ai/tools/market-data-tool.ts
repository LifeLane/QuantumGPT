
/**
 * @fileOverview Genkit tool for fetching cryptocurrency market data.
 * This tool uses the crypto-data-service to fetch data.
 * The service itself is a placeholder and needs to be implemented
 * with a real API for actual live data.
 */

import {ai} from '@/ai/genkit';
import { fetchRealTimeData, type MarketData } from '@/services/crypto-data-service';
import {z} from 'genkit';

export const MarketDataSchema = z.object({
  symbol: z.string().describe('The cryptocurrency symbol.'),
  price: z.number().describe('The current price of the cryptocurrency in USD.'),
  volume24h: z.number().optional().nullable().describe('The 24-hour trading volume in USD. May not be available for all data sources.'),
  priceChange24hPercent: z.number().optional().nullable().describe('The percentage price change in the last 24 hours. May not be available for all data sources.'),
});

export const GetCryptoMarketDataInputSchema = z.object({
  symbol: z.string().describe('The ticker symbol of the cryptocurrency to fetch data for (e.g., BTC, ETH).'),
});
export type GetCryptoMarketDataInput = z.infer<typeof GetCryptoMarketDataInputSchema>;

export const getCryptoMarketDataTool = ai.defineTool(
  {
    name: 'getCryptoMarketData',
    description: 'Fetches the current market data (price, and if available, 24h volume & 24h change) for a specific cryptocurrency symbol. Use this to get up-to-date information before making analyses or suggestions. For Bitcoin (BTC), price is fetched live from CoinDesk BPI; volume and 24h change are not available from this source. For other cryptocurrencies, this tool currently uses simulated data.',
    inputSchema: GetCryptoMarketDataInputSchema,
    outputSchema: MarketDataSchema.nullable(), // It might return null if symbol not found
  },
  async (input: GetCryptoMarketDataInput): Promise<MarketData | null> => {
    console.log(`[MarketDataTool] Called for symbol: ${input.symbol}`);
    const data = await fetchRealTimeData(input.symbol);
    if (data) {
      console.log(`[MarketDataTool] Data for ${input.symbol}:`, data);
      return data;
    }
    console.log(`[MarketDataTool] No data found for ${input.symbol}`);
    return null;
  }
);
