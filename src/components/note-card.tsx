"use client";

import { Lock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Note } from "@/lib/types";
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  isActive: boolean;
  onClick: () => void;
}

export function NoteCard({ note, isActive, onClick }: NoteCardProps) {
  const contentSnippet = note.content.substring(0, 100) + (note.content.length > 100 ? "..." : "");

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-secondary/50",
        isActive && "bg-primary/10 border-primary"
      )}
      onClick={onClick}
    >
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between text-base font-bold font-headline">
          <span className="truncate pr-2">{note.title}</span>
          {note.password && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground truncate">{contentSnippet || "No content"}</p>
        <p className="text-xs text-muted-foreground/80 mt-2">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </p>
      </CardContent>
    </Card>
  );
}
