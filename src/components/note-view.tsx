"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/context/notes-provider";
import { NoteEditor } from "@/components/note-editor";
import { PasswordDialog } from "@/components/password-dialog";

export function NoteView() {
  const { activeNote } = useNotes();
  const [unlocked, setUnlocked] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);

  useEffect(() => {
    if (activeNote) {
      if (activeNote.password) {
        setShowPasswordDialog(true);
        setUnlocked(false);
      } else {
        setUnlocked(true);
        setShowPasswordDialog(false);
      }
    } else {
      setUnlocked(false);
      setShowPasswordDialog(false);
    }
  }, [activeNote]);

  const handleCorrectPassword = () => {
    setUnlocked(true);
    setShowPasswordDialog(false);
  };

  if (!activeNote) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-secondary/20">
        <h2 className="text-2xl font-bold">Legendary Notes</h2>
        <p className="text-muted-foreground mt-2">
          Select a note to view or create a new one.
        </p>
      </main>
    );
  }

  if (activeNote.password && !unlocked) {
    return (
      <PasswordDialog
        open={showPasswordDialog}
        mode="prompt"
        noteId={activeNote.id}
        correctPassword={activeNote.password}
        onSuccess={handleCorrectPassword}
        onOpenChange={(isOpen) => !isOpen && setShowPasswordDialog(false)}
      />
    );
  }

  return (
    <main className="flex-1 flex flex-col bg-secondary/20">
      <NoteEditor note={activeNote} />
    </main>
  );
}
