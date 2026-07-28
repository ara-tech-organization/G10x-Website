import { useEffect, useState } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

/**
 * Normalised pointer position as springy motion values in the range [-1, 1],
 * measured from the viewport centre. Feeds hero parallax and the 3D camera.
 *
 * Motion values (not state) on purpose: parallax must not re-render React on
 * every mousemove.
 */
export function usePointerParallax({ stiffness = 60, damping = 20 } = {}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness, damping, mass: 0.6 })
  const y = useSpring(rawY, { stiffness, damping, mass: 0.6 })

  useEffect(() => {
    // Pointer parallax is meaningless without a fine pointer.
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onMove = (e) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1)
      rawY.set((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY])

  return { x, y }
}

/** True when the device has a precise pointer (enables hover-only flourishes). */
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}
