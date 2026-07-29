import { createContext, useContext } from 'react'

/**
 * Theme plumbing.
 *
 * The context and the hook live here rather than beside <ThemeProvider>
 * because `react-refresh/only-export-components` rejects a module that
 * exports both a component and a plain function.
 *
 * The document's `data-theme` attribute is the single source of truth — it is
 * set by the inline script in index.html before first paint, so this module
 * reads it rather than owning a default of its own. Two defaults would drift.
 */
export const THEME_STORAGE_KEY = 'g10x-theme'

export const ThemeContext = createContext(null)

/** Whatever the pre-paint script decided. Never guesses. */
export function readStoredTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark'
    ? 'dark'
    : 'light'
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}
