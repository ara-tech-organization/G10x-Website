import { useEffect, useState } from 'react'

/** Subscribe to a media query. SSR-safe, returns `false` before hydration. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

/** Below the `lg` breakpoint — the point where two-pane layouts stop working. */
export const useIsTablet = () => useMediaQuery('(max-width: 1023px)')
export const usePrefersReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)')
