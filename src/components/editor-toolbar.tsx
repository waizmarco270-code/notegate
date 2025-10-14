"use client";

import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";


export function EditorToolbar() {
  return (
    <div className="p-2 border-b flex items-center gap-2 flex-wrap">
      <Select defaultValue="12px">
        <SelectTrigger className="w-24">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="10px">10</SelectItem>
          <SelectItem value="12px">12</SelectItem>
          <SelectItem value="14px">14</SelectItem>
          <SelectItem value="16px">16</SelectItem>
          <SelectItem value="20px">20</SelectItem>
        </SelectContent>
      </Select>
      
      <Select defaultValue="arial">
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="courier">Courier New</SelectItem>
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="icon">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="icon">
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <Heading2 className="h-4 w-4" />
      </Button>
       <Button variant="ghost" size="icon">
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="icon">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon">
        <AlignRight className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="icon">
        <List className="h-4 w-4" />
      </Button>
       <Button variant="ghost" size="icon">
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
       <Button variant="ghost" size="icon">
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
}
