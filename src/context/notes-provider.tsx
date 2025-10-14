"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { Note } from "@/lib/types";
import { initialNotes } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface NotesContextType {
  notes: Note[];
  activeNote: Note | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: () => void;
  updateNote: (note: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  allTags: string[];
  allCategories: string[];
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, if there are no notes, set them to the initialNotes.
    // This will clear any previously stored notes if the user wants to start fresh.
    const storedNotes = localStorage.getItem("notes");
    if (!storedNotes || JSON.parse(storedNotes).length === 0) {
        setNotes(initialNotes);
    }
  }, [setNotes]);


  const activeNote = useMemo(() => {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const currentNote = sortedNotes.find((n) => n.id === activeNoteId);
    return currentNote ?? (sortedNotes.length > 0 ? sortedNotes[0] : null);
  }, [notes, activeNoteId]);
  
  useEffect(() => {
    if (activeNote) {
      setActiveNoteId(activeNote.id);
    }
  }, [activeNote]);


  const createNote = () => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "New Note",
      content: "",
      category: null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: null,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (updatedFields: Partial<Note> & { id: string }) => {
    setNotes(
      notes.map((note) =>
        note.id === updatedFields.id
          ? { ...note, ...updatedFields, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (activeNoteId === id) {
      const remainingNotes = notes.filter((note) => note.id !== id);
      const sorted = remainingNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setActiveNoteId(sorted.length > 0 ? sorted[0].id : null);
    }
  };

  const allTags = useMemo(() => [...new Set(notes.flatMap(note => note.tags))], [notes]);
  const allCategories = useMemo(() => [...new Set(notes.map(note => note.category).filter(Boolean) as string[])], [notes]);

  const value = {
    notes,
    activeNote,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    allTags,
    allCategories,
  };

  return (
    <NotesContext.Provider value={value}>{children}</NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (context === undefined) {
    throw new Error("useNotes must be used within a NotesProvider");
  }
  return context;
}
