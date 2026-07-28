import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import {
  motion,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  useVelocity,
} from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { EASE, stagger, wordReveal } from '@/lib/motion'
import { hero } from '@/content/site'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { Marquee } from '@/components/ui/Marquee'
import { SceneBoundary } from '@/components/ui/SceneBoundary'
import { usePointerParallax } from '@/hooks/usePointer'
import { scrollToTarget } from '@/hooks/useLenis'

// three.js lives in its own chunk and only downloads after first paint.
const HeroScene = lazy(() => import('@/components/three/HeroScene'))

/**
 * The opening shot.
 *
 * Type sits in front of a live corridor; scrolling accelerates the environment
 * and the headline drifts back into it. Scroll velocity is written into a plain
 * ref rather than React state so the 3D scene can read it every frame without
 * ever triggering a re-render.
 */
export function Hero() {
  const rootRef = useRef(null)
  const velocity = useRef(0)
  const pointer = usePointerParallax({ stiffness: 45, damping: 18 })
  const reduceMotion = useReducedMotion()

  const [sceneReady, setSceneReady] = useState(false)
  const [inView, setInView] = useState(true)

  const { scrollY, scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start start', 'end start'],
  })
  const rawVelocity = useVelocity(scrollY)

  // Normalise px/s into the 0–0.25 band the scene is tuned against.
  useMotionValueEvent(rawVelocity, 'change', (v) => {
    velocity.current = Math.min(Math.abs(v) / 9000, 0.25)
  })

  // Decay back to idle when scrolling stops — useVelocity only fires on change,
  // so without this the scene would stay stuck at the last speed. Runs only
  // while the hero is on screen, since nothing reads it otherwise.
  useEffect(() => {
    if (!inView) return
    let frame
    const decay = () => {
      velocity.current *= 0.93
      frame = requestAnimationFrame(decay)
    }
    frame = requestAnimationFrame(decay)
    return () => cancelAnimationFrame(frame)
  }, [inView])

  // Only render frames while the hero is actually on screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Defer the 3D download until the browser is idle.
  useEffect(() => {
    if (reduceMotion) return
    const schedule = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 220))
    const id = schedule(() => setSceneReady(true))
    return () => window.cancelIdleCallback?.(id)
  }, [reduceMotion])

  // Content recedes into the tunnel as the journey begins.
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '26%'])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.62], [1, 0])
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.9])
  // Interpolate the number, then compose the filter function around it — a
  // bare length is not a valid `filter` value and the browser drops the frame.
  const blurPx = useTransform(scrollYProgress, [0, 0.7], [0, 10])
  const contentFilter = useMotionTemplate`blur(${blurPx}px)`

  return (
    <section
      id="top"
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="g-noise relative flex min-h-[100svh] items-center overflow-hidden"
    >
      {/* ---- Layer 1: the live corridor -------------------------------- */}
      <div className="absolute inset-0" aria-hidden="true">
        <StaticBackdrop />
        {/* The scene is an enhancement, never a dependency: if the chunk fails
            to load or WebGL is unavailable, the boundary swallows it and the
            CSS backdrop above carries the hero on its own. */}
        {sceneReady && !reduceMotion && (
          <SceneBoundary>
            <Suspense fallback={null}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.6, ease: EASE.expo }}
                className="absolute inset-0"
              >
                <HeroScene
                  velocity={velocity}
                  pointer={pointer}
                  active={inView}
                />
              </motion.div>
            </Suspense>
          </SceneBoundary>
        )}
        {/* Legibility scrim — type must win over spectacle. */}
        <div className="absolute inset-0 bg-linear-to-r from-void via-void/72 to-void/25" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-void to-transparent" />
      </div>

      {/* ---- Layer 2: type -------------------------------------------- */}
      <motion.div
        style={{
          y: reduceMotion ? 0 : contentY,
          opacity: reduceMotion ? 1 : contentOpacity,
          scale: reduceMotion ? 1 : contentScale,
          filter: reduceMotion ? 'none' : contentFilter,
        }}
        className="relative z-10 mx-auto w-full max-w-[86rem] px-6 pt-32 pb-28 md:px-10 md:pt-36 lg:px-14"
      >
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.1, 0.35)}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 14 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE.expo } },
            }}
            className="mb-8 inline-flex items-center gap-3 rounded-full border border-ink/12 bg-ink/[0.03] py-2 pr-5 pl-3 backdrop-blur-sm"
          >
            <span className="relative grid size-6 place-items-center">
              <span className="g-gradient absolute inset-0 rounded-full opacity-25 blur-[6px]" />
              <ArrowGlyph gradient id="hero-eb" className="relative size-3" />
            </span>
            <span className="g-label text-mist">{hero.eyebrow}</span>
          </motion.div>

          {/* H1 — per-word rise out of a clipping mask. */}
          <h1
            id="hero-heading"
            className="text-hero font-black leading-[0.88] tracking-[-0.045em]"
          >
            {hero.headline.map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  variants={wordReveal}
                  className={
                    li === hero.accentWordIndex
                      ? 'g-gradient-text inline-block'
                      : 'inline-block text-chalk'
                  }
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          {/* Sub */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 22, filter: 'blur(8px)' },
              show: {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                transition: { duration: 1, ease: EASE.expo },
              },
            }}
            className="mt-8 max-w-2xl text-lead leading-relaxed text-mist"
          >
            {hero.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE.expo } },
            }}
            className="mt-11 flex flex-wrap items-center gap-3.5"
          >
            <Button href={hero.primaryCta.href} size="lg">
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.callCta.href} variant="outline" size="lg" icon={false}>
              {hero.callCta.label}
            </Button>
          </motion.div>

          {/* Supporting line, set quieter and narrower. */}
          <motion.p
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { duration: 1.2, delay: 0.2 } },
            }}
            className="mt-12 max-w-xl border-l border-ink/12 pl-5 text-[0.9375rem] leading-relaxed text-dim"
          >
            {hero.supporting}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* ---- Layer 3: instrument strip -------------------------------- */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE.expo, delay: 1.15 }}
          className="border-t border-ink/8 bg-void/45 backdrop-blur-md"
        >
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => scrollToTarget('#about')}
              className="group hidden shrink-0 items-center gap-3 border-r border-ink/8 px-7 py-5 text-mist transition-colors hover:text-chalk md:flex"
            >
              <span className="g-label">Scroll</span>
              <ChevronDown
                className="size-4 animate-bounce motion-reduce:animate-none"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </button>

            <Marquee speed={44} className="flex-1 py-5" itemClassName="gap-0">
              {hero.trustStrip.map((item) => (
                <span
                  key={item}
                  className="flex shrink-0 items-center gap-4 pr-10 text-[0.875rem] font-medium whitespace-nowrap text-mist"
                >
                  <ArrowGlyph
                    gradient
                    id={`ts-${item.slice(0, 6)}`}
                    className="size-2.5 shrink-0"
                  />
                  {item}
                </span>
              ))}
            </Marquee>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * CSS-only backdrop. Paints instantly, carries the hero before the 3D chunk
 * arrives, and is the permanent background under reduced-motion.
 */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-void">
      {/* Vanishing-point bloom. */}
      <div className="absolute top-1/2 left-[62%] size-[46rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.22] blur-[130px]">
        <div className="g-gradient size-full rounded-full" />
      </div>

      {/* Floor grid in perspective — the road, before the road exists. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] opacity-[0.16] [mask-image:linear-gradient(0deg,#000_5%,transparent_85%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(164,56,232,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(164,56,232,0.55) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
          transform: 'perspective(420px) rotateX(66deg)',
          transformOrigin: 'bottom',
        }}
      />
      {/* Ceiling grid, mirrored — closes the corridor. */}
      <div
        className="absolute inset-x-0 top-0 h-[42%] opacity-[0.1] [mask-image:linear-gradient(180deg,#000_5%,transparent_85%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(240,101,90,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(240,101,90,0.5) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
          transform: 'perspective(420px) rotateX(-66deg)',
          transformOrigin: 'top',
        }}
      />
    </div>
  )
}
