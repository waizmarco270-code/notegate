"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Note } from "@/lib/types";
import { useNotes } from "@/context/notes-provider";

interface TagsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: Note;
  onUpdate: (category: string | null, tags: string[]) => void;
}

export function TagsDialog({ open, onOpenChange, note, onUpdate }: TagsDialogProps) {
  const { allCategories, allTags } = useNotes();
  const [category, setCategory] = useState(note.category);
  const [tags, setTags] = useState(note.tags);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSave = () => {
    onUpdate(category, tags);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Organize Note</DialogTitle>
          <DialogDescription>
            Assign a category and add tags to help you find this note later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input 
              id="category" 
              value={category ?? ""}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Work, Personal"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input 
                id="tags" 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }}}
                placeholder="Add a tag and press Enter"
              />
              <Button onClick={handleAddTag}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-1 rounded-full hover:bg-destructive/20 p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
