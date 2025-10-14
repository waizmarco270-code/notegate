"use client";

import { NoteCard } from "@/components/note-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Note } from "@/lib/types";

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onSetPassword: (note: Note) => void;
  onSetCategory: (note: Note) => void;
}

export function NoteList({ notes, activeNoteId, onSelectNote, onDeleteNote, onToggleFavorite, onSetPassword, onSetCategory }: NoteListProps) {
  return (
    <ScrollArea className="flex-1 -mx-4">
      <div className="px-4 space-y-1">
        {notes.length > 0 ? (
          notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isActive={note.id === activeNoteId}
              onClick={() => onSelectNote(note.id)}
              onDelete={onDeleteNote}
              onToggleFavorite={onToggleFavorite}
              onSetPassword={onSetPassword}
              onSetCategory={onSetCategory}
            />
          ))
        ) : (
          <div className="text-center text-muted-foreground p-8">
            <p>No notes found.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
