"use client";

import { Home, Plus, Search, Tag, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/types";
import { SecureNoteLogo } from "@/components/icons";
import { useNotes } from "@/context/notes-provider";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/context/theme-provider";
import { Separator } from "./ui/separator";

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onNewNote: () => void;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onFilterChange: (filter: { type: 'tag' | 'category', value: string } | null) => void;
  currentFilter: { type: 'tag' | 'category', value: string } | null;
}

export function Sidebar({ notes, activeNoteId, onSelectNote, onNewNote, searchTerm, onSearchTermChange, onFilterChange, currentFilter }: SidebarProps) {
  const { allTags, allCategories } = useNotes();
  const { setOpenSettings } = useTheme();
  
  return (
    <aside className="w-80 min-w-80 flex flex-col border-r bg-card/50">
      <header className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <SecureNoteLogo className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-headline font-bold text-primary">SecureNote</h1>
        </div>
        <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)} aria-label="Open settings">
                <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onNewNote} aria-label="Create new note">
                <Plus className="h-5 w-5" />
            </Button>
        </div>
      </header>

      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search notes..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="p-4 border-b space-y-3 text-sm">
        <div 
            className="flex items-center gap-2 text-muted-foreground cursor-pointer"
            onClick={() => { onFilterChange(null); onSearchTermChange(''); }}
        >
            <Home className="w-4 h-4" /> All Notes
        </div>
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Tag className="w-4 h-4" /> Categories</div>
            <div className="flex flex-wrap gap-1">
                {allCategories.map(cat => (
                    <Badge 
                        key={cat} 
                        variant={currentFilter?.type === 'category' && currentFilter.value === cat ? "default" : "secondary"} 
                        className="cursor-pointer" 
                        onClick={() => onFilterChange({ type: 'category', value: cat })}>{cat}</Badge>
                ))}
            </div>
        </div>
         <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground"><Tag className="w-4 h-4" /> Tags</div>
            <div className="flex flex-wrap gap-1">
                {allTags.map(tag => (
                    <Badge 
                        key={tag} 
                        variant={currentFilter?.type === 'tag' && currentFilter.value === tag ? "default" : "secondary"} 
                        className="cursor-pointer" onClick={() => onFilterChange({ type: 'tag', value: tag })}>{tag}</Badge>
                ))}
            </div>
        </div>
        {(currentFilter || searchTerm) && <Button variant="link" size="sm" onClick={() => { onFilterChange(null); onSearchTermChange(''); }} className="p-0 h-auto">Clear filters</Button>}
      </div>

      <NoteList notes={notes} activeNoteId={activeNoteId} onSelectNote={onSelectNote} />
    </aside>
  );
}
