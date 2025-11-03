
"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import type { Note } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { FileText } from 'lucide-react';

interface LinkPopoverProps {
  position: { top: number; left: number };
  query: string;
  notes: Note[];
  onSelect: (note: Note) => void;
  onClose: () => void;
}

export function LinkPopover({ position, query, notes, onSelect, onClose }: LinkPopoverProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const popoverRef = useRef<HTMLDivElement>(null);

  const filteredNotes = useMemo(() => 
    notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase())
    ), [notes, query]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (filteredNotes.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredNotes.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredNotes.length) % filteredNotes.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        onSelect(filteredNotes[selectedIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredNotes, selectedIndex, onSelect, onClose]);
  
  // Close popover if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (filteredNotes.length === 0) {
    return null;
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 w-64 bg-popover text-popover-foreground rounded-md border shadow-lg"
      style={{ top: position.top, left: position.left }}
    >
      <ScrollArea className="max-h-60">
        <div className="p-1">
          {filteredNotes.map((note, index) => (
            <div
              key={note.id}
              onClick={() => onSelect(note)}
              className={`flex items-center gap-2 p-2 text-sm rounded-sm cursor-pointer ${
                index === selectedIndex ? 'bg-accent' : ''
              }`}
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="truncate">{note.title}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
