
'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  onSnapshot,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  type Query,
  type DocumentData,
} from 'firebase/firestore';
import type { FirebaseError } from 'firebase/app';
import { useFirestore } from '../provider';

interface UseCollectionOptions {
  // Add any options you need for your queries, e.g.
  // where?: [string, any, any];
  // orderBy?: [string, 'asc' | 'desc'];
  // limit?: number;
}

export const useCollection = <T extends DocumentData>(
  q: Query<DocumentData> | null,
  options?: UseCollectionOptions
) => {
  const [data, setData] = useState< (T & { id: string })[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);

  useEffect(() => {
    if (!q) {
        setData([]);
        setLoading(false);
        return;
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const results: (T & { id: string })[] = [];
        snapshot.forEach((doc) => {
          results.push({ id: doc.id, ...doc.data() } as T & { id: string });
        });
        setData(results);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [q]); // useMemo will handle query stability

  return { data, loading, error };
};
