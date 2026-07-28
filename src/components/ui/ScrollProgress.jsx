import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Page progress as a thin gradient rail at the very top of the viewport.
 * Doubles as the "velocity" readout for the whole journey.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="g-gradient fixed inset-x-0 top-0 z-[65] h-[2px] will-change-transform"
    />
  )
}
