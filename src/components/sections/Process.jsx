import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { process } from '@/content/site'
import { Eyebrow, SectionTitle } from '@/components/ui/SectionShell'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { useIsTablet } from '@/hooks/useMediaQuery'

/**
 * The process, driven as a route.
 *
 * Desktop: the section pins and the seven stages travel horizontally past a
 * fixed camera while the road paint streams beneath them — vertical scroll
 * becomes forward motion. Mobile: the same stages stack down a vertical lane,
 * because pinned horizontal scroll on a phone is a usability trap.
 */
export function Process() {
  const compact = useIsTablet()
  return compact ? <ProcessStacked /> : <ProcessTravelling />
}

/* -------------------------------------------------------------------------- */
/* Desktop — pinned, horizontal travel                                         */
/* -------------------------------------------------------------------------- */

function ProcessTravelling() {
  const trackRef = useRef(null)
  const stripRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.0005,
  })

  // Travel distance must be measured, not guessed: a percentage of the strip's
  // own width lands differently on a 1280 and a 2560 viewport, which would
  // either clip the last stage or overshoot into empty space.
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const strip = stripRef.current
    if (!strip) return

    const measure = () => {
      const overflow = strip.scrollWidth - window.innerWidth
      // Leave a gutter at both ends so nothing sits flush to the edge.
      setDistance(Math.max(0, overflow + 112))
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(strip)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  const x = useTransform(progress, [0, 1], [56, -distance])
  const paintX = useTransform(progress, [0, 1], ['0%', '-180%'])
  const speedBlur = useTransform(progress, [0, 0.5, 1], [0, 1, 0])

  return (
    /* Tall spacer gives the pin its scroll distance. Sized so the horizontal
       travel advances at roughly 1:1 with the wheel rather than crawling. */
    <section
      id="process"
      aria-labelledby="process-heading"
      ref={trackRef}
      className="relative h-[300vh]"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        {/* Road surface + streaming paint. */}
        <RoadBed paintX={paintX} speedBlur={speedBlur} />

        <div className="relative z-10 mx-auto w-full max-w-[86rem] px-10 lg:px-14">
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-xl">
              <Eyebrow>{process.eyebrow}</Eyebrow>
              <SectionTitle id="process-heading" className="mt-6" size="title">
                How We Turn Strategy{' '}
                <span className="g-gradient-text">Into Results</span>
              </SectionTitle>
            </div>

            {/* Live phase + distance readout. */}
            <PhaseReadout progress={progress} />
          </div>
        </div>

        {/* The travelling strip. Cards carry a floor height so the pinned
            composition fills the viewport instead of floating in dead space. */}
        <motion.ol
          ref={stripRef}
          style={{ x }}
          className="relative z-10 mt-12 flex w-max gap-6 pl-10 will-change-transform lg:pl-14"
        >
          {process.stages.map((stage, i) => (
            <StageCard key={stage.n} stage={stage} index={i} />
          ))}
          {/* Destination plate, closing the route. */}
          <Destination />
        </motion.ol>
      </div>
    </section>
  )
}

/** Perspective road under the strip, with paint that streams as you travel. */
function RoadBed({ paintX, speedBlur }) {
  // Glow swells toward the middle of the route, easing off at both ends.
  const glowOpacity = useTransform(speedBlur, [0, 1], [0.08, 0.2])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 bg-linear-to-b from-void via-abyss to-void" />

      {/* Vanishing-point glow. */}
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute top-1/2 left-1/2 size-[44rem] -translate-x-1/2 -translate-y-1/2 blur-[130px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </motion.div>

      {/* Perspective grid floor. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%] opacity-[0.14] [mask-image:linear-gradient(0deg,#000_10%,transparent_90%)]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(164,56,232,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(164,56,232,0.6) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
          transform: 'perspective(440px) rotateX(68deg)',
          transformOrigin: 'bottom',
        }}
      />

      {/* Centre paint — dashes that stream past. */}
      <div className="absolute inset-x-0 bottom-[16%] h-[3px] overflow-hidden opacity-50">
        <motion.div
          style={{ x: paintX }}
          className="h-full w-[300%]"
          // Dash pattern in the brand ramp: the arrow motif as road marking.
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, #a438e8 0 60px, transparent 60px 130px)',
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}

/** Distinct phases, in route order. Computed once at module scope. */
const PHASES = [...new Set(process.stages.map((s) => s.phase))]

/** Which phase of the route you are currently in, plus a distance bar. */
function PhaseReadout({ progress }) {
  const pctLabel = useTransform(
    progress,
    (v) => `${String(Math.round(v * 100)).padStart(3, '0')}%`,
  )

  return (
    <div className="hidden w-64 shrink-0 lg:block">
      <div className="flex items-center justify-between">
        <span className="g-label text-dim">Route</span>
        <motion.span className="font-mono text-[0.6875rem] tracking-[0.24em] text-mist tabular-nums">
          {pctLabel}
        </motion.span>
      </div>

      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-ink/8">
        <motion.div
          style={{ scaleX: progress }}
          className="g-gradient h-full w-full origin-left rounded-full"
        />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        {PHASES.map((phase, i) => (
          <PhaseTick key={phase} phase={phase} index={i} progress={progress} />
        ))}
      </div>
    </div>
  )
}

/** One phase label, dimmed unless the route is currently inside it. */
function PhaseTick({ phase, index, progress }) {
  const start = index / PHASES.length
  const end = (index + 1) / PHASES.length
  const opacity = useTransform(
    progress,
    [start - 0.08, start, end, end + 0.08],
    [0.35, 1, 1, 0.35],
  )

  return (
    <motion.span style={{ opacity }} className="g-label text-chalk">
      {phase}
    </motion.span>
  )
}

/** One stage. A pit board: number plate, phase tag, instruction. */
function StageCard({ stage, index }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: EASE.expo, delay: index * 0.04 }}
      className="group relative w-[24rem] shrink-0"
    >
      <div className="g-panel relative flex h-full min-h-[21rem] flex-col overflow-hidden rounded-3xl p-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2">
        <span
          aria-hidden="true"
          className="g-gradient absolute inset-x-0 top-0 h-[1.5px] origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />
        <span
          aria-hidden="true"
          className="g-gradient pointer-events-none absolute -inset-16 opacity-0 blur-[60px] transition-opacity duration-600 group-hover:opacity-12"
        />

        <div className="relative flex items-center justify-between">
          <span className="g-gradient-text text-[3.5rem] leading-none font-black tracking-[-0.05em]">
            {stage.n}
          </span>
          <span className="rounded-full border border-ink/12 px-3 py-1">
            <span className="g-label text-mist">{stage.phase}</span>
          </span>
        </div>

        <h3 className="relative mt-8 text-[1.5rem] leading-tight font-bold tracking-[-0.03em] text-chalk">
          {stage.title}
        </h3>
        <p className="relative mt-3.5 text-[0.9375rem] leading-relaxed text-mist">
          {stage.body}
        </p>

        {/* Pushed to the base so the glyph sits on one line across all cards. */}
        <ArrowGlyph
          gradient
          id={`pc-${stage.n}`}
          className="relative mt-auto size-3.5 opacity-40 transition-all duration-500 group-hover:translate-x-1.5 group-hover:opacity-100"
        />
      </div>
    </motion.li>
  )
}

/** End of the route. */
function Destination() {
  return (
    <li className="relative flex w-[22rem] shrink-0 items-center">
      <div className="relative flex flex-col gap-4">
        {/* Chequered flag, reduced to two rows of brand-tinted squares. */}
        <span aria-hidden="true" className="flex flex-col gap-1">
          {[0, 1].map((row) => (
            <span key={row} className="flex gap-1">
              {Array.from({ length: 8 }).map((_, col) => (
                <span
                  key={col}
                  className={cn(
                    'size-2.5 rounded-[2px]',
                    (row + col) % 2 === 0 ? 'g-gradient' : 'bg-ink/10',
                  )}
                />
              ))}
            </span>
          ))}
        </span>

        <h3 className="text-[2.25rem] leading-[0.95] font-black tracking-[-0.04em] text-chalk">
          Growth that <span className="g-gradient-text">compounds.</span>
        </h3>
        <p className="max-w-xs text-[0.9375rem] leading-relaxed text-mist">
          Seven stages, one direction. Every cycle makes the next one cheaper.
        </p>
      </div>
    </li>
  )
}

/* -------------------------------------------------------------------------- */
/* Mobile / tablet — vertical lane                                             */
/* -------------------------------------------------------------------------- */

function ProcessStacked() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading-m"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-full opacity-[0.1]"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgba(164,56,232,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative mx-auto w-full max-w-[86rem] px-6 md:px-10">
        <Eyebrow>{process.eyebrow}</Eyebrow>
        <SectionTitle id="process-heading-m" className="mt-6" size="title">
          How We Turn Strategy{' '}
          <span className="g-gradient-text">Into Results</span>
        </SectionTitle>

        <motion.ol
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.08)}
          className="relative mt-14 flex flex-col gap-4 pl-9"
        >
          {/* The lane. */}
          <span
            aria-hidden="true"
            className="absolute inset-y-0 left-[9px] w-[2px] rounded-full bg-linear-to-b from-brand-purple via-brand-pink to-transparent opacity-45"
          />

          {process.stages.map((stage) => (
            <motion.li key={stage.n} variants={fadeUp} className="relative">
              <span
                aria-hidden="true"
                className="g-gradient absolute top-8 -left-9 size-2.5 rounded-full ring-4 ring-void"
              />
              <div className="g-panel rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <span className="g-gradient-text text-[2rem] leading-none font-black tracking-[-0.05em]">
                    {stage.n}
                  </span>
                  <span className="rounded-full border border-ink/12 px-3 py-1">
                    <span className="g-label text-mist">{stage.phase}</span>
                  </span>
                </div>
                <h3 className="mt-5 text-xl leading-tight font-bold tracking-[-0.025em] text-chalk">
                  {stage.title}
                </h3>
                <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-mist">
                  {stage.body}
                </p>
              </div>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
