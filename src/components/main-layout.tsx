"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";
import { Separator } from "@/components/ui/separator";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<{ type: 'tag' | 'category', value: string } | null>(null);

  const filteredNotes = notes
    .filter((note) => {
      if (!filter) return true;
      if (filter.type === 'tag') return note.tags.includes(filter.value);
      if (filter.type === 'category') return note.category === filter.value;
      return true;
    })
    .filter((note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar
        notes={filteredNotes}
        activeNoteId={activeNote?.id ?? null}
        onSelectNote={setActiveNoteId}
        onNewNote={createNote}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onFilterChange={setFilter}
        currentFilter={filter}
      />
      <Separator orientation="vertical" />
      <NoteView key={activeNote?.id} />
    </div>
  );
}
