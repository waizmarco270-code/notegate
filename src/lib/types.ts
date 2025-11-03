
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
