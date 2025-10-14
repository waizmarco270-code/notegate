"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";
import { PasswordDialog } from "@/components/password-dialog";
import type { Note } from "@/lib/types";
import { ManageCategoriesDialog } from "./manage-categories-dialog";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId, deleteNote, updateNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [passwordNote, setPasswordNote] = useState<Note | null>(null);
  const [categoryNote, setCategoryNote] = useState<Note | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (categoryFilter === "Favorites") {
        return matchesSearch && note.isFavorite;
      }

      const matchesCategory =
        categoryFilter === null || note.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleSelectCategory = (category: string | null) => {
    if (category === "All Notes") {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(category);
    }
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    updateNote({ id, isFavorite });
  };
  
  const handlePasswordSet = (password: string | null) => {
    if (passwordNote) {
      updateNote({ id: passwordNote.id, password });
    }
    setPasswordNote(null);
  };
  
  const handleCategoryUpdate = (category: string | null) => {
    if (categoryNote) {
        updateNote({ id: categoryNote.id, category });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar
          notes={filteredNotes}
          activeNoteId={activeNote?.id ?? null}
          onSelectNote={setActiveNoteId}
          onNewNote={createNote}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSelectCategory={handleSelectCategory}
          activeCategory={categoryFilter}
          onDeleteNote={deleteNote}
          onToggleFavorite={handleToggleFavorite}
          onSetPassword={setPasswordNote}
          onSetCategory={setCategoryNote}
        />
        <main className="flex-1 flex flex-col overflow-auto">
          <NoteView key={activeNote?.id} />
        </main>
      </div>
      {passwordNote && (
        <PasswordDialog
          open={!!passwordNote}
          onOpenChange={(isOpen) => !isOpen && setPasswordNote(null)}
          mode={passwordNote.password ? "update" : "set"}
          onSetPassword={handlePasswordSet}
        />
      )}
      {categoryNote && (
        <ManageCategoriesDialog
            open={!!categoryNote}
            onOpenChange={(isOpen) => !isOpen && setCategoryNote(null)}
            note={categoryNote}
            onUpdateCategory={handleCategoryUpdate}
        />
      )}
    </>
  );
}
