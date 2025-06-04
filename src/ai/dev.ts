import { config } from 'dotenv';
config();

import '@/ai/flows/ai-trading-strategy-suggestion.ts';
import '@/ai/flows/crypto-screener.ts';
import '@/ai/tools/market-data-tool.ts'; // Import the new tool
