
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import type { Note, NoteVersion } from "@/lib/types";
import { initialNotes } from "@/lib/data";
import { useLocalStorage } from "@/hooks/use-local-storage";

interface NotesContextType {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  activeNote: Note | null;
  setActiveNoteId: (id: string | null) => void;
  createNote: () => void;
  createNoteWithOptions: (options: { title: string; content: string }) => void;
  updateNote: (note: Partial<Note> & { id: string }) => void;
  deleteNote: (id: string) => void;
  allTags: string[];
  allCategories: string[];
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  userCategories: string[];
  importData: (data: { notes: Note[]; categories: string[] }) => void;
  importSharedNote: (note: Note) => void;
  restoreNoteVersion: (noteId: string, version: NoteVersion) => void;
}

const NotesContext = createContext<NotesContextType | undefined>(undefined);

export const PREDEFINED_CATEGORIES = ["Personal", "Work", "Ideas"];
const MAX_HISTORY_LENGTH = 20;


export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", initialNotes);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [userCategories, setUserCategories] = useLocalStorage<string[]>("categories", []);
  
  const activeNote = useMemo(() => {
    const note = notes.find((n) => n.id === activeNoteId);
    if (note && note.isHidden) {
      return null;
    }
    return note ?? null;
  }, [notes, activeNoteId]);
  
  useEffect(() => {
    if (activeNoteId === null && notes.length > 0) {
        const visibleNotes = notes.filter(n => !n.isHidden);
        if (visibleNotes.length > 0) {
            const sortedNotes = [...visibleNotes].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
    }
  }, [activeNoteId, notes]);

  const createNoteWithOptions = (options: { title: string; content: string }) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: options.title,
      content: options.content,
      category: null,
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      password: null,
      isFavorite: false,
      isHidden: false,
      history: [],
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const createNote = () => {
    createNoteWithOptions({ title: "New Note", content: "" });
  };

  const updateNote = (updatedFields: Partial<Note> & { id: string }) => {
    setNotes(currentNotes =>
      currentNotes.map(note => {
        if (note.id === updatedFields.id) {
          const originalNote = { ...note };
  
          // Create a history entry only if title or content is changing
          const shouldCreateHistory = 
            ('title' in updatedFields && updatedFields.title !== originalNote.title) ||
            ('content' in updatedFields && updatedFields.content !== originalNote.content);

          let newHistory = originalNote.history || [];

          if (shouldCreateHistory) {
             const historyEntry: NoteVersion = {
              title: originalNote.title,
              content: originalNote.content,
              updatedAt: originalNote.updatedAt,
            };
            newHistory = [historyEntry, ...newHistory].slice(0, MAX_HISTORY_LENGTH);
          }

          const newNote = {
            ...originalNote,
            ...updatedFields,
            updatedAt: new Date().toISOString(),
            history: newHistory,
          };
          
          if (newNote.isHidden && activeNoteId === newNote.id) {
            setActiveNoteId(null);
          }

          return newNote;
        }
        return note;
      })
    );
  };

  const deleteNote = (id: string) => {
    const remainingNotes = notes.filter((note) => note.id !== id);
    setNotes(remainingNotes);
    if (activeNoteId === id) {
      const visibleNotes = remainingNotes.filter(n => !n.isHidden);
      if (visibleNotes.length > 0) {
        const sorted = visibleNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
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

  const deleteCategory = (categoryToDelete: string) => {
    if (!PREDEFINED_CATEGORIES.includes(categoryToDelete)) {
      setUserCategories(userCategories.filter(c => c !== categoryToDelete));
      setNotes(notes.map(note => 
        note.category === categoryToDelete ? { ...note, category: null } : note
      ));
    }
  };
  
  const restoreNoteVersion = (noteId: string, version: NoteVersion) => {
    updateNote({
      id: noteId,
      title: version.title,
      content: version.content
    });
  };

  const importData = (data: { notes: Note[]; categories: string[] }) => {
    setNotes(data.notes.map(n => ({ ...n, history: n.history || [], isHidden: n.isHidden || false })));
    setUserCategories(data.categories);
    // After importing, set active note to the most recently updated one
    const visibleNotes = data.notes.filter(n => !n.isHidden);
    if (visibleNotes.length > 0) {
      const sorted = visibleNotes.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      setActiveNoteId(sorted[0].id);
    } else {
      setActiveNoteId(null);
    }
  }

  const importSharedNote = (sharedNote: Note) => {
    // Prevent duplicates
    const noteExists = notes.some(note => note.id === sharedNote.id);
    if (!noteExists) {
        const newNote: Note = {
            ...sharedNote,
            category: null,
            isFavorite: false,
            isHidden: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [],
        };
        setNotes([newNote, ...notes]);
        setActiveNoteId(newNote.id);
    } else {
        setActiveNoteId(sharedNote.id);
    }
  };


  const allCategories = useMemo(() => [...new Set([...PREDEFINED_CATEGORIES, ...userCategories])], [userCategories]);
  const allTags = useMemo(() => [...new Set(notes.flatMap(note => note.tags || []))], [notes]);
  
  const value = {
    notes,
    setNotes,
    activeNote,
    setActiveNoteId,
    createNote,
    createNoteWithOptions,
    updateNote,
    deleteNote,
    allTags,
    allCategories,
    addCategory,
    deleteCategory,
    userCategories,
    importData,
    importSharedNote,
    restoreNoteVersion,
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
