"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import { useNotes, PREDEFINED_CATEGORIES } from "@/context/notes-provider";
import type { Note } from "@/lib/types";

interface CategoryPopoverProps {
  children: React.ReactNode;
  note: Note;
  onUpdateCategory: (category: string | null) => void;
  onOpenManageCategories: () => void;
}

export function CategoryPopover({ children, note, onUpdateCategory, onOpenManageCategories }: CategoryPopoverProps) {
  const { allCategories } = useNotes();

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-60 p-2">
        <div className="grid gap-2">
          <div className="space-y-1">
            <h4 className="font-medium text-sm leading-none">Assign Category</h4>
            <p className="text-xs text-muted-foreground">
              Select a category for this note.
            </p>
          </div>
          <div className="flex flex-col gap-1 pt-2">
            <Button
                variant={note.category === null ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => onUpdateCategory(null)}
            >
                None
            </Button>
            {allCategories.map((cat) => (
              <Button
                key={cat}
                variant={note.category === cat ? "secondary" : "ghost"}
                size="sm"
                className="justify-start"
                onClick={() => onUpdateCategory(cat)}
              >
                {cat}
              </Button>
            ))}
             <Button
                variant="ghost"
                size="sm"
                className="justify-start text-primary hover:text-primary mt-2"
                onClick={onOpenManageCategories}
            >
                <Plus className="h-4 w-4 mr-2" />
                Manage categories...
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
