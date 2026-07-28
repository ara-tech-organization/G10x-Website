import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  readStoredTheme,
} from '@/hooks/useTheme'

/**
 * Owns the document's theme attribute and mirrors it to localStorage.
 *
 * Initial state is read back off <html> rather than recomputed, so React and
 * the pre-paint script in index.html can never disagree on the first render.
 */
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    // Drives the UA's own surfaces — form controls, the scrollbar gutter and
    // the canvas behind overscroll. Without it the light theme keeps a dark
    // scrollbar and dark autofill backgrounds.
    root.style.colorScheme = theme

    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // Safari private mode throws on write. The theme still applies for this
      // session; only the persistence is lost, which is not worth handling.
    }
  }, [theme])

  // Keep duplicate tabs in step — a preference that only half-applies across
  // a user's open tabs reads as a bug.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== THEME_STORAGE_KEY) return
      if (e.newValue === 'light' || e.newValue === 'dark') setTheme(e.newValue)
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggle = useCallback(
    () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    [],
  )

  const value = useMemo(
    () => ({ theme, isLight: theme === 'light', toggle, setTheme }),
    [theme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
