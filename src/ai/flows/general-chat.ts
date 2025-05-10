'use server';
/**
 * @fileOverview A general chat flow for responding to user messages, potentially with attachments.
 *
 * - generalChatFlow - A function that handles general chat interactions.
 * - GeneralChatInput - The input type for the generalChatFlow function.
 * - GeneralChatOutput - The return type for the generalChatFlow function.
 */
import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralChatInputSchema = z.object({
  message: z.string().describe('The user message to respond to. Can be empty if an attachment is the primary content.'),
  conversationHistory: z.string().optional().describe('The chat history to maintain context. Each turn is on a new line, formatted as "User: message" or "AI: message".'),
  imageDataUri: z.string().optional().describe("An optional image attachment as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/...;base64,<encoded_data>'."),
  attachmentInfo: z.object({
    name: z.string().describe("The name of the attached file."),
    type: z.string().describe("The MIME type of the attached file.")
  }).optional().describe("Information about an attachment. This is provided even for images if imageDataUri is also present.")
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  response: z.string().describe('The AI response to the user message.'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChatFlow(input: GeneralChatInput): Promise<GeneralChatOutput> {
  return generalChatGenkitFlow(input);
}

const generalChatPrompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  output: {schema: GeneralChatOutputSchema},
  prompt: `You are a helpful AI assistant. Your task is to directly answer the user's current message.
{{#if conversationHistory}}
Relevant conversation history:
{{{conversationHistory}}}
{{/if}}
{{#if imageDataUri}}
The user has attached the following image (filename: {{attachmentInfo.name}}, type: {{attachmentInfo.type}}):
{{media url=imageDataUri}}
{{else if attachmentInfo}}
The user has attached a file named "{{attachmentInfo.name}}" of type "{{attachmentInfo.type}}". Consider this file in your response if relevant. Its content is not directly viewable here if it's not an image.
{{/if}}

User's current message: "{{{message}}}"

Provide a direct and informative answer to the user's current message. Do NOT include phrases like "I've processed your message", "How may I assist you further?", or any other meta-commentary about your processing. Focus solely on answering the request. If a file/image is attached, acknowledge it and incorporate its context if relevant and possible. If the user's message is empty but there is an attachment, focus your response on the attachment.`,
});

const generalChatGenkitFlow = ai.defineFlow(
  {
    name: 'generalChatGenkitFlow', 
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    const {output} = await generalChatPrompt(input);
    if (!output || typeof output.response !== 'string') {
      console.error('Invalid output from generalChatPrompt:', output);
      return { response: "I'm having trouble formulating a response right now. Please try asking again." };
    }
    return output;
  }
);
