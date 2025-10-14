"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useNotes } from "@/context/notes-provider";
import { NoteEditor } from "@/components/note-editor";
import { PasswordDialog } from "@/components/password-dialog";
import { Lock, Plus, Settings, Sparkles, FileText, Lightbulb } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function NoteView() {
  const { activeNote, setActiveNoteId, createNote } = useNotes();
  const { setOpenSettings } = useTheme();
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
      <div className="flex-1 flex flex-col items-center justify-start text-center p-4 sm:p-8 h-full bg-secondary/20">
        <div className="w-full max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center py-12 px-6 rounded-lg bg-card border shadow-sm mb-8">
            <Image
              src="/logo.jpg"
              alt="NotesGate Logo"
              width={80}
              height={80}
              className="rounded-xl mx-auto mb-4"
            />
            <h2 className="text-4xl font-bold font-headline tracking-tight">Unlock Your Potential</h2>
            <p className="text-lg text-muted-foreground mt-2">
              Welcome to NotesGate. Select a note or create a new one to begin.
            </p>
          </div>

          {/* Quick Actions & Tips */}
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Get Started
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <Button onClick={createNote} className="w-full justify-start" size="lg">
                    <Plus className="mr-4 h-5 w-5" />
                    Create a New Note
                </Button>
                 <Button variant="outline" className="w-full justify-start" size="lg" disabled>
                    <FileText className="mr-4 h-5 w-5" />
                    Explore Templates
                </Button>
                <Button variant="outline" onClick={() => setOpenSettings(true)} className="w-full justify-start" size="lg">
                    <Settings className="mr-4 h-5 w-5" />
                    Go to Settings
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-400" />
                   Pro Tip
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-left">
                <h4 className="font-semibold">Summarize with AI</h4>
                <p className="text-sm text-muted-foreground">
                  Have a long note? Use the <span className="font-semibold text-primary">Summarize</span> feature powered by AI to get a quick overview of your content in seconds.
                </p>
                <h4 className="font-semibold mt-4">Global Styles</h4>
                 <p className="text-sm text-muted-foreground">
                  Use the "Apply to all" switch in the editor toolbar to format your entire note with a single click.
                </p>
              </CardContent>
            </Card>
          </div>
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

  return <div className="h-full w-full p-0 md:p-4"><NoteEditor note={activeNote} /></div>;
}
