"use client";

import { useState, useEffect } from "react";
import { Star, Lock, MoreVertical } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import type { Note } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { PasswordDialog } from "@/components/password-dialog";
import { TagsDialog } from "@/components/tags-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, deleteNote } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isTagsDialogOpen, setTagsDialogOpen] = useState(false);

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

  const handlePasswordSet = (password: string | null) => {
    updateNote({ id: note.id, password });
    setPasswordDialogOpen(false);
  };
  
  const handleTagsUpdate = (category: string | null, tags: string[]) => {
    updateNote({ id: note.id, category, tags });
    setTagsDialogOpen(false);
  };
  
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full bg-card">
      <header className="p-4 border-b flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0 h-auto flex-1 bg-transparent"
        />
        <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">{wordCount} words</span>
            <Button variant="ghost" size="icon">
                <Star className="h-4 w-4" />
            </Button>
             <Button variant="ghost" size="icon" onClick={() => setPasswordDialogOpen(true)}>
                <Lock className="h-4 w-4" />
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setTagsDialogOpen(true)}>Organize</DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Delete Note</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the note. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <EditorToolbar />

      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="h-full w-full border-none shadow-none focus-visible:ring-0 resize-none text-base p-0 bg-transparent"
        />
      </div>
      
      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        mode={note.password ? "update" : "set"}
        onSetPassword={handlePasswordSet}
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
