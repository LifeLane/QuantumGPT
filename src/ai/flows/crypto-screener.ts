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
      summary: z.string().describe('A concise summary of why the crypto was selected.'),
      price: z.number().describe('The current price of the cryptocurrency.'),
      volume: z.number().describe('The 24h trading volume of the cryptocurrency.'),
      recentNews: z.string().describe('The latest news about the cryptocurrency.'),
    })
  ).describe('A list of cryptocurrencies that match the specified criteria.'),
});
export type CryptoScreenerOutput = z.infer<typeof CryptoScreenerOutputSchema>;

export async function cryptoScreener(input: CryptoScreenerInput): Promise<CryptoScreenerOutput> {
  return cryptoScreenerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cryptoScreenerPrompt',
  input: {schema: CryptoScreenerInputSchema},
  output: {schema: CryptoScreenerOutputSchema},
  prompt: `You are an expert in cryptocurrency analysis.

You will screen cryptocurrencies based on the criteria provided by the user.

Present the results in a structured format that includes the crypto symbol, a concise summary of why it was selected, and key metrics like price, volume, and recent news.

Criteria: {{{criteria}}}

Ensure that the output is a valid JSON array of objects matching the output schema.`, // Addressed output format requirement.
});

const cryptoScreenerFlow = ai.defineFlow(
  {
    name: 'cryptoScreenerFlow',
    inputSchema: CryptoScreenerInputSchema,
    outputSchema: CryptoScreenerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
