"use client";

import { useState, useEffect } from "react";
import { Trash2, Lock, Tag, Sparkles, AlertCircle } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import type { Note } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { PasswordDialog } from "@/components/password-dialog";
import { SummaryDialog } from "@/components/summary-dialog";
import { TagsDialog } from "@/components/tags-dialog";
import { summarizeNoteAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "./ui/badge";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isSummaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [isTagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        updateNote({ id: note.id, title, content });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, note.id, note.title, note.content, updateNote]);
  
  const handleSummarize = async () => {
    setIsSummarizing(true);
    setSummary("");
    const result = await summarizeNoteAction({ noteContent: content });
    if (result.error) {
      toast({
        variant: "destructive",
        title: "Summarization Failed",
        description: result.error,
      });
    } else {
      setSummary(result.summary ?? "");
      setSummaryDialogOpen(true);
    }
    setIsSummarizing(false);
  };

  const handlePasswordSet = (password: string | null) => {
    updateNote({ id: note.id, password });
    setPasswordDialogOpen(false);
  };

  const handleTagsUpdate = (category: string | null, tags: string[]) => {
    updateNote({ id: note.id, category, tags });
    setTagsDialogOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="text-2xl font-bold font-headline border-none shadow-none focus-visible:ring-0 h-auto p-0"
        />
        <div className="flex gap-2 mt-2">
            {note.category && <Badge variant="secondary">{note.category}</Badge>}
            {note.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>
      </header>

      <EditorToolbar />

      <div className="flex-1 overflow-auto p-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing your note here..."
          className="h-full w-full border-none shadow-none focus-visible:ring-0 resize-none text-base leading-relaxed p-0"
        />
      </div>

      <footer className="p-4 border-t flex items-center justify-between bg-card/50">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isSummarizing}>
            {isSummarizing ? <Sparkles className="h-4 w-4 animate-pulse" /> : <Sparkles className="h-4 w-4" />}
            AI Summary
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPasswordDialogOpen(true)}>
            <Lock className="h-4 w-4" />
            {note.password ? "Change Password" : "Set Password"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTagsDialogOpen(true)}>
            <Tag className="h-4 w-4" />
            Organize
          </Button>
        </div>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete Note
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the note.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteNote(note.id)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </footer>
      
      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        mode={note.password ? "update" : "set"}
        onSetPassword={handlePasswordSet}
      />
      
      <SummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
        summary={summary}
      />

      <TagsDialog 
        open={isTagsDialogOpen}
        onOpenChange={setTagsDialogOpen}
        note={note}
        onUpdate={handleTagsUpdate}
      />
    </div>
  );
}
