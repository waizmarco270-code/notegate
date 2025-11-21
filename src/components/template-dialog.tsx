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
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2, Sparkles, Star, Wand2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNotes } from "@/context/notes-provider";
import { generateTemplate } from "@/ai/flows/ai-generate-template";

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const predefinedTemplates = [
    "Meeting Agenda",
    "To-Do List",
    "Project Plan",
    "Weekly Planner",
    "Brainstorming Session",
    "Book Summary",
];

export function TemplateDialog({ open, onOpenChange }: TemplateDialogProps) {
  const [customCommand, setCustomCommand] = useState("");
  const [promptCommand, setPromptCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { createNoteWithOptions } = useNotes();

  const handleCreateFromTemplate = async (command: string, isPromptEngineering = false) => {
    if (!command) {
        toast({ variant: "destructive", title: "Command cannot be empty." });
        return;
    }
    setIsLoading(true);

    try {
        const result = await generateTemplate({ command, isPromptEngineering });
        if (result.title && result.content) {
            createNoteWithOptions({ title: result.title, content: result.content });
            toast({ title: "Note created from template!", description: `"${result.title}" has been added.` });
            onOpenChange(false);
        } else {
            throw new Error("AI did not return valid content.");
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Template Creation Failed", description: error instanceof Error ? error.message : "An unknown error occurred." });
    } finally {
        setIsLoading(false);
    }
  };
  
  const resetState = (isOpen: boolean) => {
    if (!isOpen) {
      setCustomCommand("");
      setPromptCommand("");
      setIsLoading(false);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={resetState}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Explore Templates
          </DialogTitle>
          <DialogDescription>
            Create a new note from a predefined template or generate one with AI.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-8">
            {/* Predefined Templates */}
            <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">Quick Starts</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {predefinedTemplates.map(template => (
                        <Button key={template} variant="outline" className="justify-start" onClick={() => handleCreateFromTemplate(template)}>
                            {template}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Custom AI Template */}
            <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI-Powered Custom Template</h3>
                <div className="flex gap-2">
                    <Input 
                        placeholder="e.g., 'A 3-day travel itinerary for Paris'"
                        value={customCommand}
                        onChange={e => setCustomCommand(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleCreateFromTemplate(customCommand)}
                        disabled={isLoading}
                    />
                    <Button onClick={() => handleCreateFromTemplate(customCommand)} disabled={isLoading || !customCommand}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Generate"}
                    </Button>
                </div>
            </div>

            {/* Prompt Engineering */}
            <div className="p-4 rounded-lg bg-secondary/50 border border-primary/20">
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" /> Premium: AI Developer Prompt
                </h3>
                 <p className="text-xs text-muted-foreground mb-3">Describe an app or feature you want an AI developer to build, and we'll engineer the perfect prompt for it.</p>
                <div className="flex gap-2">
                    <Input 
                        placeholder="e.g., 'A simple calculator web app'"
                        value={promptCommand}
                        onChange={e => setPromptCommand(e.target.value)}
                         onKeyDown={e => e.key === 'Enter' && handleCreateFromTemplate(promptCommand, true)}
                        disabled={isLoading}
                    />
                    <Button onClick={() => handleCreateFromTemplate(promptCommand, true)} disabled={isLoading || !promptCommand} variant="default">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Wand2 className="h-4 w-4 mr-2" /> Engineer Prompt</>}
                    </Button>
                </div>
            </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
