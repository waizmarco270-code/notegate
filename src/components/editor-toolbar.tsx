
"use client";

import { useState } from "react";
import { Bold, Italic, Underline, List, ListOrdered, Heading1, Heading2, Heading3, AlignLeft, AlignCenter, AlignRight, Palette, CaseSensitive, Heading, Pilcrow } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";

interface EditorToolbarProps {
  fontSize: string;
  onFontSizeChange: (size: string) => void;
  fontFamily: string;
  onFontFamilyChange: (font: string) => void;
  currentColor: string;
  onColorChange: (color: string) => void;
  onInsertUnorderedList: () => void;
  onInsertOrderedList: () => void;
  applyToAll: boolean;
  onApplyToAllChange: (value: boolean) => void;
}

const colors = [
    "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF",
    "#FFA500", "#800080", "#008000", "#FFC0CB", "#A52A2A", "#808080", "#FFFFFF"
];

export function EditorToolbar({ fontSize, onFontSizeChange, fontFamily, onFontFamilyChange, currentColor, onColorChange, onInsertUnorderedList, onInsertOrderedList, applyToAll, onApplyToAllChange }: EditorToolbarProps) {
  const numericFontSize = parseInt(fontSize.replace('px', ''), 10);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  
  const handleManualSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = e.target.value;
    if (!isNaN(Number(newSize)) && Number(newSize) >= 8 && Number(newSize) <= 200) {
        onFontSizeChange(`${newSize}px`);
    } else if (newSize === "") {
        onFontSizeChange('8px');
    }
  }

  const handleColorSelect = (color: string) => {
    onColorChange(color);
    setIsColorPickerOpen(false);
  };

  return (
    <div className="p-2 border-y flex items-center gap-2 flex-wrap bg-card">
      <div className="flex items-center gap-2 w-48">
        <Input 
            type="number"
            value={numericFontSize}
            onChange={handleManualSizeChange}
            className="text-xs font-medium w-16 text-center h-8"
            min={8}
            max={200}
        />
        <Slider
            value={[numericFontSize]}
            onValueChange={(value) => onFontSizeChange(`${value[0]}px`)}
            min={8}
            max={200}
            step={1}
            className="w-full"
        />
      </div>
      
      <Select value={fontFamily} onValueChange={onFontFamilyChange}>
        <SelectTrigger className="w-36 h-8 text-xs">
          <SelectValue placeholder="Font" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Arial">Arial</SelectItem>
          <SelectItem value="Times New Roman">Times New Roman</SelectItem>
          <SelectItem value="Courier New">Courier New</SelectItem>
          <SelectItem value="Georgia">Georgia</SelectItem>
          <SelectItem value="Verdana">Verdana</SelectItem>
          <SelectItem value="Impact">Impact</SelectItem>
          <SelectItem value="Comic Sans MS">Comic Sans MS</SelectItem>
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

      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onInsertUnorderedList}>
        <List className="h-4 w-4" />
      </Button>
       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onInsertOrderedList}>
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
       <Popover open={isColorPickerOpen} onOpenChange={setIsColorPickerOpen}>
        <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
                <Palette className="h-4 w-4 transition-colors" style={{ color: currentColor }} />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-7 gap-1">
                {colors.map(color => (
                    <Button
                        key={color}
                        variant="outline"
                        className={cn(
                            "h-6 w-6 p-0 border transition-transform hover:scale-110",
                            currentColor === color && "ring-2 ring-primary ring-offset-2"
                        )}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorSelect(color)}
                    />
                ))}
            </div>
        </PopoverContent>
       </Popover>
       <Separator orientation="vertical" className="h-6 mx-1" />
        <div className="flex items-center space-x-2">
            <Switch id="apply-to-all" checked={applyToAll} onCheckedChange={onApplyToAllChange} />
            <Label htmlFor="apply-to-all" className="text-xs">Apply to all</Label>
        </div>
    </div>
  );
}
