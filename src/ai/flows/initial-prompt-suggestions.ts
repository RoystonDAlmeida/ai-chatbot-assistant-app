// src/ai/flows/initial-prompt-suggestions.ts
'use server';

/**
 * @fileOverview Provides initial prompt suggestions for new users.
 *
 * This file exports:
 * - `getInitialPrompts`: A function that returns an array of suggested prompts.
 * - `InitialPromptsOutput`: The type of the output, an array of strings.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InitialPromptsOutputSchema = z.array(z.string());
export type InitialPromptsOutput = z.infer<typeof InitialPromptsOutputSchema>;

export async function getInitialPrompts(): Promise<InitialPromptsOutput> {
  return initialPromptsFlow({});
}

const initialPromptsPrompt = ai.definePrompt({
  name: 'initialPromptsPrompt',
  output: {schema: InitialPromptsOutputSchema},
  prompt: `You are an AI assistant designed to provide helpful prompt suggestions to new users.  Generate a list of diverse prompt ideas that showcase your capabilities.

  Return the prompt ideas as a JSON array of strings.  Each suggestion should be short and represent a common type of request a user might make.

  Examples:
  [
    "Summarize the plot of Hamlet",
    "Write a short poem about autumn",
    "Translate 'Hello, world!' into Spanish",
    "What are the main differences between Javascript and Typescript?"
  ]
  `,
});

const initialPromptsFlow = ai.defineFlow(
  {
    name: 'initialPromptsFlow',
    outputSchema: InitialPromptsOutputSchema,
  },
  async () => {
    const {output} = await initialPromptsPrompt({});
    return output!;
  }
);
