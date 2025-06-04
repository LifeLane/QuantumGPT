import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import {openai} from '@genkit-ai/openai'; // Corrected OpenAI plugin import

export const ai = genkit({
  plugins: [
    googleAI(),
    // openai() // Corrected OpenAI plugin - Temporarily removed due to installation issues
  ],
  model: 'googleai/gemini-2.0-flash', // Default model remains Gemini
});
