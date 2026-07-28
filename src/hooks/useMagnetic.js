import { useCallback, useRef } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { SPRING } from '@/lib/motion'
import { useFinePointer } from './usePointer'

/**
 * Magnetic hover: the element leans toward the cursor and springs back.
 *
 * Returns handlers plus x/y motion values to bind to a motion element.
 * `strength` is the maximum travel in pixels.
 */
export function useMagnetic({ strength = 14 } = {}) {
  const ref = useRef(null)
  const fine = useFinePointer()

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, SPRING.magnetic)
  const y = useSpring(rawY, SPRING.magnetic)

  const onPointerMove = useCallback(
    (e) => {
      if (!fine || !ref.current) return
      const rect = ref.current.getBoundingClientRect()
      // Offset from element centre, normalised to [-1, 1].
      const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
      const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
      rawX.set(Math.max(-1, Math.min(1, dx)) * strength)
      rawY.set(Math.max(-1, Math.min(1, dy)) * strength)
    },
    [fine, rawX, rawY, strength],
  )

  const onPointerLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  return { ref, x, y, onPointerMove, onPointerLeave, enabled: fine }
}
