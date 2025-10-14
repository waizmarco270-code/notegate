"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory =
        categoryFilter === null || note.category === categoryFilter;

      if (categoryFilter === "Favorites") {
        // Placeholder for favorites logic
        return matchesSearch;
      }
      
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
      <main className="flex-1 flex flex-col bg-secondary/20 overflow-auto">
        <NoteView key={activeNote?.id} />
      </main>
    </div>
  );
}
