"use server";

import { summarizeNote, SummarizeNoteInput } from "@/ai/flows/ai-summarize-note";
import { generateTags, GenerateTagsInput } from "@/ai/flows/ai-generate-tags";
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
