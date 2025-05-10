'use server';
/**
 * @fileOverview A Genkit flow for transcribing audio to text.
 *
 * - transcribeAudio - A function that handles audio transcription.
 * - TranscribeAudioInput - The input type for the transcribeAudio function.
 * - TranscribeAudioOutput - The return type for the transcribeAudio function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the transcription flow
const TranscribeAudioInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "Audio data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:audio/<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeAudioInput = z.infer<typeof TranscribeAudioInputSchema>;

// Define the output schema for the transcription flow
const TranscribeAudioOutputSchema = z.object({
  transcription: z.string().describe('The transcribed text from the audio.'),
});
export type TranscribeAudioOutput = z.infer<typeof TranscribeAudioOutputSchema>;

// Exported function to be called by server actions
export async function transcribeAudio(input: TranscribeAudioInput): Promise<TranscribeAudioOutput> {
  return transcribeAudioGenkitFlow(input);
}

// Define the Genkit prompt for transcription
const transcribeAudioPrompt = ai.definePrompt({
  name: 'transcribeAudioPrompt',
  input: {schema: TranscribeAudioInputSchema},
  output: {schema: TranscribeAudioOutputSchema},
  prompt: `Please transcribe the audio provided accurately.
{{media url=audioDataUri}}
Return only the transcribed text, without any additional commentary, conversational phrases, or any preamble.`,
  // If the default model struggles, you might specify one known for audio:
  // model: 'googleai/gemini-1.5-flash-latest', // Example
   config: { // Loosen safety settings if transcription of normal speech is being blocked.
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
    ],
  },
});


// Define the Genkit flow
const transcribeAudioGenkitFlow = ai.defineFlow(
  {
    name: 'transcribeAudioGenkitFlow',
    inputSchema: TranscribeAudioInputSchema,
    outputSchema: TranscribeAudioOutputSchema,
  },
  async (input) => {
    const {output} = await transcribeAudioPrompt(input);

    if (!output || typeof output.transcription !== 'string') {
      console.error('Invalid output from transcribeAudioPrompt:', output);
      // Provide a default empty transcription or throw an error
      return { transcription: "" };
    }
    return output;
  }
);
