'use client';

import { createContext, useContext } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

interface FirebaseClientContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

const FirebaseClientContext = createContext<FirebaseClientContextValue>({
  app: null,
  auth: null,
  firestore: null,
});

export function FirebaseClientProvider({
  children,
  app,
  auth,
  firestore,
}: {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}) {
  return (
    <FirebaseClientContext.Provider value={{ app, auth, firestore }}>
      {children}
    </FirebaseClientContext.Provider>
  );
}

export const useFirebaseClient = () => {
  return useContext(FirebaseClientContext);
};
