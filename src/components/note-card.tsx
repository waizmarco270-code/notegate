"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { MoreVertical, Star, Trash2, Lock, Folder } from "lucide-react";

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onSetPassword: (note: Note) => void;
  onSetCategory: (note: Note) => void;
}

export function NoteCard({ note, isActive, onClick, onDelete, onToggleFavorite, onSetPassword, onSetCategory }: NoteCardProps) {

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-secondary/50 relative group border",
        isActive ? "bg-secondary" : "bg-card",
        note.isFavorite ? "border-yellow-400/50" : "border-transparent"
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3 pr-10">
        <CardTitle className="text-sm font-semibold truncate">
          {note.title || "Untitled Note"}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {new Date(note.updatedAt).toLocaleDateString()}
        </CardDescription>
        {note.category && (
          <CardDescription className="text-xs text-muted-foreground">
            {note.category}
          </CardDescription>
        )}
      </CardHeader>
      <div className="absolute top-1/2 right-1 -translate-y-1/2" onClick={handleMenuClick}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={() => onToggleFavorite(note.id, !note.isFavorite)}>
              <Star className={cn("mr-2 h-4 w-4", note.isFavorite ? "text-yellow-400 fill-yellow-400" : "")} />
              <span>{note.isFavorite ? "Unfavorite" : "Favorite"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSetPassword(note)}>
              <Lock className="mr-2 h-4 w-4" />
              <span>{note.password ? "Update Password" : "Set Password"}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onSetCategory(note)}>
                <Folder className="mr-2 h-4 w-4" />
                <span>Set Category</span>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onDelete(note.id)} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  );
}
