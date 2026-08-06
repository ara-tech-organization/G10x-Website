import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { EASE } from '@/lib/motion'
import { SceneBoundary } from '@/components/ui/SceneBoundary'
import { useTheme } from '@/hooks/useTheme'

const Stage = lazy(() => import('@/components/three/Stage'))

/**
 * Mounts the G10X particle stage.
 *
 * This belongs to the Services page and nowhere else. The home page has its own
 * hero corridor, so running both would put two WebGL contexts on one visit and
 * change a page the client has already signed off — the stage is therefore
 * gated on the route and simply does not mount elsewhere.
 *
 * Within Services it sits between the page background and the content: fixed,
 * full-viewport, so the split hero's clear right half is a window straight onto
 * it and the cloud keeps bursting as you scroll the rest of the page.
 *
 * Scroll is written into a plain ref rather than state, so the render loop can
 * read it every frame without React re-rendering anything.
 */
export function StageCanvas() {
  const progress = useRef(0)
  // Where the cloud sits and how big it is, as fractions of the visible frame.
  // `scale` is an upper bound only — the scene shrinks below it if the wordmark
  // would otherwise cross `maxRightFraction`, so asking for 1 means "as large
  // as the frame allows".
  const focus = useRef({
    xFraction: 0,
    yFraction: 0,
    scale: 1,
    maxRightFraction: 0.485,
  })
  const { pathname } = useLocation()
  const onServices = pathname.startsWith('/services')
  const reduceMotion = useReducedMotion()
  const { isLight } = useTheme()
  const [ready, setReady] = useState(false)

  /**
   * Aim the cloud at the element that is supposed to frame it.
   *
   * The services hero is a hard split with an opaque left half, so the wordmark
   * belongs in the middle of the right-hand column — but that column's centre
   * is a layout outcome, not a constant. Measuring the element means the cloud
   * lands on the rings whatever the grid ratio, the header height or the
   * breakpoint happen to be, and it follows the column when it becomes a banner
   * above the copy below `lg`.
   *
   * The vertical reading is taken in document space, so it describes where the
   * anchor sits with the page at the top. Reading the live viewport rect would
   * drag the wordmark up the screen as you scrolled, which is the one thing the
   * burst is already doing on purpose.
   */
  useEffect(() => {
    if (!onServices) return undefined

    const measure = () => {
      const el = document.querySelector('[data-stage-anchor]')
      if (!el) {
        focus.current.xFraction = 0
        focus.current.yFraction = 0
        return
      }
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + window.scrollY + r.height / 2
      focus.current.xFraction = (cx - window.innerWidth / 2) / window.innerWidth
      focus.current.yFraction =
        -(cy - window.innerHeight / 2) / window.innerHeight
    }

    // After paint, so the split hero has been laid out and the rect is real.
    const raf = requestAnimationFrame(measure)
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', measure)
    }
  }, [onServices, ready])

  const { scrollYProgress } = useScroll()
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progress.current = v
  })

  /**
   * Defer the download until the browser is idle — the stage is atmosphere,
   * never content, so it must not compete with first paint.
   *
   * The `timeout` is not optional here. Lenis and Motion both hold a permanent
   * rAF loop, and a page that never stops animating can starve
   * `requestIdleCallback` forever — the callback simply never fires and the
   * scene never mounts. The timeout guarantees it runs regardless.
   */
  useEffect(() => {
    if (reduceMotion || !onServices) return undefined
    let idleId
    const timerId = setTimeout(() => setReady(true), 1600)
    if (window.requestIdleCallback) {
      idleId = window.requestIdleCallback(() => setReady(true), { timeout: 1500 })
    }
    return () => {
      clearTimeout(timerId)
      if (idleId !== undefined) window.cancelIdleCallback?.(idleId)
    }
  }, [reduceMotion, onServices])

  if (reduceMotion || !onServices) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {ready && (
        <SceneBoundary>
          <Suspense fallback={null}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, ease: EASE.expo }}
              className="absolute inset-0"
            >
              <Stage progress={progress} focus={focus} isLight={isLight} />
            </motion.div>
          </Suspense>
        </SceneBoundary>
      )}
    </div>
  )
}
