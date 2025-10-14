"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { NoteView } from "@/components/note-view";
import { useNotes } from "@/context/notes-provider";
import { PasswordDialog } from "@/components/password-dialog";
import type { Note } from "@/lib/types";
import { ManageCategoriesDialog } from "./manage-categories-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { PanelLeft } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export function MainLayout() {
  const { notes, createNote, activeNote, setActiveNoteId, deleteNote, updateNote } = useNotes();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [passwordNote, setPasswordNote] = useState<Note | null>(null);
  const [categoryNote, setCategoryNote] = useState<Note | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();


  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredNotes = notes
    .filter((note) => {
      const matchesSearch =
        (note.title && note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content && note.content.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (categoryFilter === "Favorites") {
        return matchesSearch && note.isFavorite;
      }

      const matchesCategory =
        categoryFilter === null || note.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const handleSelectCategory = (category: string | null) => {
    if (category === "All Notes") {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(category);
    }
     if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    updateNote({ id, isFavorite });
  };
  
  const handlePasswordSet = (password: string | null) => {
    if (passwordNote) {
      updateNote({ id: passwordNote.id, password });
    }
    setPasswordNote(null);
  };
  
  const handleCategoryUpdate = (category: string | null) => {
    if (categoryNote) {
        updateNote({ id: categoryNote.id, category });
    }
  };
  
  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const handleNewNote = () => {
    createNote();
    if (isMobile) {
      setSidebarOpen(false);
    }
  };


  if (!isClient) {
    return null;
  }
  
  const sidebarContent = (
      <Sidebar
          notes={filteredNotes}
          activeNoteId={activeNote?.id ?? null}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSelectCategory={handleSelectCategory}
          activeCategory={categoryFilter}
          onDeleteNote={deleteNote}
          onToggleFavorite={handleToggleFavorite}
          onSetPassword={setPasswordNote}
          onSetCategory={setCategoryNote}
        />
  )

  return (
    <>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        {isMobile ? (
          <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="absolute top-2 left-2 z-10">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Sidebar</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-80">
                {sidebarContent}
            </SheetContent>
          </Sheet>
        ) : (
          sidebarContent
        )}

        <main className="flex-1 flex flex-col overflow-auto">
          {isMobile && <div className="h-12" />}
          <NoteView key={activeNote?.id} />
        </main>
      </div>
      {passwordNote && (
        <PasswordDialog
          open={!!passwordNote}
          onOpenChange={(isOpen) => !isOpen && setPasswordNote(null)}
          mode={passwordNote.password ? "update" : "set"}
          onSetPassword={handlePasswordSet}
        />
      )}
      {categoryNote && (
        <ManageCategoriesDialog
            open={!!categoryNote}
            onOpenChange={(isOpen) => !isOpen && setCategoryNote(null)}
            note={categoryNote}
            onUpdateCategory={handleCategoryUpdate}
        />
      )}
    </>
  );
}
