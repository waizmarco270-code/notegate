"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isActive, onClick }: NoteCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-secondary/50 border-transparent",
        isActive ? "bg-secondary" : "bg-card"
      )}
      onClick={onClick}
    >
      <CardHeader className="p-3">
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
    </Card>
  );
}
