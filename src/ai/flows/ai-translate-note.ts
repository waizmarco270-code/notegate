
'use server';

/**
 * @fileOverview An AI-powered note translation tool.
 *
 * - translateNote - A function that translates a note's HTML content.
 * - TranslateNoteInput - The input type for the translateNote function.
 * - TranslateNoteOutput - The return type for the translateNote function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateNoteInputSchema = z.object({
  noteContent: z.string().describe('The HTML content of the note to translate.'),
  targetLanguage: z.string().describe('The language to translate the note content into (e.g., "Spanish", "Hindi", "Hinglish").'),
});
export type TranslateNoteInput = z.infer<typeof TranslateNoteInputSchema>;

const TranslateNoteOutputSchema = z.object({
  translatedContent: z.string().describe('The translated HTML content, with original HTML tags and structure preserved.'),
  transliteration: z.string().optional().describe('If the translated text is in a non-Latin script, provide its Roman alphabet transliteration. For example, for Japanese "こんにちは世界", provide "Konnichiwa Sekai".'),
});
export type TranslateNoteOutput = z.infer<typeof TranslateNoteOutputSchema>;

export async function translateNote(input: TranslateNoteInput): Promise<TranslateNoteOutput> {
  return translateNoteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateNotePrompt',
  input: {schema: TranslateNoteInputSchema},
  output: {schema: TranslateNoteOutputSchema},
  prompt: `Translate the following HTML content to {{targetLanguage}}.

IMPORTANT:
- You MUST preserve the HTML structure and all HTML tags (e.g., <div>, <h1>, <p>, <b>, <ul>, <li>, <img>).
- Only translate the text content within the HTML tags.
- Do not add or remove any HTML tags.
- For <img> tags, do not translate the 'src' attribute.
- If the targetLanguage is "Hinglish", you must translate it to the Hindi language but write it using the Roman (English) alphabet. For example, "What is your name?" becomes "Aapka naam kya hai?".
- If the translated text is in a non-Latin script (like Japanese, Hindi, Arabic, Russian, etc.), you MUST also provide a transliteration of the translated text in the Roman (English) alphabet in the 'transliteration' field. For example, if you translate to Japanese "こんにちは世界", the transliteration should be "Konnichiwa Sekai".
- Your final output must be a valid HTML string for 'translatedContent'.

HTML Content to Translate:
{{{noteContent}}}`,
});

const translateNoteFlow = ai.defineFlow(
  {
    name: 'translateNoteFlow',
    inputSchema: TranslateNoteInputSchema,
    outputSchema: TranslateNoteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
