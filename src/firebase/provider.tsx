"use client";

import { createContext, useContext, useMemo } from "react";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
import { FirebaseClientProvider, initializeFirebase } from ".";

type FirebaseContextValue = {
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
};

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

export function FirebaseProvider({ children }: { children: React.ReactNode }) {
  const { app, auth, firestore } = useMemo(initializeFirebase, []);
  
  return (
    <FirebaseContext.Provider value={{ app, auth, firestore }}>
      <FirebaseClientProvider app={app} auth={auth} firestore={firestore}>
        {children}
      </FirebaseClientProvider>
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};

export const useFirebaseApp = () => useFirebase().app;
export const useAuth = () => useFirebase().auth;
export const useFirestore = () => useFirebase().firestore;
