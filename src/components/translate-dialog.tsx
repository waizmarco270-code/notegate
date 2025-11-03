
"use client";

import { useState, useRef, useEffect } from "react";
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
import { Languages, Loader2, Replace, Star, Upload, FileDown, Save, FileText } from "lucide-react";
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
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface TranslateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  noteContent?: string;
  onReplaceContent?: (newContent: string) => void;
  onSaveAsNewNote?: (title: string, content: string) => void;
  isSelection?: boolean;
  isDocumentMode?: boolean;
}

const supportedLanguages = [
  { name: "English", premium: false },
  { name: "Spanish", premium: false },
  { name: "French", premium: false },
  { name: "German", premium: false },
  { name: "Hindi", premium: false },
  { name: "Hinglish", premium: true },
  { name: "Arabic", premium: false },
  { name: "Mandarin Chinese", premium: false },
  { name: "Japanese", premium: false },
  { name: "Russian", premium: false },
  { name: "Portuguese", premium: false },
];


export function TranslateDialog({ 
    open, 
    onOpenChange, 
    noteContent = "",
    onReplaceContent,
    onSaveAsNewNote,
    isSelection = false,
    isDocumentMode = false,
}: TranslateDialogProps) {
  const [targetLanguage, setTargetLanguage] = useState("Hinglish");
  const [originalContent, setOriginalContent] = useState(noteContent);
  const [translatedContent, setTranslatedContent] = useState("");
  const [transliteration, setTransliteration] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [fileName, setFileName] = useState("document");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleTranslate = async () => {
    if (!originalContent) {
        toast({ variant: "destructive", title: "Cannot translate empty content." });
        return;
    }
    setIsTranslating(true);
    setTranslatedContent("");
    setTransliteration(null);
    const result = await translateNoteAction({ noteContent: originalContent, targetLanguage });
    setIsTranslating(false);

    if (result.translatedContent) {
        setTranslatedContent(result.translatedContent);
        if (result.transliteration) {
          setTransliteration(result.transliteration);
        }
    } else {
        toast({
            variant: "destructive",
            title: "Translation Failed",
            description: result.error || "Could not translate the note."
        });
    }
  };

  const handleReplaceClick = () => {
    if(onReplaceContent) {
        onReplaceContent(translatedContent);
    }
    onOpenChange(false);
  }
  
  const handleSaveAsNewNote = () => {
    if (onSaveAsNewNote) {
        const newTitle = `Translated: ${fileName}`;
        onSaveAsNewNote(newTitle, translatedContent);
        toast({ title: "Success", description: "Translated content saved as a new note." });
    }
    onOpenChange(false);
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name.split('.')[0] || "document");
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        setOriginalContent(text);
    };
    reader.onerror = () => {
        toast({ variant: "destructive", title: "File Error", description: "Could not read the selected file." });
    };
    reader.readAsText(file);
  };
  
  const handleDownload = () => {
    const blob = new Blob([translatedContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}_${targetLanguage}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Download Started", description: `Your translated file is being downloaded.` });
  };


  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        // Don't reset originalContent here on close to persist it until next open
        setTranslatedContent("");
        setTransliteration(null);
        setIsTranslating(false);
        if (isDocumentMode) {
          setOriginalContent("");
          setFileName("document");
        }
    }
    onOpenChange(isOpen);
  }
  
  useEffect(() => {
    if (open) {
      setOriginalContent(noteContent);
    }
  }, [open, noteContent]);


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline">
            <Languages className="h-5 w-5 text-primary" />
            {isDocumentMode ? "Translate Document" : "Translate Note"}
          </DialogTitle>
          <DialogDescription>
             {isDocumentMode 
                ? "Import a file, translate its content, and save or download the result."
                : `Translate ${isSelection ? "your selection" : "the note content"}. The original will be saved to history if you replace it.`
             }
          </DialogDescription>
        </DialogHeader>
        
         <div className="flex flex-col sm:flex-row items-center gap-4 my-4">
            {isDocumentMode && (
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="mr-2 h-4 w-4" /> Import File
                </Button>
            )}
            <Input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".txt,.html" />

            <div className="grid grid-cols-2 gap-4 w-full sm:w-auto">
                <p className="text-sm font-medium text-right my-auto">Translate to:</p>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    {supportedLanguages.map(lang => (
                    <SelectItem key={lang.name} value={lang.name}>
                        <div className="flex items-center gap-2">
                        {lang.name}
                        {lang.premium && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                        </div>
                    </SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
            <Button onClick={handleTranslate} disabled={isTranslating || !originalContent} className="w-full sm:w-auto">
                {isTranslating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Translate
            </Button>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh]">
            <div>
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Original</h3>
                <ScrollArea className="rounded-md border p-4 h-full bg-secondary/20">
                    <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: originalContent || "<p>Nothing to translate.</p>"}} />
                </ScrollArea>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Translation ({targetLanguage})</h3>
                <ScrollArea className="rounded-md border p-4 flex-1">
                    {isTranslating ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: translatedContent || `<p>Translation will appear here.</p>` }} />
                    )}
                </ScrollArea>
                {transliteration && (
                  <>
                    <h3 className="text-sm font-semibold text-muted-foreground mt-2">Romanization</h3>
                    <ScrollArea className="rounded-md border p-4 h-24 bg-muted/30">
                       <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: transliteration }} />
                    </ScrollArea>
                  </>
                )}
            </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
             {isDocumentMode ? (
                <>
                    <Button variant="secondary" onClick={handleSaveAsNewNote} disabled={!translatedContent || isTranslating}>
                        <Save className="mr-2 h-4 w-4" /> Save as New Note
                    </Button>
                    <Button variant="default" onClick={handleDownload} disabled={!translatedContent || isTranslating}>
                        <FileDown className="mr-2 h-4 w-4" /> Download
                    </Button>
                </>
             ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="default" disabled={!translatedContent || isTranslating}>
                            <Replace className="mr-2 h-4 w-4" />
                            Replace Original
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will replace your original content with the translation. The original version will be saved in your note's history.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleReplaceClick}>Replace</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}
