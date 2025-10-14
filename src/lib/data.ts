import type { Note } from "./types";

export const initialNotes: Note[] = [
  {
    id: "note-1",
    title: "Project Ideas",
    content: "Brainstorming session for the new quarter. \n1. Develop a mobile-first notes app. \n2. Create an AI-powered code review tool. \n3. Build a personal finance tracker with budgeting features.",
    category: "Work",
    tags: ["brainstorming", "ideas"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    password: null,
  },
  {
    id: "note-2",
    title: "Grocery List",
    content: "- Milk\n- Bread\n- Eggs\n- Cheese\n- Apples\n- Chicken breast",
    category: "Personal",
    tags: ["shopping"],
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    password: null,
  },
  {
    id: "note-3",
    title: "Secret Project Info",
    content: "This note contains highly sensitive information about project 'Phoenix'. Access is restricted.",
    category: "Work",
    tags: ["secret", "project-phoenix"],
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    password: "password123", // Simple password for demo purposes
  },
  {
    id: "note-4",
    title: "Meeting Notes 2024-07-20",
    content: "Discussion about Q3 roadmap. Key takeaways:\n- Focus on user retention features.\n- Marketing to launch a new campaign in August.\n- Engineering to prioritize performance improvements.",
    category: "Work",
    tags: ["meeting", "roadmap"],
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    password: null,
  },
];
