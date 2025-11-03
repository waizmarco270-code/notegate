
export type Note = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  password: string | null;
  isFavorite?: boolean;
};

export type UserProfile = {
  id: string;
  uid: string;
  name: string;
  username: string;
  email: string;
  photoURL?: string;
}

// Represents the snapshot of note data embedded in a share request
export type NoteDataSnapshot = {
  title: string;
  content: string;
  category: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SharedNote = {
  id: string;
  fromUserId: string;
  toUserId: string;
  noteId: string;
  noteData: NoteDataSnapshot; // Embed the note data directly
  status: "pending" | "accepted" | "rejected";
  createdAt: string; // Should be a server timestamp, but string for type consistency
};
