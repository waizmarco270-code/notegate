'use server';

/**
 * @fileOverview An AI-powered writing assistant.
 *
 * - writingAssistant - A function that performs various writing tasks on selected text.
 * - WritingAssistantInput - The input type for the writingAssistant function.
 * - WritingAssistantOutput - The return type for the writingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WritingAssistantInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user.'),
  command: z.string().describe('The writing command to execute (e.g., "Improve Writing", "Make Shorter", "Change Tone to Formal").'),
});
type WritingAssistantInput = z.infer<typeof WritingAssistantInputSchema>;

const WritingAssistantOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content based on the command.'),
});
type WritingAssistantOutput = z.infer<typeof WritingAssistantOutputSchema>;

export async function writingAssistant(input: WritingAssistantInput): Promise<WritingAssistantOutput> {
  return writingAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'writingAssistantPrompt',
  input: {schema: WritingAssistantInputSchema},
  output: {schema: WritingAssistantOutputSchema},
  prompt: `You are an expert writing assistant. A user has selected the following text from their note and wants you to perform a specific action on it.

Selected Text:
"{{{selectedText}}}"

Action to Perform: "{{command}}"

Based on the action, rewrite the selected text and provide the result in the 'generatedContent' field.
- If the command is "Improve Writing", correct any grammatical errors, improve sentence structure, and make the text clearer and more concise.
- If the command is "Fix Spelling & Grammar", only correct spelling and grammatical mistakes.
- If the command is "Make Shorter", summarize the text or make it more concise.
- If the command is "Make Longer", expand on the existing text with more details.
- If the command is about changing the tone (e.g., "Change Tone to Formal", "Change Tone to Casual"), rewrite the text in that specific tone.
- If the command is to "Brainstorm Ideas", treat the selected text as a topic and generate a list of related ideas.

Respond only with the rewritten text. Do not add any introductory phrases like "Here is the improved text:".`,
});

const writingAssistantFlow = ai.defineFlow(
  {
    name: 'writingAssistantFlow',
    inputSchema: WritingAssistantInputSchema,
    outputSchema: WritingAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
