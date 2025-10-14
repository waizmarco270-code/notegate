"use client";

import { Home, Plus, Search, Settings, RotateCw } from "lucide-react";
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
  const { setOpenSettings, theme, setTheme } = useTheme();
  
  return (
    <aside className="w-80 min-w-80 flex flex-col border-r bg-background/50 p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Legendary Notes</h1>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={() => window.location.reload()} aria-label="Refresh">
            <RotateCw className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)} aria-label="Open settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Button variant="default" className="w-full bg-black text-white dark:bg-white dark:text-black" onClick={onNewNote}>
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
