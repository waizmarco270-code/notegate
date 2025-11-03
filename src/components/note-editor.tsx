
"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Star, MoreVertical, Folder, Copy, TextSelect, FileDown, Trash2, Sparkles, Lock, Unlock, Tag, Share2, History, Plus, Ear, Languages, Replace, Loader2, PanelRightClose, X, Users } from "lucide-react";
import { useNotes } from "@/context/notes-provider";
import type { Note } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EditorToolbar } from "@/components/editor-toolbar";
import { PasswordDialog } from "@/components/password-dialog";
import { ManageCategoriesDialog } from "./manage-categories-dialog";
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { summarizeNoteAction, generateTagsAction, textToSpeechAction, translateNoteAction } from "@/lib/actions";
import { SummaryDialog } from "./summary-dialog";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { CategoryPopover } from "./category-popover";
import { Badge } from "./ui/badge";
import { useUser } from "@/firebase";
import { ShareDialog } from "./share-dialog";
import { NoteHistoryDialog } from "./note-history-dialog";
import { AudioPlayerDialog } from "./audio-player-dialog";
import { TranslateDialog } from "./translate-dialog";
import { debounce } from "lodash";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { WhatsappLogo } from "./icons";

interface NoteEditorProps {
  note: Note;
}

const supportedLanguages = [
  { name: "English", premium: false }, { name: "Spanish", premium: false }, { name: "French", premium: false }, { name: "German", premium: false }, { name: "Hindi", premium: false }, { name: "Hinglish", premium: true }, { name: "Arabic", premium: false }, { name: "Mandarin Chinese", premium: false }, { name: "Japanese", premium: false }, { name: "Russian", premium: false }, { name: "Portuguese", premium: false },
];

export function NoteEditor({ note }: NoteEditorProps) {
  const { updateNote, deleteNote } = useNotes();
  const { toast } = useToast();
  const { user } = useUser();
  const [title, setTitle] = useState(note.title);
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [isCategoriesDialogOpen, setCategoriesDialogOpen] = useState(false);
  const [isShareDialogOpen, setShareDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setHistoryDialogOpen] = useState(false);
  const [isTranslateDialogOpen, setTranslateDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(note.isFavorite ?? false);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summary, setSummary] = useState("");
  const [isSummaryDialogOpen, setSummaryDialogOpen] = useState(false);
  const [fontSize, setFontSize] = useLocalStorage("editor-font-size", "16px");
  const [fontFamily, setFontFamily] = useLocalStorage("editor-font-family", "Arial");
  const [currentColor, setCurrentColor] = useLocalStorage("editor-current-color", "#000000");
  const [applyToAll, setApplyToAll] = useState(false);
  const [tags, setTags] = useState(note.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isAudioPlayerOpen, setAudioPlayerOpen] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  // States for Bilingual Mode
  const [isBilingualMode, setIsBilingualMode] = useState(false);
  const [bilingualTargetLanguage, setBilingualTargetLanguage] = useState("Hinglish");
  const [bilingualTranslatedContent, setBilingualTranslatedContent] = useState("");
  const [isBilingualTranslating, setIsBilingualTranslating] = useState(false);

  // States for Selection Popover
  const [selectionPopoverOpen, setSelectionPopoverOpen] = useState(false);
  const [selectionRange, setSelectionRange] = useState<Range | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (title !== note.title) {
        updateNote({ id: note.id, title });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, note.id, note.title, updateNote]);

  useEffect(() => {
    setIsFavorite(note.isFavorite ?? false);
    setTitle(note.title);
    setTags(note.tags || []);
    if (contentRef.current && note.content !== contentRef.current.innerHTML) {
      contentRef.current.innerHTML = note.content || "";
    }
  }, [note]);
  
  useEffect(() => {
    const handleMouseUp = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            if (!range.collapsed && contentRef.current?.contains(range.commonAncestorContainer)) {
                setSelectionRange(range);
                setSelectionPopoverOpen(true);
            } else {
                setSelectionPopoverOpen(false);
            }
        } else {
            setSelectionPopoverOpen(false);
        }
    };
    
    const editorDiv = contentRef.current;
    editorDiv?.addEventListener('mouseup', handleMouseUp);
    
    // Hide popover on scroll or click outside
    const handleClickOutside = (event: MouseEvent) => {
        if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
            setSelectionPopoverOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        editorDiv?.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const debouncedTranslate = useMemo(
    () =>
      debounce(async (content: string, language: string) => {
        if (!content || !language || !isBilingualMode) {
            setIsBilingualTranslating(false);
            return;
        }
        setIsBilingualTranslating(true);
        const result = await translateNoteAction({ noteContent: content, targetLanguage: language });
        setIsBilingualTranslating(false);
        if (result.translatedContent) {
            setBilingualTranslatedContent(result.translatedContent);
        } else {
            setBilingualTranslatedContent(`<p class="text-destructive">${result.error || "Translation failed."}</p>`);
        }
      }, 1000), 
    [isBilingualMode]
  );
  
  const handleContentChange = () => {
    const currentContent = contentRef.current?.innerHTML || "";
    if (isBilingualMode) {
        setIsBilingualTranslating(true);
        debouncedTranslate(currentContent, bilingualTargetLanguage);
    }
  };

  const handleContentBlur = () => {
    const currentContent = contentRef.current?.innerHTML || "";
    if (currentContent !== note.content) {
      updateNote({ id: note.id, content: currentContent });
    }
  };


  const handlePasswordSet = (password: string | null) => {
    updateNote({ id: note.id, password });
    setPasswordDialogOpen(false);
  };
  
  const handleCategoryUpdate = (category: string | null) => {
    updateNote({ id: note.id, category });
  };

  const toggleFavorite = () => {
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    updateNote({ id: note.id, isFavorite: newIsFavorite });
  };
  
  const handleCopyNote = () => {
    if (contentRef.current) {
        navigator.clipboard.writeText(contentRef.current.innerText);
        toast({ title: "Note content copied to clipboard." });
    }
  };

  const handleSelectAll = () => {
    if (contentRef.current) {
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
    }
  };

  const handleExport = (format: "txt" | "html") => {
    let fileContent = "";
    let mimeType = "text/plain";
    let fileExtension = "txt";

    if (contentRef.current) {
        if (format === 'html') {
          fileContent = `<!DOCTYPE html><html><head><title>${title}</title></head><body><div style="font-size: ${fontSize}; font-family: ${fontFamily};">${contentRef.current.innerHTML}</div></body></html>`;
          mimeType = "text/html";
          fileExtension = "html";
        } else {
            fileContent = contentRef.current.innerText;
        }
    }


    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_') || 'note'}.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: `Note exported as ${fileExtension.toUpperCase()}.` });
  };

  const handleSummarize = async () => {
    const content = contentRef.current?.innerText || '';
    if (!content) {
      toast({
        variant: "destructive",
        title: "Cannot summarize an empty note.",
      });
      return;
    }
    setIsSummarizing(true);
    const result = await summarizeNoteAction({ noteContent: content });
    setIsSummarizing(false);

    if (result.summary) {
      setSummary(result.summary);
      setSummaryDialogOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Summarization failed.",
        description: result.error || "An unknown error occurred.",
      });
    }
  };
  
  const applyStyleToAll = (style: Partial<CSSStyleDeclaration>) => {
    if (contentRef.current) {
      Object.assign(contentRef.current.style, style);
      handleContentBlur(); // Save the note after applying style
    }
  };

  const handleFontSizeChange = (size: string) => {
    const finalSize = size.endsWith('px') ? size : `${size}px`;
    setFontSize(finalSize);
    if (applyToAll && contentRef.current) {
      applyStyleToAll({ fontSize: finalSize });
    }
  };

  const handleFontFamilyChange = (font: string) => {
    setFontFamily(font);
    if (applyToAll && contentRef.current) {
      applyStyleToAll({ fontFamily: font });
    }
  };
  
  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    handleFormat('foreColor', color);
  };
  
  const handleInsertList = (type: "insertUnorderedList" | "insertOrderedList") => {
    if(contentRef.current) {
      contentRef.current.focus();
      document.execCommand(type, false, undefined);
      handleContentBlur();
    }
  };

  const handleFormat = (command: string, value?: string) => {
    if (contentRef.current) {
      contentRef.current.focus();
      if (applyToAll) {
        document.execCommand("selectAll", false, undefined);
      }
      document.execCommand(command, false, value);
      if (applyToAll) {
        const selection = window.getSelection();
        selection?.collapseToEnd();
      }
      handleContentBlur();
    }
  };
  
  const handleConvertCase = (caseType: 'upper' | 'lower' | 'title' | 'sentence') => {
    if (!contentRef.current) return;
    contentRef.current.focus();

    const selection = window.getSelection();
    let textToConvert = "";
    let isFullContent = false;
    let range: Range | undefined;

    if (applyToAll || !selection || selection.rangeCount === 0 || selection.toString().trim() === '') {
        textToConvert = contentRef.current.innerText;
        isFullContent = true;
    } else {
        range = selection.getRangeAt(0);
        textToConvert = range.toString();
    }

    if (!textToConvert) return;
    
    let convertedText = "";
    switch (caseType) {
        case 'upper':
            convertedText = textToConvert.toUpperCase();
            break;
        case 'lower':
            convertedText = textToConvert.toLowerCase();
            break;
        case 'title':
            convertedText = textToConvert.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
            break;
        case 'sentence':
            convertedText = textToConvert.toLowerCase().replace(/(^\w{1}|\.\s*\w{1})/g, char => char.toUpperCase());
            break;
    }

    if (isFullContent) {
        contentRef.current.innerText = convertedText;
    } else if (selection && range) {
        range.deleteContents();
        range.insertNode(document.createTextNode(convertedText));
    }
    handleContentBlur();
  };

  const handleInsertImage = () => {
    imageInputRef.current?.click();
  };

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) { // 2MB limit for warning
      toast({
        variant: "destructive",
        title: "Large Image Warning",
        description: "Images are stored locally and large files can slow down the app. Consider using smaller images.",
      });
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL(file.type, 0.8); // Compress to 80% quality
        const imgTag = `<img src="${dataUrl}" style="max-width: 100%; height: auto; border-radius: 0.5rem;" />`;
        
        if (contentRef.current) {
          contentRef.current.focus();
          document.execCommand("insertHTML", false, imgTag);
          handleContentBlur();
        }
      };
    };
    reader.readAsDataURL(file);

    // Reset file input
    if (e.target) e.target.value = '';
  };
  
  const handleGenerateTags = async () => {
    const content = contentRef.current?.innerText || '';
    if (!content) {
      toast({ variant: "destructive", title: "Cannot generate tags for an empty note." });
      return;
    }
    setIsGeneratingTags(true);
    setSuggestedTags([]);
    const result = await generateTagsAction({ noteContent: content });
    setIsGeneratingTags(false);

    if (result.tags) {
      setSuggestedTags(result.tags.filter(tag => !tags.includes(tag)));
    } else {
      toast({ variant: "destructive", title: "Failed to generate tags.", description: result.error || "An unknown error occurred." });
    }
  };
  
  const addTag = (tag: string) => {
    const newTag = tag.trim().toLowerCase();
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      updateNote({ id: note.id, tags: newTags });
    }
  };

  const handleAddTagFromInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput) {
      e.preventDefault();
      addTag(tagInput);
      setTagInput("");
    }
  };
  
  const handleAddSuggestedTag = (tag: string) => {
    addTag(tag);
    setSuggestedTags(suggestedTags.filter(t => t !== tag));
  };


  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    updateNote({ id: note.id, tags: newTags });
  };

  const handleListenToNote = async () => {
    const content = contentRef.current?.innerText || '';
     if (!content) {
      toast({ variant: "destructive", title: "Cannot listen to an empty note." });
      return;
    }
    setIsGeneratingAudio(true);
    setAudioSrc(null);
    setAudioPlayerOpen(true); // Open dialog to show loading state

    toast({ title: "Generating audio...", description: "This might take a moment." });

    const result = await textToSpeechAction({ text: content });
    setIsGeneratingAudio(false);

    if (result.audio) {
      setAudioSrc(result.audio);
    } else {
      setAudioPlayerOpen(false);
      toast({
        variant: "destructive",
        title: "Audio Generation Failed",
        description: result.error || "Could not generate audio for this note.",
      });
    }
  }

  const handleReplaceContent = (newContent: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && selectionRange) {
        selection.removeAllRanges();
        selection.addRange(selectionRange);
        document.execCommand('insertHTML', false, newContent);
    } else if (contentRef.current) {
        contentRef.current.innerHTML = newContent;
    }
    handleContentBlur();
    toast({ title: "Note content has been updated." });
  };

  const handleToggleBilingualMode = () => {
    const nextState = !isBilingualMode;
    setIsBilingualMode(nextState);
    if (nextState && contentRef.current?.innerHTML) {
      // Trigger translation when mode is enabled
      setIsBilingualTranslating(true);
      debouncedTranslate(contentRef.current.innerHTML, bilingualTargetLanguage);
    } else {
      // Clear content when disabled
      setBilingualTranslatedContent("");
    }
  };
  
  const handleApplyBilingualTranslation = () => {
    if (bilingualTranslatedContent && contentRef.current) {
      contentRef.current.innerHTML = bilingualTranslatedContent;
      handleContentBlur();
    }
  };
  
  useEffect(() => {
    if (isBilingualMode && contentRef.current?.innerHTML) {
        setIsBilingualTranslating(true);
        debouncedTranslate(contentRef.current.innerHTML, bilingualTargetLanguage);
    }
  }, [bilingualTargetLanguage, isBilingualMode, debouncedTranslate]);
  
  const getSelectedHTML = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (contentRef.current?.contains(range.commonAncestorContainer)) {
          const div = document.createElement("div");
          div.appendChild(range.cloneContents());
          return div.innerHTML;
        }
    }
    return note.content || "";
  }

  const handleShareOnWhatsApp = () => {
    const content = contentRef.current?.innerText || '';
    if (!content && !title) {
        toast({ variant: "destructive", title: "Cannot share an empty note." });
        return;
    }
    const whatsAppText = encodeURIComponent(`*${title}*\n\n${content}`);
    const url = `https://wa.me/?text=${whatsAppText}`;
    window.open(url, '_blank');
  };


  const wordCount = contentRef.current?.innerText.trim().split(/\s+/).filter(Boolean).length || 0;
  const isLocked = note.password !== null;

  return (
    <div className="flex flex-col h-full bg-card rounded-lg border">
      <header className="p-4 flex items-center justify-between gap-4">
        <div className="relative flex-1 group">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Note"
            className="text-2xl md:text-4xl font-bold font-headline border-none shadow-none focus-visible:ring-0 p-0 h-auto w-full bg-transparent tracking-wide text-primary"
          />
           <div className="absolute bottom-0 left-0 h-0.5 w-full bg-transparent group-focus-within:bg-gradient-to-r from-transparent via-primary to-transparent group-focus-within:animate-underline-grow" />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setShareDialogOpen(true)}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Share with NotesGate User</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleShareOnWhatsApp}>
                         <WhatsappLogo className="mr-2 h-4 w-4" />
                        <span>Share on WhatsApp</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button onClick={handleSummarize} disabled={isSummarizing} variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Sparkles className="h-4 w-4 mr-2" />
              {isSummarizing ? "Summarizing..." : "Summarize"}
            </Button>
            <span className="text-sm text-muted-foreground hidden sm:inline">{wordCount} words</span>
            <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                <Star className={cn("h-4 w-4", isFavorite ? "text-yellow-400 fill-yellow-400" : "")} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setPasswordDialogOpen(true)}>
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setTranslateDialogOpen(true)}>
                        <Languages className="mr-2 h-4 w-4" />
                        <span>Translate...</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleListenToNote} disabled={isGeneratingAudio}>
                        <Ear className="mr-2 h-4 w-4" />
                        <span>{isGeneratingAudio ? "Generating..." : "Listen to Note"}</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem onSelect={handleSummarize} disabled={isSummarizing} className="sm:hidden">
                        <Sparkles className="mr-2 h-4 w-4" />
                        <span>{isSummarizing ? "Summarizing..." : "Summarize"}</span>
                    </DropdownMenuItem>
                    {user && (
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                               <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="sm:hidden">
                                  <Share2 className="mr-2 h-4 w-4" />
                                  <span>Share</span>
                              </DropdownMenuItem>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="left" align="start">
                                <DropdownMenuItem onSelect={() => setShareDialogOpen(true)}>
                                    <Users className="mr-2 h-4 w-4" />
                                    <span>With NotesGate User</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onSelect={handleShareOnWhatsApp}>
                                    <WhatsappLogo className="mr-2 h-4 w-4" />
                                    <span>On WhatsApp</span>
                                </DropdownMenuItem>
                          </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    <DropdownMenuItem onSelect={() => setHistoryDialogOpen(true)}>
                        <History className="mr-2 h-4 w-4" />
                        <span>View History</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleCopyNote}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy Note</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={handleSelectAll}>
                        <TextSelect className="mr-2 h-4 w-4" />
                        <span>Select All</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => handleExport("txt")}>
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Export as TXT</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleExport("html")}>
                        <FileDown className="mr-2 h-4 w-4" />
                        <span>Export as HTML</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onSelect={(e) => e.preventDefault()}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Note</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the note. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </header>

      <div className="px-4 pb-2 flex items-center flex-wrap gap-2">
        <CategoryPopover
            note={note}
            onUpdateCategory={handleCategoryUpdate}
            onOpenManageCategories={() => setCategoriesDialogOpen(true)}
        >
            {note.category ? (
                <Badge variant="secondary" className="cursor-pointer hover:bg-muted">
                    <Folder className="h-3 w-3 mr-1.5" />
                    {note.category}
                </Badge>
            ) : (
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Folder className="h-4 w-4 mr-2" />
                    Category
                </Button>
            )}
        </CategoryPopover>

        <div className="flex items-center gap-2 flex-wrap">
            {tags.map(tag => (
              <Badge key={tag} variant="outline" className="group">
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-1.5 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
             <Input 
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTagFromInput}
                placeholder="Add a tag..."
                className="h-7 w-28 text-xs border-dashed"
            />
        </div>
        
        <Button onClick={handleGenerateTags} disabled={isGeneratingTags} variant="ghost" size="sm" className="text-muted-foreground">
            <Sparkles className="h-4 w-4 mr-2" />
            {isGeneratingTags ? "Suggesting..." : "Suggest Tags"}
        </Button>
      </div>

       {suggestedTags.length > 0 && (
          <div className="px-4 pb-4 flex items-center flex-wrap gap-2">
              <p className="text-xs text-muted-foreground mr-2">Suggestions:</p>
              {suggestedTags.map(tag => (
                <Badge key={tag} variant="default" className="cursor-pointer bg-primary/10 text-primary hover:bg-primary/20" onClick={() => handleAddSuggestedTag(tag)}>
                    <Plus className="h-3 w-3 mr-1" />
                    {tag}
                </Badge>
              ))}
          </div>
        )}
      
      <EditorToolbar 
        fontSize={fontSize}
        onFontSizeChange={handleFontSizeChange}
        fontFamily={fontFamily}
        onFontFamilyChange={handleFontFamilyChange}
        currentColor={currentColor}
        onColorChange={handleColorChange}
        onInsertUnorderedList={() => handleInsertList("insertUnorderedList")}
        onInsertOrderedList={() => handleInsertList("insertOrderedList")}
        onInsertImage={handleInsertImage}
        onFormat={handleFormat}
        onConvertCase={handleConvertCase}
        applyToAll={applyToAll}
        onApplyToAllChange={setApplyToAll}
        isBilingualMode={isBilingualMode}
        onToggleBilingualMode={handleToggleBilingualMode}
      />
      
      <Popover open={selectionPopoverOpen} onOpenChange={setSelectionPopoverOpen}>
          <PopoverTrigger asChild>
            <div style={{
                position: 'absolute',
                top: `${selectionRange ? selectionRange.getBoundingClientRect().top - 40 : 0}px`,
                left: `${selectionRange ? selectionRange.getBoundingClientRect().left + selectionRange.getBoundingClientRect().width / 2 : 0}px`,
                transform: 'translateX(-50%)',
            }} />
          </PopoverTrigger>
          <PopoverContent className="w-auto p-1">
             <Button variant="ghost" size="sm" onClick={() => setTranslateDialogOpen(true)}>
                <Languages className="h-4 w-4 mr-2"/>
                Translate
             </Button>
          </PopoverContent>
      </Popover>
      
      <div className={cn("flex-1 overflow-hidden flex", isBilingualMode ? "flex-row" : "flex-col")}>
        <div className={cn("overflow-auto p-4 sm:p-6 relative", isBilingualMode ? "w-1/2" : "w-full h-full")}>
            <div
              ref={contentRef}
              contentEditable={true}
              onBlur={handleContentBlur}
              onInput={handleContentChange}
              dangerouslySetInnerHTML={{ __html: note.content }}
              data-placeholder="Start writing..."
              className="h-full w-full outline-none text-base empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
              style={{ fontSize, fontFamily }}
            />
        </div>
         {isBilingualMode && (
          <>
            <Separator orientation="vertical" />
            <div className="w-1/2 flex flex-col p-2 bg-secondary/30">
                <div className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-2">
                         <p className="text-sm font-medium">Translate to:</p>
                        <Select value={bilingualTargetLanguage} onValueChange={setBilingualTargetLanguage}>
                            <SelectTrigger className="w-auto h-8 text-xs">
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
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" disabled={!bilingualTranslatedContent || isBilingualTranslating}>
                                <Replace className="mr-2 h-4 w-4" />
                                Apply
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
                                <AlertDialogAction onClick={handleApplyBilingualTranslation}>Replace</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                 <ScrollArea className="flex-1 rounded-md border bg-background p-4 sm:p-6 m-2 mt-0">
                    {isBilingualTranslating ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: bilingualTranslatedContent || `<p class="text-muted-foreground">Translation will appear here.</p>` }} />
                    )}
                </ScrollArea>
            </div>
          </>
        )}
      </div>
      
      <input
        type="file"
        ref={imageInputRef}
        onChange={onImageChange}
        className="hidden"
        accept="image/*"
      />

      <PasswordDialog
        open={isPasswordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        mode={isLocked ? "update" : "set"}
        onSetPassword={handlePasswordSet}
      />
      
      <ManageCategoriesDialog
        open={isCategoriesDialogOpen}
        onOpenChange={setCategoriesDialogOpen}
        note={note}
        onUpdateCategory={handleCategoryUpdate}
      />
      <SummaryDialog
        open={isSummaryDialogOpen}
        onOpenChange={setSummaryDialogOpen}
        summary={summary}
      />
       <NoteHistoryDialog
        open={isHistoryDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        note={note}
      />
       <TranslateDialog
        open={isTranslateDialogOpen}
        onOpenChange={setTranslateDialogOpen}
        noteContent={getSelectedHTML()}
        onReplaceContent={handleReplaceContent}
        isSelection={selectionPopoverOpen}
      />
      {user && (
        <ShareDialog 
          open={isShareDialogOpen}
          onOpenChange={setShareDialogOpen}
          noteId={note.id}
          currentUserId={user.uid}
        />
      )}
       <AudioPlayerDialog
        open={isAudioPlayerOpen}
        onOpenChange={setAudioPlayerOpen}
        audioSrc={audioSrc}
        noteTitle={title}
      />
    </div>
  );
}

    
