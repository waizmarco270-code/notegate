
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Languages, Loader2, Replace } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { translateNoteAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

interface TranslateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteContent: string;
  onReplaceContent: (newContent: string) => void;
}

const supportedLanguages = [
  "English", "Spanish", "French", "German", "Hindi", "Arabic", "Mandarin Chinese", "Japanese", "Russian", "Portuguese"
];

export function TranslateDialog({ open, onOpenChange, noteContent, onReplaceContent }: TranslateDialogProps) {
  const [targetLanguage, setTargetLanguage] = useState("Hindi");
  const [translatedContent, setTranslatedContent] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!noteContent) {
        toast({ variant: "destructive", title: "Cannot translate an empty note." });
        return;
    }
    setIsTranslating(true);
    setTranslatedContent("");
    const result = await translateNoteAction({ noteContent, targetLanguage });
    setIsTranslating(false);

    if (result.translatedContent) {
        setTranslatedContent(result.translatedContent);
    } else {
        toast({
            variant: "destructive",
            title: "Translation Failed",
            description: result.error || "Could not translate the note."
        });
    }
  };

  const handleReplaceClick = () => {
    onReplaceContent(translatedContent);
    onOpenChange(false);
  }

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        setTranslatedContent("");
        setIsTranslating(false);
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Languages className="h-5 w-5 text-primary" />
            Translate Note
          </DialogTitle>
          <DialogDescription>
            Select a language to translate your note content. The original note will not be changed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
          <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
            <p className="text-sm font-medium text-right my-auto">Translate to:</p>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {supportedLanguages.map(lang => (
                  <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleTranslate} disabled={isTranslating} className="w-full sm:w-auto">
            {isTranslating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Translate
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh]">
            <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Original</h3>
                <ScrollArea className="rounded-md border p-4 h-64 bg-secondary/20">
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: noteContent || "<p>Nothing to translate.</p>"}} />
                </ScrollArea>
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Translation ({targetLanguage})</h3>
                <ScrollArea className="rounded-md border p-4 h-64">
                    {isTranslating ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: translatedContent || `<p>Translation will appear here.</p>` }} />
                    )}
                </ScrollArea>
            </div>
        </div>

        <DialogFooter>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="default" disabled={!translatedContent || isTranslating}>
                        <Replace className="mr-2 h-4 w-4" />
                        Replace Original Content
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will replace your original note content with the translation. The original version will be saved in your note's history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReplaceClick}>Replace</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}

    