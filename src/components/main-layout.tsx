'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { NoteView } from '@/components/note-view';
import { useNotes } from '@/context/notes-provider';
import { PasswordDialog } from '@/components/password-dialog';
import type { Note } from '@/lib/types';
import { ManageCategoriesDialog } from './manage-categories-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { HiddenVault } from './hidden-vault';
import { MobileBottomNav } from './mobile-bottom-nav';
import { Search } from 'lucide-react';
import { Input } from './ui/input';
import { NoteList } from './note-list';
import { DeleteNoteDialog } from './delete-note-dialog';
import { MobileSidebar } from './mobile-sidebar';
import { TemplateDialog } from './template-dialog';

export function MainLayout() {
  const {
    notes,
    createNote,
    activeNote,
    setActiveNoteId,
    deleteNote,
    updateNote,
  } = useNotes();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [passwordNote, setPasswordNote] = useState<Note | null>(null);
  const [categoryNote, setCategoryNote] = useState<Note | null>(null);
  const [isVaultOpen, setVaultOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [isTemplateOpen, setTemplateOpen] = useState(false);
  const isMobile = useIsMobile();
  const [activeMobileTab, setActiveMobileTab] = useState('home');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenVault = () => setVaultOpen(true);

  useEffect(() => {
    setIsClient(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleOpenVault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const visibleNotes = notes.filter((note) => !note.isHidden);

  const filteredNotes = visibleNotes
    .filter((note) => {
      const matchesSearch =
        (note.title &&
          note.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.content &&
          note.content.toLowerCase().includes(searchTerm.toLowerCase()));

      if (categoryFilter === 'Favorites') {
        return matchesSearch && note.isFavorite;
      }

      const matchesCategory =
        categoryFilter === null || note.category === categoryFilter;

      return matchesSearch && matchesCategory;
    })
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  const handleSelectCategory = (category: string | null) => {
    if (category === 'All Notes') {
      setCategoryFilter(null);
      setActiveNoteId(null);
    } else {
      setCategoryFilter(category);
    }
    setActiveMobileTab('home'); // Switch to home tab on category selection
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean) => {
    updateNote({ id, isFavorite });
  };

  const handlePasswordSet = (password: string | null, hideNote?: boolean) => {
    if (passwordNote) {
      updateNote({ id: passwordNote.id, password, isHidden: hideNote });
    }
    setPasswordNote(null);
  };

  const handleCategoryUpdate = (category: string | null) => {
    if (categoryNote) {
      updateNote({ id: categoryNote.id, category });
    }
  };

  const handleSelectNote = (id: string) => {
    setActiveNoteId(id);
  };
  
  const handleConfirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      setNoteToDelete(null);
    }
  };

  if (!isClient) {
    return null;
  }

  if (isMobile) {
    if (activeNote) {
      return (
        <div className="h-screen w-full bg-background overflow-hidden">
          <NoteView key={activeNote.id} />
        </div>
      );
    }
    return (
      <>
        <div className="h-screen w-full bg-background flex flex-col">
          <main className="flex-1 overflow-y-auto p-4 pb-20">
            {activeMobileTab === 'home' && (
              <div className="animate-fade-in">
                 <h1 className="text-2xl font-bold text-foreground mb-4">{categoryFilter || 'All Notes'}</h1>
                <NoteList
                  notes={filteredNotes}
                  activeNoteId={activeNote?.id ?? null}
                  onSelectNote={handleSelectNote}
                  onInitiateDelete={setNoteToDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onSetPassword={setPasswordNote}
                  onSetCategory={setCategoryNote}
                />
              </div>
            )}
             {activeMobileTab === 'search' && (
              <div className="animate-fade-in">
                 <h1 className="text-2xl font-bold text-foreground mb-4">Search</h1>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search notes..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                 <NoteList
                  notes={filteredNotes}
                  activeNoteId={null}
                  onSelectNote={handleSelectNote}
                  onInitiateDelete={setNoteToDelete}
                  onToggleFavorite={handleToggleFavorite}
                  onSetPassword={setPasswordNote}
                  onSetCategory={setCategoryNote}
                />
              </div>
            )}
          </main>
          <MobileBottomNav
            activeTab={activeMobileTab}
            setActiveTab={setActiveMobileTab}
            onMenuClick={() => setMobileMenuOpen(true)}
            onNewNote={createNote}
          />
        </div>
         <MobileSidebar
          open={isMobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
          onOpenVault={() => {
            setMobileMenuOpen(false);
            handleOpenVault();
          }}
          onSelectCategory={(cat) => {
            handleSelectCategory(cat);
            setMobileMenuOpen(false);
          }}
          activeCategory={categoryFilter}
        />
        {passwordNote && (
          <PasswordDialog
            open={!!passwordNote}
            onOpenChange={(isOpen) => !isOpen && setPasswordNote(null)}
            mode={passwordNote.password ? 'update' : 'set'}
            onSetPassword={handlePasswordSet}
          />
        )}
        {categoryNote && (
          <ManageCategoriesDialog
            open={!!categoryNote}
            onOpenChange={(isOpen) => !isOpen && setCategoryNote(null)}
            note={categoryNote}
            onUpdateCategory={handleCategoryUpdate}
          />
        )}
        <HiddenVault open={isVaultOpen} onOpenChange={setVaultOpen} />
         <DeleteNoteDialog
            open={!!noteToDelete}
            onOpenChange={(isOpen) => !isOpen && setNoteToDelete(null)}
            note={noteToDelete}
            onConfirmDelete={handleConfirmDelete}
        />
        <TemplateDialog open={isTemplateOpen} onOpenChange={setTemplateOpen} />
      </>
    );
  }

  return (
    <>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <Sidebar
          notes={filteredNotes}
          activeNoteId={activeNote?.id ?? null}
          onSelectNote={handleSelectNote}
          onNewNote={createNote}
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onSelectCategory={handleSelectCategory}
          activeCategory={categoryFilter}
          onInitiateDelete={setNoteToDelete}
          onToggleFavorite={handleToggleFavorite}
          onSetPassword={setPasswordNote}
          onSetCategory={setCategoryNote}
          onOpenVault={handleOpenVault}
        />
        <main className="flex-1 flex flex-col overflow-auto">
          <NoteView key={activeNote?.id} onInitiateDelete={setNoteToDelete} onOpenTemplates={() => setTemplateOpen(true)} />
        </main>
      </div>
      {passwordNote && (
        <PasswordDialog
          open={!!passwordNote}
          onOpenChange={(isOpen) => !isOpen && setPasswordNote(null)}
          mode={passwordNote.password ? 'update' : 'set'}
          onSetPassword={handlePasswordSet}
        />
      )}
      {categoryNote && (
        <ManageCategoriesDialog
          open={!!categoryNote}
          onOpenChange={(isOpen) => !isOpen && setCategoryNote(null)}
          note={categoryNote}
          onUpdateCategory={handleCategoryUpdate}
        />
      )}
      <HiddenVault open={isVaultOpen} onOpenChange={setVaultOpen} />
       <DeleteNoteDialog
            open={!!noteToDelete}
            onOpenChange={(isOpen) => !isOpen && setNoteToDelete(null)}
            note={noteToDelete}
            onConfirmDelete={handleConfirmDelete}
        />
        <TemplateDialog open={isTemplateOpen} onOpenChange={setTemplateOpen} />
    </>
  );
}
