"use client";

import { Home, Plus, Search, Settings, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/types";
import { useTheme } from "@/context/theme-provider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";


interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
}

export function Sidebar({ notes, activeNoteId, onSelectNote, onNewNote, searchTerm, onSearchTermChange }: SidebarProps) {
  const { setOpenSettings, theme, setTheme, isDarkMode, setDarkMode } = useTheme();
  
  return (
    <aside className="w-80 min-w-[320px] flex flex-col border-r bg-background/50 p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Legendary Notes</h1>
        <Button variant="ghost" size="icon" onClick={() => setDarkMode(!isDarkMode)} aria-label="Toggle theme">
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
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
          <Button variant="outline" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> All Notes
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>All Notes</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NoteList notes={notes} activeNoteId={activeNoteId} onSelectNote={onSelectNote} />
    </aside>
  );
}
