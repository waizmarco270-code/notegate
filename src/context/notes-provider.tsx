"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { Note } from "@/lib/types";
import { initialNotes } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface NotesContextType {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  activeNote: Note | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: () => void;
  updateNote: (note: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  allTags: string[];
  allCategories: string[];
  addCategory: (category: string) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

const PREDEFINED_CATEGORIES = ["Personal", "Work", "Ideas"];

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [userCategories, setUserCategories] = useLocalStorage<string[]>("categories", []);
  
  const activeNote = useMemo(() => {
    const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const currentNote = sortedNotes.find((n) => n.id === activeNoteId);
    
    if (activeNoteId === null && sortedNotes.length > 0) {
      setActiveNoteId(sortedNotes[0].id);
      return sortedNotes[0];
    }
    
    return currentNote ?? (sortedNotes.length > 0 ? sortedNotes[0] : null);
  }, [notes, activeNoteId]);
  
  useEffect(() => {
    if (activeNote && activeNote.id !== activeNoteId) {
      setActiveNoteId(activeNote.id);
    }
     if (!activeNote && notes.length > 0) {
      const sortedNotes = [...notes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setActiveNoteId(sortedNotes[0].id);
    }
  }, [activeNote, activeNoteId, notes]);

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
      isFavorite: false,
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
    const remainingNotes = notes.filter((note) => note.id !== id);
    setNotes(remainingNotes);
    if (activeNoteId === id) {
      if (remainingNotes.length > 0) {
        const sorted = remainingNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        setActiveNoteId(sorted[0].id);
      } else {
        setActiveNoteId(null);
      }
    }
  };
  
  const addCategory = (category: string) => {
    if (!userCategories.includes(category) && !PREDEFINED_CATEGORIES.includes(category)) {
      setUserCategories([...userCategories, category]);
    }
  };

  const allCategories = useMemo(() => [...new Set([...PREDEFINED_CATEGORIES, ...userCategories])], [userCategories]);
  const allTags = useMemo(() => [...new Set(notes.flatMap(note => note.tags))], [notes]);
  
  const value = {
    notes,
    setNotes,
    activeNote,
    setActiveNoteId,
    createNote,
    updateNote,
    deleteNote,
    allTags,
    allCategories,
    addCategory,
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
