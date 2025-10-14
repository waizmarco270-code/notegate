"use client";

import { Bold, Italic, Underline, List, ListOrdered } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export function EditorToolbar() {
  return (
    <div className="p-2 border-b flex items-center gap-1">
      <Button variant="ghost" size="icon" disabled>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled>
        <Underline className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="icon" disabled>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled>
        <ListOrdered className="h-4 w-4" />
      </Button>
    </div>
  );
}
