"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotes = notes
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
      />
      <main className="flex-1 flex flex-col bg-secondary/20 overflow-auto p-4 sm:p-6 md:p-8">
        <NoteView key={activeNote?.id} />
      </main>
    </div>
  );
}
