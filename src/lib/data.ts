import type { Note } from "./types";

export const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "Untitled Note",
    content: "This is a note.",
    category: "Personal",
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    password: null,
  },
  {
    id: "note-2",
    title: "Meeting Notes",
    content: "Team meeting discussion points.",
    category: "Work",
    tags: ["meeting", "work"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    password: "123",
  },
];
