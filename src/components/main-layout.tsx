"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

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

  if (!isClient) {
    return null;
  }

  return (
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
      />
      <main className="flex-1 flex flex-col overflow-auto">
        <NoteView key={activeNote?.id} />
      </main>
    </div>
  );
}
