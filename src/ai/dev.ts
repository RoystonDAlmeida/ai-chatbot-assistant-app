// dev.ts - Conventional filename, which is an entry point for Genkit development server on running npm run dev:start
// Loads environment variables from .env and imports all flows to be available to Genkit UI

import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/improve-prompt.ts';
import '@/ai/flows/initial-prompt-suggestions.ts';
import '@/ai/flows/general-chat.ts';
import '@/ai/flows/transcribe-audio-flow.ts';