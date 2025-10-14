"use client";

import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Palette, CaseSensitive, Heading, Pilcrow } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";


export function EditorToolbar() {
  return (
    <div className="p-2 border-b flex items-center gap-2 flex-wrap bg-card rounded-t-lg">
      <Select defaultValue="12px">
        <SelectTrigger className="w-24 h-8 text-xs">
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
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="arial">Arial</SelectItem>
          <SelectItem value="times">Times New Roman</SelectItem>
          <SelectItem value="courier">Courier New</SelectItem>
          <SelectItem value="georgia">Georgia</SelectItem>
          <SelectItem value="verdana">Verdana</SelectItem>
          <SelectItem value="impact">Impact</SelectItem>
          <SelectItem value="comic-sans">Comic Sans MS</SelectItem>
        </SelectContent>
      </Select>
      
      <Separator orientation="vertical" className="h-6 mx-1" />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <CaseSensitive className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex gap-1">
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bold className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Italic className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Underline className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Heading className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex gap-1">
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading1 className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading2 className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heading3 className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Pilcrow className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex gap-1">
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AlignLeft className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AlignCenter className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <AlignRight className="h-4 w-4" />
                </Button>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <Button variant="ghost" size="icon" className="h-8 w-8">
        <List className="h-4 w-4" />
      </Button>
       <Button variant="ghost" size="icon" className="h-8 w-8">
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
       <Button variant="ghost" size="icon" className="h-8 w-8">
        <Palette className="h-4 w-4" />
      </Button>
    </div>
  );
}
