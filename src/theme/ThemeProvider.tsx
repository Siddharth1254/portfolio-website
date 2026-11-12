import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { THEME_STORAGE_KEY, ThemeContext } from './ThemeContext';

/* The pre-paint script in index.html applies body.light before React mounts;
   canvases and the 3D scene read that class directly every frame. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [light, setLight] = useState(() => document.body.classList.contains('light'));

  const toggleTheme = useCallback(() => {
    setLight((prev) => {
      const next = !prev;
      document.body.classList.toggle('light', next);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next ? 'light' : 'dark');
      } catch {
        /* storage can be unavailable (private mode) */
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ light, toggleTheme }), [light, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
