"use client";

import { useState, useEffect, useRef } from "react";
import { Star, MoreVertical, Folder, Copy, TextSelect, FileDown, Trash2, Sparkles, Lock, Unlock, Tag } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import type { Note } from "@/lib/types";
import { Input } from "@/components/ui/input";
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
import { summarizeNoteAction } from "@/lib/actions";
import { SummaryDialog } from "./summary-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CategoryPopover } from "./category-popover";
import { Badge } from "./ui/badge";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useLocalStorage("editor-font-size", "16px");
  const [fontFamily, setFontFamily] = useLocalStorage("editor-font-family", "Arial");

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
  
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
    if (contentRef.current && contentRef.current.innerHTML !== note.content) {
        // Use innerHTML to preserve formatting
        contentRef.current.innerHTML = note.content || "";
    }
  }, [note]);

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
    if (contentRef.current) {
        navigator.clipboard.writeText(contentRef.current.innerText);
        toast({ title: "Note content copied to clipboard." });
    }
  };

  const handleSelectAll = () => {
    if (contentRef.current) {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }
  };

  const handleExport = (format: "txt" | "html") => {
    let fileContent = content;
    let mimeType = "text/plain";
    let fileExtension = "txt";

    if (format === "html" && contentRef.current) {
      fileContent = `<!DOCTYPE html><html><head><title>${title}</title></head><body><div style="font-size: ${fontSize}; font-family: ${fontFamily};">${contentRef.current.innerHTML}</div></body></html>`;
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

  const handleSummarize = async () => {
    if (!content) {
      toast({
        variant: "destructive",
        title: "Cannot summarize an empty note.",
      });
      return;
    }
    setIsSummarizing(true);
    const result = await summarizeNoteAction({ noteContent: content });
    setIsSummarizing(false);

    if (result.summary) {
      setSummary(result.summary);
      setSummaryDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Summarization failed.",
        description: result.error || "An unknown error occurred.",
      });
    }
  };
  
  const handleFontSizeChange = (size: string) => {
    if (!size.endsWith('px')) {
      setFontSize(`${size}px`);
    } else {
      setFontSize(size);
    }
  }

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    // Use innerHTML to capture rich text content
    setContent(e.currentTarget.innerHTML);
  };

  const wordCount = contentRef.current?.innerText.trim().split(/\s+/).filter(Boolean).length || 0;
  const isLocked = note.password !== null;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <header className="p-4 flex items-center justify-between gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Note"
          className="text-3xl font-bold font-headline border-none shadow-none focus-visible:ring-0 p-0 h-auto flex-1 bg-transparent tracking-wide"
        />
        <div className="flex items-center gap-1 sm:gap-2">
            <Button onClick={handleSummarize} disabled={isSummarizing} variant="ghost" size="sm">
              <Sparkles className="h-4 w-4 mr-2" />
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{wordCount} words</span>
            <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Star className={cn("h-4 w-4", isFavorite ? "text-yellow-400 fill-yellow-400" : "")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPasswordDialogOpen(true)}>
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
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

      <div className="px-4 pb-2 flex items-center gap-2">
        <CategoryPopover
            note={note}
            onUpdateCategory={handleCategoryUpdate}
            onOpenManageCategories={() => setCategoriesDialogOpen(true)}
        >
            {note.category ? (
                <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                    <Tag className="h-3 w-3 mr-1" />
                    {note.category}
                </Badge>
            ) : (
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Folder className="h-4 w-4 mr-2" />
                    Category
                </Button>
            )}
        </CategoryPopover>
      </div>
      
      <EditorToolbar 
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
      />
      
      <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div
            ref={contentRef}
            contentEditable={true}
            onInput={handleContentChange}
            dangerouslySetInnerHTML={{ __html: content || "" }}
            data-placeholder="Start writing..."
            className="h-full w-full outline-none text-base empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
            style={{ fontSize, fontFamily }}
          />
      </div>
      
      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        mode={isLocked ? "update" : "set"}
        onSetPassword={handlePasswordSet}
      />
      
      <ManageCategoriesDialog
        open={isCategoriesDialogOpen}
        onOpenChange={setCategoriesDialogOpen}
        note={note}
        onUpdateCategory={handleCategoryUpdate}
      />
      <SummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
        summary={summary}
      />
    </div>
  );
}
