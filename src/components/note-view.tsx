"use client";

import { useState, useEffect } from "react";
import { useNotes } from "@/context/notes-provider";
import { NoteEditor } from "@/components/note-editor";
import { PasswordDialog } from "@/components/password-dialog";
import { Lock, FileText } from "lucide-react";

export function NoteView() {
  const { activeNote, setActiveNoteId } = useNotes();
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
  
  const handleDialogClose = (isOpen: boolean) => {
    if (!isOpen && !unlocked) {
        setActiveNoteId(null);
    }
    setShowPasswordDialog(isOpen);
  }

  if (!activeNote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 h-full">
        <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center">
           <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold">Welcome to NotesGate</h2>
          <p className="text-muted-foreground mt-2">
            Select a note to view or create a new one to get started.
          </p>
        </div>
      </div>
    );
  }

  if (activeNote.password && !unlocked) {
    return (
        <div className="flex-1 flex items-center justify-center p-8">
            <PasswordDialog
                open={showPasswordDialog}
                mode="prompt"
                noteId={activeNote.id}
                correctPassword={activeNote.password}
                onSuccess={handleCorrectPassword}
                onOpenChange={handleDialogClose}
            />
             <div className="flex flex-col items-center justify-center text-center p-8 h-full">
                <div className="bg-card p-8 rounded-lg shadow-sm border flex flex-col items-center">
                    <Lock className="h-8 w-8 text-muted-foreground mb-4"/>
                    <h2 className="text-xl font-bold">Note Locked</h2>
                    <p className="text-muted-foreground mt-2">
                        Enter the password to view this note.
                    </p>
                </div>
            </div>
        </div>
    );
  }

  return <NoteEditor note={activeNote} />;
}
