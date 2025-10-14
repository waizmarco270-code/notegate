"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Lock, MoreVertical, Folder, Copy, TextSelect, FileDown, Trash2 } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import type { Note } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { PasswordDialog } from "@/components/password-dialog";
import { ManageCategoriesDialog } from "@/components/manage-categories-dialog";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NoteEditorProps {
  note: Note;
}

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, deleteNote } = useNotes();
  const { toast } = useToast();
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isCategoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite ?? false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);


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

  useEffect(() => {
    setIsFavorite(note.isFavorite ?? false);
  }, [note.isFavorite]);

  const handlePasswordSet = (password: string | null) => {
    updateNote({ id: note.id, password });
    setPasswordDialogOpen(false);
  };
  
  const handleCategoryUpdate = (category: string | null) => {
    updateNote({ id: note.id, category });
  };

  const toggleFavorite = () => {
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    updateNote({ id: note.id, isFavorite: newIsFavorite });
  };
  
  const handleCopyNote = () => {
    navigator.clipboard.writeText(content);
    toast({ title: "Note content copied to clipboard." });
  };

  const handleSelectAll = () => {
    textareaRef.current?.select();
  };

  const handleExport = (format: "txt" | "html") => {
    let fileContent = content;
    let mimeType = "text/plain";
    let fileExtension = "txt";

    if (format === "html") {
      fileContent = `<!DOCTYPE html><html><head><title>${title}</title></head><body><pre>${content}</pre></body></html>`;
      mimeType = "text/html";
      fileExtension = "html";
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'note'}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: `Note exported as ${fileExtension.toUpperCase()}.` });
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 bg-card rounded-lg border">
        <header className="p-4 flex items-center justify-between gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-lg font-semibold border-none shadow-none focus-visible:ring-0 p-0 h-auto flex-1 bg-transparent"
          />
          <div className="flex items-center gap-1 sm:gap-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">{wordCount} words</span>
              <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                  <Star className={cn("h-4 w-4", isFavorite ? "text-yellow-400 fill-yellow-400" : "")} />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setPasswordDialogOpen(true)}>
                  <Lock className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setCategoriesDialogOpen(true)}>
                  <Folder className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                      </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={handleCopyNote}>
                          <Copy className="mr-2 h-4 w-4" />
                          <span>Copy Note</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={handleSelectAll}>
                          <TextSelect className="mr-2 h-4 w-4" />
                          <span>Select All</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => handleExport("txt")}>
                          <FileDown className="mr-2 h-4 w-4" />
                          <span>Export as TXT</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => handleExport("html")}>
                          <FileDown className="mr-2 h-4 w-4" />
                          <span>Export as HTML</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                          <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive"
                                  onSelect={(e) => e.preventDefault()}
                              >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Delete Note</span>
                              </DropdownMenuItem>
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
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="h-full w-full border-none shadow-none focus-visible:ring-0 resize-none text-base bg-transparent p-0"
            />
        </div>
      </div>
      
      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        mode={note.password ? "update" : "set"}
        onSetPassword={handlePasswordSet}
      />
      
      <ManageCategoriesDialog
        open={isCategoriesDialogOpen}
        onOpenChange={setCategoriesDialogOpen}
        note={note}
        onUpdateCategory={handleCategoryUpdate}
      />
    </div>
  );
}
