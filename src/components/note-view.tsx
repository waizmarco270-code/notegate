"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/context/notes-provider";
import { NoteEditor } from "@/components/note-editor";
import { PasswordDialog } from "@/components/password-dialog";
import { SecureNoteLogo } from "./icons";

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
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <SecureNoteLogo className="h-24 w-24 text-primary/20 mb-4" />
        <h2 className="text-2xl font-headline font-bold">Welcome to SecureNote</h2>
        <p className="text-muted-foreground mt-2">
          Select a note from the list to view or edit, or create a new one.
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
    <main className="flex-1 flex flex-col">
      <NoteEditor note={activeNote} />
    </main>
  );
}
