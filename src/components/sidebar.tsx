"use client";

import { Home, Plus, Search, Moon, Sun, Star, Briefcase, Lightbulb, ChevronDown, Folder, Settings, User } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/types";
import { useTheme } from "@/context/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotes } from "@/context/notes-provider";
import { cn } from "@/lib/utils";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSelectCategory: (category: string | null) => void;
  activeCategory: string | null;
  onDeleteNote: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onSetPassword: (note: Note) => void;
  onSetCategory: (note: Note) => void;
}

export function Sidebar({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onNewNote, 
  searchTerm, 
  onSearchTermChange, 
  onSelectCategory, 
  activeCategory,
  onDeleteNote,
  onToggleFavorite,
  onSetPassword,
  onSetCategory
}: SidebarProps) {
  const { isDarkMode, setDarkMode, setOpenSettings } = useTheme();
  const { allCategories } = useNotes();

  const categoryIcons: { [key: string]: React.ElementType } = {
    "Personal": User,
    "Work": Briefcase,
    "Ideas": Lightbulb,
    "Favorites": Star,
  };
  
  const getActiveCategoryLabel = () => {
    if (activeCategory === null) return "All Notes";
    return activeCategory;
  }
  
  const ActiveIcon = categoryIcons[getActiveCategoryLabel()] || Folder;

  return (
    <aside className="w-80 min-w-[320px] flex flex-col bg-background/50 p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-2">
           <Image
            src="/logo.jpg"
            alt="NotesGate Logo"
            width={28}
            height={28}
            className="rounded-md"
          />
          <h1 className="text-2xl font-bold text-foreground">NotesGate</h1>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setDarkMode(!isDarkMode)} aria-label="Toggle theme">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)} aria-label="Open settings">
              <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Button variant="default" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={onNewNote}>
        <Plus className="h-4 w-4 mr-2" /> New Note
      </Button>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search notes..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
        />
      </div>

      <nav className="flex flex-col gap-2">
         <Button 
            variant={activeCategory === null ? "secondary" : "ghost"}
            className="w-full justify-start"
            onClick={() => onSelectCategory("All Notes")}
          >
            <Home className="mr-2 h-4 w-4" /> All Notes
        </Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start">
                <Folder className="mr-2 h-4 w-4" /> Categories
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
            <DropdownMenuItem onClick={() => onSelectCategory("Favorites")}>
                <Star className="mr-2 h-4 w-4" />
                Favorites
            </DropdownMenuItem>
            {allCategories.length > 0 && <DropdownMenuSeparator />}
            {allCategories.map(category => {
                const Icon = categoryIcons[category] || Folder;
                return (
                <DropdownMenuItem key={category} onClick={() => onSelectCategory(category)}>
                    <Icon className="mr-2 h-4 w-4" />
                    {category}
                </DropdownMenuItem>
                );
            })}
            </DropdownMenuContent>
        </DropdownMenu>
      </nav>
      

      <NoteList 
        notes={notes} 
        activeNoteId={activeNoteId} 
        onSelectNote={onSelectNote}
        onDeleteNote={onDeleteNote}
        onToggleFavorite={onToggleFavorite}
        onSetPassword={onSetPassword}
        onSetCategory={onSetCategory}
      />
    </aside>
  );
}
