
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import { NoteList } from "./note-list";
import { NoteView } from "./note-view";

interface HiddenVaultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HiddenVault({ open, onOpenChange }: HiddenVaultProps) {
  const [vaultPassword, setVaultPassword] = useLocalStorage<string | null>("vault-password", null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isSettingPassword, setIsSettingPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const { notes, activeNote, setActiveNoteId, deleteNote, updateNote } = useNotes();
  const hiddenNotes = notes.filter(note => note.isHidden);

  useEffect(() => {
    if (open && vaultPassword === null) {
      setIsSettingPassword(true);
    } else {
      setIsSettingPassword(false);
    }
  }, [open, vaultPassword]);

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setIsUnlocked(false);
      setPasswordInput("");
      setConfirmPasswordInput("");
      setError("");
      setActiveNoteId(null);
    }
  }, [open, setActiveNoteId]);

  const handleSetPassword = () => {
    if (!passwordInput) {
      setError("Password cannot be empty.");
      return;
    }
    if (passwordInput !== confirmPasswordInput) {
      setError("Passwords do not match.");
      return;
    }
    setVaultPassword(passwordInput);
    setIsSettingPassword(false);
    setIsUnlocked(true);
    toast({ title: "Hidden Vault password set!", description: "Your vault is now secure." });
  };

  const handleUnlock = () => {
    if (passwordInput === vaultPassword) {
      setIsUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password.");
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSettingPassword) {
      handleSetPassword();
    } else {
      handleUnlock();
    }
  };

  const handleUnhideNote = (id: string) => {
    updateNote({ id, isHidden: false });
  };

  const handleSelectNote = (id: string) => {
    // Inside vault, all notes are accessible
    const note = notes.find(n => n.id === id);
    if (note) {
      setActiveNoteId(note.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        {!isUnlocked ? (
          <div className="flex flex-col items-center justify-center h-full p-6">
            <ShieldCheck className="h-16 w-16 text-primary mb-4" />
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold">
                {isSettingPassword ? "Set Vault Password" : "Hidden Vault"}
              </DialogTitle>
              <DialogDescription>
                {isSettingPassword
                  ? "Create a master password for your secure vault."
                  : "Enter the master password to access your hidden notes."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="w-full max-w-sm mt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="vault-password">Password</Label>
                  <Input
                    id="vault-password"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    autoFocus
                  />
                </div>
                {isSettingPassword && (
                  <div className="grid gap-2">
                    <Label htmlFor="vault-confirm-password">Confirm Password</Label>
                    <Input
                      id="vault-confirm-password"
                      type="password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                    />
                  </div>
                )}
                {error && <p className="text-sm text-center text-destructive">{error}</p>}
              </div>
              <DialogFooter className="mt-6">
                <Button type="submit" className="w-full">
                  {isSettingPassword ? "Set Password & Enter" : "Unlock"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : (
          <div className="flex h-full">
            <aside className="w-80 border-r flex flex-col">
              <div className="p-4 border-b">
                 <h2 className="text-lg font-semibold flex items-center gap-2"><Lock className="h-5 w-5" /> Hidden Notes</h2>
              </div>
              <NoteList
                notes={hiddenNotes}
                activeNoteId={activeNote?.id ?? null}
                onSelectNote={handleSelectNote}
                onDeleteNote={deleteNote}
                onToggleFavorite={(id, isFav) => updateNote({ id, isFavorite: isFav })}
                onSetPassword={(note) => { /* Password management disabled in vault */ }}
                onSetCategory={(note) => { /* Category management disabled in vault */ }}
              />
            </aside>
            <main className="flex-1">
              <NoteView />
            </main>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
