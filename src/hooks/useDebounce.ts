'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g., search queries, filter inputs).
 * Prevents excessive API queries while typing.
 */
export function useDebounce<T>(value: T, delay: number = 250): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
