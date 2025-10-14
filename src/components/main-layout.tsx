"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";
import { initialNotes } from "@/lib/data";

export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId, setNotes } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // This effect runs only on the client, after hydration.
    // It clears any existing notes from local storage and sets the initial empty array.
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes && JSON.parse(storedNotes).length > 0) {
      setNotes(initialNotes);
      // Also reset the active note ID to avoid showing a deleted note
      setActiveNoteId(null);
    }
  }, [setNotes, setActiveNoteId]);


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
      <div className="flex-1 flex flex-col">
        <NoteView key={activeNote?.id} />
      </div>
    </div>
  );
}
