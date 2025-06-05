
import {genkit, type ModelReference} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
// import {openai} from '@genkit-ai/openai'; // OpenAI plugin can be added if needed

// Ensure you have GOOGLE_API_KEY set in your environment if not using Application Default Credentials.
// For production, Application Default Credentials (ADC) are recommended.
// Run `gcloud auth application-default login` in your development environment.

export const geminiPro: ModelReference = 'googleai/gemini-1.5-flash-latest'; // Updated to a generally available and capable model
export const geminiFlash = 'googleai/gemini-2.0-flash' as ModelReference<'googleai'>; // Kept for compatibility if specific features used this

export const ai = genkit({
  plugins: [
    googleAI(), // This will use ADC or GOOGLE_API_KEY from env
    // openai() // Example if you were to add OpenAI
  ],
  // Set a default model for generate() calls if not specified.
  // Using gemini-1.5-flash-latest as a robust default.
  model: geminiPro, 
  // Log level can be configured for debugging.
  // logLevel: 'debug', // Uncomment for verbose Genkit logging
  // Enable OpenTelemetry-based flow tracing and monitoring if needed.
  // enableTracing: true,
});

    