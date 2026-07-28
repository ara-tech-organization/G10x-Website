import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { Logo } from '@/components/ui/Logo'

/**
 * Ignition sequence.
 *
 * Four beats, borrowed from a car starting: the ring cranks around, the arrow
 * snaps into the mark, the gradient floods the bar, then the whole panel
 * splits and pulls away to reveal the page underneath.
 *
 * Progress is driven by real readiness (fonts + window load), not a fake timer,
 * with a floor so the sequence never flashes and a ceiling so a slow asset
 * can never trap the visitor behind it.
 */
const MIN_DURATION = 1900
const MAX_DURATION = 5000

export function Preloader({ onComplete }) {
  const reduceMotion = useReducedMotion()
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  // Stamped in the effect, not during render — render must stay pure.
  const startedAt = useRef(0)

  useEffect(() => {
    startedAt.current = Date.now()

    // Scroll must stay locked while the curtain is up.
    document.documentElement.classList.add('lenis-stopped')
    document.body.style.overflow = 'hidden'

    let frame
    let settled = false

    const ready = Promise.allSettled([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((resolve) => {
        if (document.readyState === 'complete') resolve()
        else window.addEventListener('load', resolve, { once: true })
      }),
    ]).then(() => {
      settled = true
    })

    const tick = () => {
      const elapsed = Date.now() - startedAt.current
      const floor = Math.min(elapsed / MIN_DURATION, 1)
      // Before assets settle, creep asymptotically toward 90%.
      const target = settled ? 1 : Math.min(0.9, floor * 0.9)
      setProgress((p) => {
        const next = p + (Math.max(target, floor * (settled ? 1 : 0.9)) - p) * 0.09
        return next > 0.999 ? 1 : next
      })

      if (elapsed > MAX_DURATION) settled = true
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      void ready
    }
  }, [])

  // Hand off once the bar is full and the minimum beat has elapsed.
  useEffect(() => {
    if (!startedAt.current) return
    if (progress < 0.995) return
    if (Date.now() - startedAt.current < MIN_DURATION) return
    const t = setTimeout(() => setDone(true), reduceMotion ? 0 : 260)
    return () => clearTimeout(t)
  }, [progress, reduceMotion])

  const release = () => {
    document.documentElement.classList.remove('lenis-stopped')
    document.body.style.overflow = ''
    onComplete?.()
  }

  const pct = Math.round(progress * 100)

  return (
    <AnimatePresence onExitComplete={release}>
      {!done && (
        <motion.div
          className="g-noise fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-abyss"
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : { transition: { duration: 0.1 } }
          }
        >
          {/* Curtain halves that pull apart on exit. */}
          {!reduceMotion &&
            [0, 1].map((half) => (
              <motion.div
                key={half}
                aria-hidden="true"
                className="absolute inset-x-0 h-1/2 bg-abyss"
                style={{ [half === 0 ? 'top' : 'bottom']: 0 }}
                exit={{
                  y: half === 0 ? '-101%' : '101%',
                  transition: { duration: 1.1, ease: EASE.quint, delay: 0.08 },
                }}
              />
            ))}

          {/* Ambient bloom behind the mark. */}
          <motion.div
            aria-hidden="true"
            className="g-gradient absolute size-[34rem] rounded-full blur-[130px]"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 0.16, scale: 1 }}
            transition={{ duration: 2, ease: EASE.expo }}
          />

          <div className="relative z-10 flex w-[min(88vw,30rem)] flex-col items-center gap-12">
            {/* Beat 1 — the crank. A gradient arc sweeps the ring. */}
            <div className="relative grid size-40 place-items-center md:size-48">
              <svg
                viewBox="0 0 200 200"
                className="absolute inset-0 size-full -rotate-90"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="pl-ring" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#7c2ff4" />
                    <stop offset="55%" stopColor="#df4a94" />
                    <stop offset="100%" stopColor="#f0655a" />
                  </linearGradient>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="rgba(255,255,255,0.07)"
                  strokeWidth="2"
                />
                {/* Progress arc — the tachometer needle sweep. */}
                <motion.circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="url(#pl-ring)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  pathLength={1}
                  style={{ strokeDasharray: 1 }}
                  animate={{ strokeDashoffset: 1 - progress }}
                  transition={{ ease: 'linear', duration: 0.1 }}
                />
              </svg>

              {/* Beat 2 — the arrow snaps in from the logo's notch. */}
              <motion.div
                className="relative grid size-full place-items-center"
                initial={{ rotate: -140, scale: 0.35, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 1.35, ease: EASE.expo, delay: 0.15 }}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="size-[42%]"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="pl-arrow" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#7c2ff4" />
                      <stop offset="55%" stopColor="#df4a94" />
                      <stop offset="100%" stopColor="#f0655a" />
                    </linearGradient>
                  </defs>
                  {/* Wireframe outline draws first… */}
                  <motion.path
                    d="M12 50 L88 18 L56 94 L46 58 Z"
                    fill="none"
                    stroke="url(#pl-arrow)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.1, ease: EASE.expo, delay: 0.2 }}
                  />
                  {/* …then the solid fill floods in behind it. */}
                  <motion.path
                    d="M12 50 L88 18 L56 94 L46 58 Z"
                    fill="url(#pl-arrow)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.7, ease: EASE.expo, delay: 1.05 }}
                  />
                </svg>
              </motion.div>
            </div>

            {/* Beat 3 — the wordmark resolves. */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: EASE.expo, delay: 0.8 }}
              className="flex w-full flex-col items-center gap-7"
            >
              <Logo priority className="w-[min(62vw,15rem)]" />

              {/* Beat 4 — gradient floods the rail as the counter climbs. */}
              <div className="flex w-full flex-col gap-3">
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-ink/8">
                  <motion.div
                    className="g-gradient absolute inset-y-0 left-0 w-full origin-left rounded-full"
                    style={{ scaleX: progress }}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="g-label text-dim">Ignition</span>
                  <span
                    className="font-mono text-[0.6875rem] tracking-[0.28em] text-mist tabular-nums"
                    role="status"
                    aria-live="polite"
                    aria-label={`Loading ${pct} percent`}
                  >
                    {String(pct).padStart(3, '0')}%
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Slogan, letter-spaced like the mark's own strapline. */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1.3 }}
            className="g-label absolute bottom-10 text-dim"
          >
            Defy Limits
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
