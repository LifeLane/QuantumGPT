
// This file is generated by Firebase Genkit.
'use server';

/**
 * @fileOverview AI Trading Strategy Suggestion flow.
 *
 * - suggestTradingStrategy - A function that suggests a trading strategy for a given cryptocurrency.
 * - SuggestTradingStrategyInput - The input type for the suggestTradingStrategy function.
 * - SuggestTradingStrategyOutput - The return type for the suggestTradingStrategy function.
 */

import {ai, geminiPro} from '@/ai/genkit'; // Using geminiPro as default for this flow
import {z} from 'genkit';
import { getCryptoMarketDataTool, type MarketData, MarketDataSchema } from '@/ai/tools/market-data-tool';

const SuggestTradingStrategyInputSchema = z.object({
  cryptocurrency: z.string().describe('The ticker symbol of the cryptocurrency to analyze (e.g., BTC).'),
  userSentiment: z.enum(['bullish', 'bearish']).optional().describe("The user's current market sentiment (bullish, bearish), if provided. If not provided, the AI performs a general analysis based on risk tolerance."),
  riskTolerance: z.enum(['low', 'medium', 'high']).describe("The user's defined risk tolerance level (low, medium, high)."),
});
export type SuggestTradingStrategyInput = z.infer<typeof SuggestTradingStrategyInputSchema>;

const SuggestTradingStrategyOutputSchema = z.object({
  tradePossible: z.boolean().describe('Whether a trade is currently viable based on the analysis. Set to false if no clear opportunity, if data is missing, or if high risk (like rugpull) is suspected.'),
  suggestedPosition: z.enum(['Long', 'Short', 'None']).describe('The suggested trading position (Long, Short). Set to "None" if tradePossible is false.'),
  strategyExplanation: z.string().describe('A detailed analysis explaining the reasoning behind the trade recommendation and the suggested price points. This should consider the current market price, user market sentiment (if provided), risk tolerance, common technical analysis principles (like trends, support/resistance, indicators like MA/RSI/MACD, and chart patterns). If applicable, briefly mention general considerations for futures (e.g., leverage implications based on risk tolerance) or options (e.g., basic call/put ideas) based on the analysis. This explanation should be based on *simulating* chart analysis using ONLY the provided market data points (price, volume, change).'),
  currentPrice: z.number().nullable().describe('The current market price of the cryptocurrency fetched by the tool, or null if unavailable.'),
  entryPoint: z.number().nullable().describe('The recommended entry price for the trade, or null if no trade is recommended or tradePossible is false.'),
  exitPoint: z.number().nullable().describe('The recommended exit price for the trade, or null if no trade is recommended or tradePossible is false.'),
  stopLossLevel: z.number().nullable().describe('The recommended stop loss price for the trade, or null if no trade is recommended or tradePossible is false.'),
  profitTarget: z.number().nullable().describe('The recommended take profit price for the trade, or null if no trade is recommended or tradePossible is false.'),
  confidenceLevel: z.enum(['High', 'Medium', 'Low', 'Very Low - Risk Warning']).optional().describe("The AI's confidence in this strategy. Set to 'Very Low - Risk Warning' if significant risks like potential rugpull indicators are identified."),
  riskWarnings: z.array(z.string()).optional().describe("Specific risk warnings identified by the AI, such as potential rugpull indicators (e.g., extreme unusual price/volume activity without clear cause, suspicious project characteristics based on general knowledge if applicable), high volatility, or poor liquidity signals from the provided data."),
  disclaimer: z.string().describe(
      "QuantumGPT, powered by Blocksmith AI, was developed following extensive research in quantitative finance, market intelligence, and applied machine learning. Our models are built to deliver adaptive trading insights, deep behavioral analytics, and tailored strategies through real-time data analysis and visualization.\n\nWhile QuantumGPT provides cutting-edge analytical tools, it is not a financial advisor. All outputs are for educational and informational purposes only. Trading and investing carry risks, and decisions should be made with careful due diligence and consideration of your financial situation. Blocksmith AI assumes no liability for losses or outcomes related to the use of QuantumGPT."
    ),
});
export type SuggestTradingStrategyOutput = z.infer<typeof SuggestTradingStrategyOutputSchema>;

export async function suggestTradingStrategy(input: SuggestTradingStrategyInput): Promise<SuggestTradingStrategyOutput> {
  return suggestTradingStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTradingStrategyPrompt',
  model: geminiPro,
  input: {schema: z.object({
    cryptocurrency: SuggestTradingStrategyInputSchema.shape.cryptocurrency,
    userSentiment: SuggestTradingStrategyInputSchema.shape.userSentiment, // Will be 'bullish', 'bearish', or undefined
    riskTolerance: SuggestTradingStrategyInputSchema.shape.riskTolerance, // Will be 'low', 'medium', or 'high'
    marketData: MarketDataSchema.nullable().describe("Current market data for the cryptocurrency. This will be fetched by a tool prior to calling you. If this is null, or if price is null, a trading strategy cannot be reliably formed."),
  })},
  output: {schema: SuggestTradingStrategyOutputSchema},
  prompt: `You are an AI-powered trading strategy advisor with expertise in technical chart analysis and risk assessment.
Your goal is to provide a clear, actionable trading strategy for the given cryptocurrency based *solely* on the provided market data points (current price, 24h volume, 24h price change), the user's stated risk tolerance, and their market sentiment (if provided). You DO NOT have access to a live chart image; you must *simulate* chart analysis using only these data points.

Cryptocurrency: {{{cryptocurrency}}}
User Risk Tolerance: {{{riskTolerance}}}
{{#if userSentiment}}
User Market Sentiment: {{{userSentiment}}}
{{else}}
User Market Sentiment: Not specified (perform general analysis based on market data and risk tolerance).
{{/if}}

Current Market Data (from tool):
- Current Price: {{#if marketData.price}}{{marketData.price}}{{else}}not available{{/if}}
- 24h Volume: {{#if marketData.volume24h}}{{marketData.volume24h}}{{else}}not available{{/if}}
- 24h Price Change (%): {{#if marketData.priceChange24hPercent}}{{marketData.priceChange24hPercent}}%{{else}}not available{{/if}}

Your Task:
1.  **Analyze Market Data, User Sentiment & Risk Tolerance**: Based *only* on the provided 'Current Price', '24h Volume', '24h Price Change (%)', 'User Risk Tolerance', and 'User Market Sentiment' (if provided):
    *   Infer the potential current trend (e.g., "Given the positive 24h price change and high volume, the short-term trend appears to be upward.").
    *   Infer potential key support and resistance levels *relative to the current price*.
    *   Hypothesize plausible chart patterns (e.g., "A significant price increase on high volume might suggest a breakout.").
    *   Consider how common technical indicators (like Moving Averages, RSI, MACD) *might behave* given this limited data.
    *   **Crucially, assess for potential "rugpull" or extreme risk indicators**. Based on your general knowledge of scam tactics, consider if the provided data (e.g., extreme price spikes on low volume followed by sharp drops, or very new/unknown coins with sudden massive pumps) suggests manipulation. If such risks are identified, this should heavily influence your strategy.
    *   Your analysis for these points MUST be based on simulating what these indicators/patterns would look like given ONLY the numeric data provided. Do NOT invent data or assume you see a full chart.
    *   **Incorporate User Sentiment (if provided)**: If 'User Market Sentiment' is 'bullish', you might look for stronger confirmation for a long position or be more optimistic about upside targets. If 'bearish', you might be more inclined towards short positions or cautious about longs. If no sentiment is provided, perform a balanced, objective analysis based purely on the technical data presented and the risk tolerance.
    *   **Incorporate User Risk Tolerance**: Adjust your strategy aggressiveness. For 'low' risk, prefer strategies with higher probability of smaller gains, tighter stop-losses, and possibly avoiding highly volatile assets. For 'high' risk, you might suggest more aggressive entry points, wider stop-losses, or consider assets with higher volatility if the technicals align; you might also explore higher leverage for futures more readily (with warnings). 'Medium' risk is a balance.

2.  **Formulate Strategy**: Based on your simulated analysis and risk assessment:
    *   If high risk (e.g., suspected rugpull, extreme unexplained volatility) is detected, OR if market data is insufficient/missing:
        *   Set \`tradePossible\` to \`false\`.
        *   Set \`suggestedPosition\` to "None".
        *   Set \`confidenceLevel\` to "Very Low - Risk Warning".
        *   Populate \`riskWarnings\` with specific reasons (e.g., "Suspected rugpull due to extreme price volatility without clear fundamental backing.", "Insufficient data to form a reliable strategy.").
        *   Set all price points (\`entryPoint\`, \`exitPoint\`, etc.) to \`null\`.
        *   Your \`strategyExplanation\` should clearly state why no trade is advised.
    *   Otherwise, if a trade seems viable:
        *   Set \`tradePossible\` to \`true\`.
        *   Determine a \`suggestedPosition\` ("Long" or "Short") that aligns with your analysis (and user's sentiment if provided, and risk tolerance). If no sentiment, base position on technicals and risk tolerance.
        *   Estimate a \`confidenceLevel\` ("High", "Medium", "Low") for this strategy.
        *   Provide \`entryPoint\`, \`exitPoint\`, \`stopLossLevel\`, and \`profitTarget\`. These price points should reflect the chosen risk tolerance (e.g., tighter stops for low risk).
        *   In your \`strategyExplanation\`, detail your reasoning. Explain how user sentiment (if provided) AND risk tolerance were considered. Also, if the cryptocurrency and market conditions are generally suitable, briefly discuss how this spot idea *could* translate to **futures** (e.g., "For futures traders with a {{{riskTolerance}}} risk tolerance, this long position could be entered. For {{{riskTolerance}}} risk, consider X leverage, being mindful of liquidation risk.") or **options** (e.g., "An options trader with a {{{riskTolerance}}} risk tolerance might consider buying call options with a strike near the entry point if bullish, or puts if bearish, tailoring strike and expiry to their specific risk profile."). These should be general derivative considerations, not specific contract recommendations.

3.  **Output**: Your response MUST be in the JSON format defined by the output schema and include all fields.

Output Field Instructions:
-   **tradePossible**: Boolean. Set to \`false\` if data is missing, high risk is detected, or no clear opportunity.
-   **suggestedPosition**: "Long", "Short", or "None". If \`tradePossible\` is \`false\`, this MUST be "None".
-   **strategyExplanation**: Detailed analysis. Explain how user sentiment (if provided) AND risk tolerance were considered. Include futures/options considerations if applicable. If no trade, explain why.
-   **currentPrice**: The \`marketData.price\` fetched by the tool. If null, this field must be null.
-   **entryPoint, exitPoint, stopLossLevel, profitTarget**: Illustrative. If \`tradePossible\` is \`false\`, these MUST all be \`null\`. Price points should be influenced by risk tolerance.
-   **confidenceLevel**: "High", "Medium", "Low", or "Very Low - Risk Warning".
-   **riskWarnings**: Array of strings for specific warnings. Can be empty.
-   **disclaimer**: Standard financial disclaimer as defined in the output schema. You must use the exact text from the schema description for this field.

Present your response strictly in the JSON format defined by the output schema.
`,
});

const suggestTradingStrategyFlow = ai.defineFlow(
  {
    name: 'suggestTradingStrategyFlow',
    inputSchema: SuggestTradingStrategyInputSchema,
    outputSchema: SuggestTradingStrategyOutputSchema,
  },
  async (input: SuggestTradingStrategyInput): Promise<SuggestTradingStrategyOutput> => {
    let marketData: MarketData | null = null;
    try {
      console.log(`[AIStrategyFlow] Fetching market data for: ${input.cryptocurrency}`);
      marketData = await getCryptoMarketDataTool({symbol: input.cryptocurrency});
      console.log(`[AIStrategyFlow] Market data for ${input.cryptocurrency}:`, marketData);
    } catch (toolError) {
      console.error(`[AIStrategyFlow] Error calling getCryptoMarketDataTool for ${input.cryptocurrency}:`, toolError);
    }

    console.log(`[AIStrategyFlow] Calling prompt with input:`, { ...input, marketData }); 
    const {output} = await prompt({
        ...input, 
        marketData: marketData,
    });
    
    const defaultDisclaimer = "QuantumGPT, powered by Blocksmith AI, was developed following extensive research in quantitative finance, market intelligence, and applied machine learning. Our models are built to deliver adaptive trading insights, deep behavioral analytics, and tailored strategies through real-time data analysis and visualization.\n\nWhile QuantumGPT provides cutting-edge analytical tools, it is not a financial advisor. All outputs are for educational and informational purposes only. Trading and investing carry risks, and decisions should be made with careful due diligence and consideration of your financial situation. Blocksmith AI assumes no liability for losses or outcomes related to the use of QuantumGPT.";

    if (!output) {
        console.error("[AIStrategyFlow] AI model did not return an output. Constructing default error response.");
        return {
            tradePossible: false,
            suggestedPosition: "None",
            strategyExplanation: "The AI model did not return a valid strategy. This could be due to an internal error or inability to process the request. Market data may or may not have been available.",
            currentPrice: marketData?.price ?? null,
            entryPoint: null,
            exitPoint: null,
            stopLossLevel: null,
            profitTarget: null,
            confidenceLevel: "Very Low - Risk Warning",
            riskWarnings: ["AI model processing error."],
            disclaimer: defaultDisclaimer,
        };
    }
    
    console.log(`[AIStrategyFlow] AI Output for ${input.cryptocurrency}:`, output);
    
    const finalOutput = {
        ...output,
        currentPrice: marketData?.price ?? null, 
        confidenceLevel: output.confidenceLevel || (output.tradePossible ? "Medium" : "Very Low - Risk Warning"),
        riskWarnings: output.riskWarnings || [],
        disclaimer: output.disclaimer || defaultDisclaimer, // Ensure disclaimer is always set
    };

    if (!marketData || marketData.price === null || marketData.price === undefined) {
        finalOutput.tradePossible = false;
        finalOutput.suggestedPosition = "None";
        finalOutput.entryPoint = null;
        finalOutput.exitPoint = null;
        finalOutput.stopLossLevel = null;
        finalOutput.profitTarget = null;
        finalOutput.confidenceLevel = "Very Low - Risk Warning";
        if (!finalOutput.riskWarnings.some(w => w.toLowerCase().includes("missing market data"))) {
             finalOutput.riskWarnings.push(`Strategy cannot be determined due to missing or incomplete market data for ${input.cryptocurrency}.`);
        }
        if (!finalOutput.strategyExplanation.toLowerCase().includes("missing market data")) {
             finalOutput.strategyExplanation = `Strategy cannot be determined due to missing or incomplete market data for ${input.cryptocurrency}. ${finalOutput.strategyExplanation}`;
        }
    } else if (!finalOutput.tradePossible) { 
        finalOutput.suggestedPosition = "None";
        finalOutput.entryPoint = null;
        finalOutput.exitPoint = null;
        finalOutput.stopLossLevel = null;
        finalOutput.profitTarget = null;
        finalOutput.confidenceLevel = finalOutput.confidenceLevel || "Very Low - Risk Warning"; 
         if (finalOutput.riskWarnings.length === 0 && finalOutput.confidenceLevel === "Very Low - Risk Warning") {
            finalOutput.riskWarnings.push("AI determined no viable trade based on current data and risk assessment.");
        }
    }
    // Ensure the final disclaimer is always the updated one.
    finalOutput.disclaimer = defaultDisclaimer;

    return finalOutput;
  }
);

