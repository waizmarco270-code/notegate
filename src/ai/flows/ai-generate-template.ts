'use server';

/**
 * @fileOverview An AI-powered note template generator.
 *
 * - generateTemplate - A function that creates note content from a user's command.
 * - GenerateTemplateInput - The input type for the generateTemplate function.
 * - GenerateTemplateOutput - The return type for the generateTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTemplateInputSchema = z.object({
  command: z.string().describe('The user command for the template (e.g., "Weekly meeting agenda").'),
  isPromptEngineering: z.boolean().optional().describe('If true, the command is a request to create a prompt for an AI developer.')
});
export type GenerateTemplateInput = z.infer<typeof GenerateTemplateInputSchema>;

const GenerateTemplateOutputSchema = z.object({
  title: z.string().describe('A suitable title for the generated note.'),
  content: z.string().describe('The generated note content in HTML format.'),
});
export type GenerateTemplateOutput = z.infer<typeof GenerateTemplateOutputSchema>;

export async function generateTemplate(input: GenerateTemplateInput): Promise<GenerateTemplateOutput> {
  return generateTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTemplatePrompt',
  input: {schema: GenerateTemplateInputSchema},
  output: {schema: GenerateTemplateOutputSchema},
  prompt: `You are an expert at creating structured note templates. Based on the user's command, generate a suitable title and HTML content for a new note.

{{#if isPromptEngineering}}
The user wants to create a prompt for their AI developer. Their idea is: "{{command}}".
Transform this idea into a detailed, well-structured prompt for an AI that builds web applications. The prompt should be clear, comprehensive, and follow best practices for prompt engineering.
The generated 'title' should be "Prompt for AI Dev: {{command}}".
The 'content' should be the full, detailed prompt, formatted in HTML with headings (h2, h3), paragraphs (p), and lists (ul, li) for clarity.
{{else}}
The user's command is: "{{command}}".
Generate a relevant title and create a useful HTML-formatted note template based on this. Use headings, lists, and bold tags to structure the content. For example, for a "Meeting Agenda", include sections for Attendees, Topics, Action Items, etc.
{{/if}}`,
});

const generateTemplateFlow = ai.defineFlow(
  {
    name: 'generateTemplateFlow',
    inputSchema: GenerateTemplateInputSchema,
    outputSchema: GenerateTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
