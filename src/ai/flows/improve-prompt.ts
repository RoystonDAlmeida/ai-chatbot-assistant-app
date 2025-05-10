'use server';

/**
 * @fileOverview A flow that suggests improvements to user prompts.
 *
 * - improvePrompt - A function that suggests improvements to the prompt.
 * - ImprovePromptInput - The input type for the improvePrompt function.
 * - ImprovePromptOutput - The return type for the improvePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePromptInputSchema = z.object({
  prompt: z.string().describe('The prompt to be improved.'),
});
export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  improvedPrompt: z.string().describe('The improved prompt suggestion.'),
  explanation: z.string().describe('Explanation of why the prompt was improved.'),
});
export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(input: ImprovePromptInput): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const improvePromptPrompt = ai.definePrompt({
  name: 'improvePromptPrompt',
  input: {schema: ImprovePromptInputSchema},
  output: {schema: ImprovePromptOutputSchema},
  prompt: `You are an AI prompt improvement assistant. Review the prompt provided and suggest an improved version of the prompt, along with a detailed explanation of why you made the changes. The goal is to make the prompt more clear, specific, and effective at eliciting the desired response from an AI model.

Original Prompt: {{{prompt}}}`,
});

const improvePromptFlow = ai.defineFlow(
  {
    name: 'improvePromptFlow',
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async input => {
    const {output} = await improvePromptPrompt(input);
    return output!;
  }
);
