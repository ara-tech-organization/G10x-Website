import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useFinePointer } from '@/hooks/usePointer'

/**
 * A soft gradient bloom that trails the cursor, plus a tight leading dot.
 *
 * Purely decorative and pointer-events-none, so it never intercepts clicks.
 * Skipped entirely on touch devices and under reduced-motion.
 */
export function CursorGlow() {
  const fine = useFinePointer()

  const rawX = useMotionValue(-400)
  const rawY = useMotionValue(-400)

  // Two trailing speeds gives the trail a sense of mass.
  const bloomX = useSpring(rawX, { stiffness: 55, damping: 18, mass: 0.7 })
  const bloomY = useSpring(rawY, { stiffness: 55, damping: 18, mass: 0.7 })
  const dotX = useSpring(rawX, { stiffness: 700, damping: 40, mass: 0.25 })
  const dotY = useSpring(rawY, { stiffness: 700, damping: 40, mass: 0.25 })

  useEffect(() => {
    if (!fine) return
    const onMove = (e) => {
      rawX.set(e.clientX)
      rawY.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [fine, rawX, rawY])

  if (!fine) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[70] hidden motion-safe:block"
      aria-hidden="true"
    >
      <motion.div
        style={{ x: bloomX, y: bloomY }}
        className="absolute -top-[13rem] -left-[13rem] size-[26rem] rounded-full opacity-[0.16] blur-[70px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </motion.div>

      <motion.div
        style={{ x: dotX, y: dotY }}
        className="g-gradient absolute -top-[3px] -left-[3px] size-1.5 rounded-full mix-blend-screen"
      />
    </div>
  )
}
