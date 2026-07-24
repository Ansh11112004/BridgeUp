import { useEffect, useState } from "react";

// Returns a version of `value` that only updates after `delay` ms of inactivity.
// Used to avoid firing an API request on every keystroke in search boxes.
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}
