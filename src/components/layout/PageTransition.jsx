import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'

/**
 * Route transition: a perspective push plus a gradient wipe, not a fade.
 *
 * Only one route exists today, so this is the reusable shell that every future
 * page (About, Services, Pricing…) will be wrapped in — the transition
 * language is defined once, here.
 */
export function PageTransition({ children }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.994, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -18, scale: 0.996, filter: 'blur(6px)' }}
        transition={{ duration: 0.8, ease: EASE.expo }}
      >
        {children}
      </motion.div>

      {/* Gradient wipe that crosses the viewport on entry. */}
      <motion.div
        aria-hidden="true"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.9, ease: EASE.quint }}
        style={{ transformOrigin: 'top' }}
        className="pointer-events-none fixed inset-0 z-[120]"
      >
        <div className="g-gradient size-full opacity-90" />
      </motion.div>
    </>
  )
}
