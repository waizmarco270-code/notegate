"use client";

import { doc, setDoc, serverTimestamp, type Firestore } from "firebase/firestore";
import type { User } from "firebase/auth";

type UserProfileData = {
  name: string;
  username: string;
  email: string;
};

export const createUserProfile = async (
  firestore: Firestore,
  user: User,
  data: UserProfileData
) => {
  const userRef = doc(firestore, "users", user.uid);
  const profileData = {
    uid: user.uid,
    name: data.name,
    username: data.username,
    email: data.email,
    createdAt: serverTimestamp(),
  };
  await setDoc(userRef, profileData);
};
