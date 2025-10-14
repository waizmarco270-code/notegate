"use client";

import { Home, Plus, Search, Moon, Sun, Star, Briefcase, Lightbulb, ChevronDown, Folder, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/types";
import { useTheme } from "@/context/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useNotes } from "@/context/notes-provider";

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
    "All Notes": Home,
  };
  
  const getActiveCategoryLabel = () => {
    if (activeCategory === null) return "All Notes";
    return activeCategory;
  }
  
  const ActiveIcon = categoryIcons[getActiveCategoryLabel()] || Folder;

  return (
    <aside className="w-80 min-w-[320px] flex flex-col bg-background/50 p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Legendary Notes</h1>
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <div className="flex items-center">
              <ActiveIcon className="mr-2 h-4 w-4" /> {getActiveCategoryLabel()}
            </div>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width]">
          <DropdownMenuItem onClick={() => onSelectCategory("All Notes")}>
            <Home className="mr-2 h-4 w-4" />
            All Notes
          </DropdownMenuItem>
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
