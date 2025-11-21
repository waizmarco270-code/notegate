"use server";

import { summarizeNote, SummarizeNoteInput } from "@/ai/flows/ai-summarize-note";
import { generateTags, GenerateTagsInput } from "@/ai/flows/ai-generate-tags";
import { textToSpeech, TextToSpeechInput } from "@/ai/flows/ai-text-to-speech";
import { translateNote, type TranslateNoteInput, type TranslateNoteOutput } from "@/ai/flows/ai-translate-note";
import { writingAssistant } from "@/ai/flows/ai-writing-assistant";
import { generateTemplate, type GenerateTemplateInput, type GenerateTemplateOutput } from "@/ai/flows/ai-generate-template";
import { z } from "zod";

const summarizeSchema = z.object({
  noteContent: z.string(),
});

export async function summarizeNoteAction(input: SummarizeNoteInput) {
  const parsedInput = summarizeSchema.safeParse(input);
  if (!parsedInput.success) {
    return { error: "Invalid input" };
  }

  try {
    const result = await summarizeNote(parsedInput.data);
    return { summary: result.summary };
  } catch (e) {
    console.error(e);
    return { error: "Failed to summarize note. Please try again." };
  }
}

const generateTagsSchema = z.object({
    noteContent: z.string(),
});

export async function generateTagsAction(input: GenerateTagsInput) {
    const parsedInput = generateTagsSchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: "Invalid input" };
    }

    try {
        const result = await generateTags(parsedInput.data);
        return { tags: result.tags };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate tags. Please try again." };
    }
}

const textToSpeechSchema = z.object({
  text: z.string(),
});

export async function textToSpeechAction(input: TextToSpeechInput) {
    const parsedInput = textToSpeechSchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: "Invalid input" };
    }

    try {
        const result = await textToSpeech(parsedInput.data);
        return { audio: result.audio };
    } catch (e) {
        console.error(e);
        return { error: "Failed to generate audio. Please try again." };
    }
}

const translateNoteSchema = z.object({
  noteContent: z.string(),
  targetLanguage: z.string(),
});

export async function translateNoteAction(input: TranslateNoteInput): Promise<Partial<TranslateNoteOutput> & { error?: string }> {
    const parsedInput = translateNoteSchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: "Invalid input" };
    }

    try {
        const result = await translateNote(parsedInput.data);
        return result;
    } catch (e) {
        console.error(e);
        return { error: "Failed to translate note. Please try again." };
    }
}


const WritingAssistantInputSchema = z.object({
  selectedText: z.string().describe('The text selected by the user.'),
  command: z.string().describe('The writing command to execute (e.g., "Improve Writing", "Make Shorter", "Change Tone to Formal").'),
});
type WritingAssistantInput = z.infer<typeof WritingAssistantInputSchema>;

const WritingAssistantOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated content based on the command.'),
});


export async function writingAssistantAction(input: WritingAssistantInput): Promise<Partial<z.infer<typeof WritingAssistantOutputSchema>> & { error?: string }> {
    const parsedInput = WritingAssistantInputSchema.safeParse(input);
    if (!parsedInput.success) {
        return { error: "Invalid input" };
    }

    try {
        const result = await writingAssistant(parsedInput.data);
        return result;
    } catch (e) {
        console.error(e);
        return { error: "Failed to process writing command. Please try again." };
    }
}
