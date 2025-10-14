"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Folder, Plus, X } from "lucide-react";
import type { Note } from "@/lib/types";
import { useNotes, PREDEFINED_CATEGORIES } from "@/context/notes-provider";
import { cn } from "@/lib/utils";

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onUpdateCategory: (category: string | null) => void;
}

export function ManageCategoriesDialog({ open, onOpenChange, note, onUpdateCategory }: ManageCategoriesDialogProps) {
  const { allCategories, addCategory, deleteCategory } = useNotes();
  const [currentCategory, setCurrentCategory] = useState(note.category);
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory && !allCategories.includes(newCategory)) {
      addCategory(newCategory);
      setNewCategory("");
    }
  };
  
  const handleSelectCategory = (category: string | null) => {
    setCurrentCategory(category);
    onUpdateCategory(category);
    onOpenChange(false);
  }
  
  const handleDeleteCategory = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    deleteCategory(category);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Manage Categories
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-category">New category name</Label>
            <div className="flex gap-2">
              <Input 
                id="new-category" 
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); }}}
                placeholder="New category name"
              />
              <Button size="icon" onClick={handleAddCategory}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Select a category:</Label>
            <div className="flex flex-wrap gap-2 pt-2">
                <Badge
                  key="none"
                  variant={currentCategory === null ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => handleSelectCategory(null)}
                >
                  None
                </Badge>
              {allCategories.map(cat => (
                <div key={cat} className="relative group">
                  <Badge
                    variant={currentCategory === cat ? "default" : "secondary"}
                    className="cursor-pointer pr-4"
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {cat}
                  </Badge>
                  {!PREDEFINED_CATEGORIES.includes(cat) && (
                     <button
                        onClick={(e) => handleDeleteCategory(e, cat)}
                        className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive text-destructive-foreground p-0.5 opacity-80 hover:opacity-100 transition-opacity"
                        aria-label={`Delete category ${cat}`}
                    >
                        <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
