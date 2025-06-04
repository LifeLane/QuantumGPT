
// This is a server-side file!
'use server';

/**
 * @fileOverview A crypto screener AI agent.
 *
 * - cryptoScreener - A function that handles the crypto screening process.
 * - CryptoScreenerInput - The input type for the cryptoScreener function.
 * - CryptoScreenerOutput - The return type for the cryptoScreener function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getCryptoMarketDataTool } from '@/ai/tools/market-data-tool';

const CryptoScreenerInputSchema = z.object({
  criteria: z
    .string()
    .describe(
      'Specific criteria for screening cryptocurrencies (e.g., cryptocurrencies with strong upward momentum and positive news sentiment).'
    ),
});
export type CryptoScreenerInput = z.infer<typeof CryptoScreenerInputSchema>;

const CryptoScreenerOutputSchema = z.object({
  results: z.array(
    z.object({
      symbol: z.string().describe('The cryptocurrency symbol.'),
      summary: z.string().describe('A concise summary of why the crypto was selected based on the criteria.'),
      price: z.number().optional().describe('The current price of the cryptocurrency, obtained using the market data tool. May be missing if data is unavailable.'),
      volume: z.number().optional().describe('The 24h trading volume of the cryptocurrency, obtained using the market data tool. May be missing if data is unavailable.'),
      recentNews: z.string().describe('A summary of recent news or key developments about the cryptocurrency, relevant to the criteria. This can be based on general knowledge if not directly fetched.'),
    })
  ).describe('A list of cryptocurrencies that match the specified criteria, with current data points obtained via tools where possible.'),
});
export type CryptoScreenerOutput = z.infer<typeof CryptoScreenerOutputSchema>;

export async function cryptoScreener(input: CryptoScreenerInput): Promise<CryptoScreenerOutput> {
  return cryptoScreenerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cryptoScreenerPrompt',
  input: {schema: CryptoScreenerInputSchema},
  output: {schema: CryptoScreenerOutputSchema},
  tools: [getCryptoMarketDataTool],
  prompt: `You are an expert in cryptocurrency analysis.

Screen cryptocurrencies based on the criteria provided by the user.
For each cryptocurrency you identify as potentially matching the criteria, YOU MUST use the 'getCryptoMarketData' tool to fetch its current price and 24-hour volume.
If the tool returns null or fails for a symbol, you can state that live data couldn't be fetched for it but still include it if it strongly matches other criteria, noting the data absence. If data is absent, omit the price and volume fields for that specific cryptocurrency in your JSON response.

Present the results in a structured format. For each cryptocurrency, include:
- its symbol
- a concise summary of why it meets the criteria
- its current price (from the tool, if available)
- its 24h volume (from the tool, if available)
- a brief summary of recent news or developments relevant to the criteria (this can be based on your general knowledge if not directly fetched by a tool).

Criteria: {{{criteria}}}

Ensure that the output is a valid JSON array of objects matching the output schema.
Base your summary and selection on the user's criteria and the data obtained from the tool.
If you identify multiple potential cryptocurrencies, fetch data for each one using the tool.
`,
});

const cryptoScreenerFlow = ai.defineFlow(
  {
    name: 'cryptoScreenerFlow',
    inputSchema: CryptoScreenerInputSchema,
    outputSchema: CryptoScreenerOutputSchema,
    tools: [getCryptoMarketDataTool], // Ensure tool is available to the flow execution
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("The AI model did not return the expected output format for crypto screening.");
    }
    return output;
  }
);
