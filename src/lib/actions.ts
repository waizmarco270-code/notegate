"use server";

import { summarizeNote, SummarizeNoteInput } from "@/ai/flows/ai-summarize-note";
import { z } from "zod";

const inputSchema = z.object({
  noteContent: z.string(),
});

export async function summarizeNoteAction(input: { noteContent: string }) {
  const parsedInput = inputSchema.safeParse(input);
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
