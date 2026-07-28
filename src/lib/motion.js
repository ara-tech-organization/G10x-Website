/**
 * Shared motion vocabulary. Every section pulls from here so the whole page
 * accelerates and settles with one consistent physical feel.
 */

export const EASE = {
  /** Signature: fast departure, long glide. Used for almost all reveals. */
  expo: [0.16, 1, 0.3, 1],
  /** Symmetrical, for morphs and layout shifts. */
  quint: [0.83, 0, 0.17, 1],
  /** Slight overshoot, for magnetic / springy affordances. */
  back: [0.34, 1.36, 0.64, 1],
}

export const SPRING = {
  /** Magnetic affordances: light, quick to return, no visible overshoot. */
  magnetic: { type: 'spring', stiffness: 260, damping: 18, mass: 0.4 },
}

/** Default viewport config: fire once, slightly before fully in view. */
export const VIEWPORT = { once: true, margin: '-12% 0px -12% 0px' }

export const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: EASE.expo },
  },
}

/** Blur-in: reads as "coming into focus at speed". */
export const focusIn = {
  hidden: { opacity: 0, y: 26, filter: 'blur(12px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 1, ease: EASE.expo },
  },
}

/** Panels rising out of the road surface. */
export const riseFromFloor = {
  hidden: { opacity: 0, y: 70, rotateX: -14 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1.05, ease: EASE.expo },
  },
}

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/** Per-word headline reveal — the workhorse for display type. */
export const wordReveal = {
  hidden: { y: '110%', opacity: 0 },
  show: {
    y: '0%',
    opacity: 1,
    transition: { duration: 1.05, ease: EASE.expo },
  },
}
