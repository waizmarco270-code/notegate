"use client";

import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    let value: T;
    try {
      const item = window.localStorage.getItem(key);
      value = item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      value = initialValue;
    }
    setStoredValue(value);
  }, [key, initialValue]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(error);
      }
    }
  }, [key, storedValue]);
  
  const setValue = (value: T) => {
    setStoredValue(value);
  }

  return [storedValue, setValue];
}
