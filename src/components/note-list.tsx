"use client";

import { NoteCard } from "@/components/note-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Note } from "@/lib/types";

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
}

export function NoteList({ notes, activeNoteId, onSelectNote }: NoteListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-2 space-y-1">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <p>No notes found.</p>
            <p className="text-xs">Try creating a new note or clearing your search.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
