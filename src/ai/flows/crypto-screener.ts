
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
      price: z.number().optional().describe('The current price of the cryptocurrency, as reported by the market data tool. Omitted if the tool could not fetch data or data was unavailable.'),
      volume: z.number().optional().describe('The 24h trading volume of the cryptocurrency, as reported by the market data tool. Omitted if the tool could not fetch data or data was unavailable.'),
      recentNews: z.string().describe('A summary of recent news or key developments about the cryptocurrency, relevant to the criteria. This can be based on general knowledge if not directly fetched.'),
    })
  ).describe('A list of cryptocurrencies that match the specified criteria. Price and volume are obtained via the market data tool.'),
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
For each cryptocurrency you identify as potentially matching the criteria, YOU MUST use the 'getCryptoMarketData' tool to fetch its current market data (price and 24-hour volume).

Your response for 'price' and 'volume' for each crypto MUST be the exact values returned by this tool. Do not invent or modify these values.
If the tool returns null or fails for a symbol (meaning data is unavailable from the tool), state this clearly in your summary for that crypto and omit the 'price' and 'volume' fields in the JSON output for that specific cryptocurrency.

Present the results in a structured format. For each cryptocurrency, include:
- its symbol
- a concise summary of why it meets the criteria
- its current price (MUST be from the tool; if unavailable from tool, omit this field)
- its 24h volume (MUST be from the tool; if unavailable from tool, omit this field)
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

