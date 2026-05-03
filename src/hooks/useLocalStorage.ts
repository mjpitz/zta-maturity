import { useState, useCallback } from 'react';

/**
 * Custom hook for managing state with localStorage persistence
 * @param key - The key to use in localStorage
 * @param initialValue - The initial value if nothing is in localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Get initial state from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage whenever the state changes
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      setStoredValue(currentValue => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error saving localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

/**
 * Clear a specific key from localStorage
 */
export function clearLocalStorage(key: string) {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Error clearing localStorage key "${key}":`, error);
  }
}

/**
 * Clear all assessment-related data from localStorage
 */
export function clearAssessmentData() {
  clearLocalStorage('zta-assessment-state');
  clearLocalStorage('zta-assessment-results');
}
