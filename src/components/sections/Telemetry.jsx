import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { cn } from '@/lib/cn'
import { CountUp } from '@/lib/countUp'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { telemetry } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/**
 * The instrument cluster.
 *
 * Deliberately not a wall of inflated statistics — the client's content brief
 * says "no fabricated numbers", so every figure here is one the document
 * actually states, or a count of something visible elsewhere on this page.
 * The gauges make honest numbers feel engineered instead of thin.
 */
export function Telemetry() {
  return (
    <SectionShell
      id="telemetry"
      labelledBy="telemetry-heading"
      className="relative overflow-hidden"
    >
      {/* Dashboard backlight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-[26rem] -translate-y-1/2 opacity-[0.06] blur-[120px]"
      >
        <div className="g-gradient size-full" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow>{telemetry.eyebrow}</Eyebrow>
            <SectionTitle id="telemetry-heading" className="mt-7">
              The Numbers We Can{' '}
              <span className="g-gradient-text">Stand Behind</span>
            </SectionTitle>
          </div>
          <RevealText className="max-w-md text-[0.875rem] leading-relaxed text-mist lg:pb-3">
            {telemetry.note}
          </RevealText>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.11)}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-5"
        >
          {telemetry.gauges.map((gauge, i) => (
            <Gauge key={gauge.label} gauge={gauge} index={i} />
          ))}
        </motion.ul>
      </div>
    </SectionShell>
  )
}

/**
 * A single dial. The arc sweeps to the value's share of `max`, the numeral
 * counts up alongside it, and tick marks give it the density of a real
 * instrument rather than a progress ring.
 */
function Gauge({ gauge, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })
  const reduceMotion = usePrefersReducedMotion()

  // A range like 60–90 fills to its upper bound; the label carries the range.
  const fillValue = gauge.to ?? gauge.value
  const ratio = Math.max(0.04, Math.min(fillValue / gauge.max, 1))

  // 240° sweep, opening downward like a rev counter.
  const SWEEP = 240
  const START = 150
  const R = 62
  const CIRC = 2 * Math.PI * R
  const arcLength = (SWEEP / 360) * CIRC

  return (
    <motion.li variants={fadeUp} ref={ref}>
      <div className="g-panel group relative flex h-full flex-col items-center overflow-hidden rounded-3xl px-6 py-9 text-center">
        <span
          aria-hidden="true"
          className="g-gradient pointer-events-none absolute -inset-20 opacity-0 blur-[70px] transition-opacity duration-600 group-hover:opacity-10"
        />

        {/* ---- Dial -------------------------------------------------- */}
        <div className="relative grid size-[10.5rem] place-items-center">
          <svg
            viewBox="0 0 160 160"
            className="absolute inset-0 size-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={`gauge-${index}`} x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c2ff4" />
                <stop offset="55%" stopColor="#df4a94" />
                <stop offset="100%" stopColor="#f0655a" />
              </linearGradient>
            </defs>

            <g transform={`rotate(${START} 80 80)`}>
              {/* Track */}
              <circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke="var(--dial-track)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${CIRC}`}
              />
              {/* Value arc */}
              <motion.circle
                cx="80"
                cy="80"
                r={R}
                fill="none"
                stroke={`url(#gauge-${index})`}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${arcLength} ${CIRC}`}
                initial={{ strokeDashoffset: arcLength }}
                animate={
                  inView
                    ? { strokeDashoffset: arcLength * (1 - ratio) }
                    : { strokeDashoffset: arcLength }
                }
                transition={{
                  duration: reduceMotion ? 0 : 1.9,
                  ease: EASE.expo,
                  delay: reduceMotion ? 0 : 0.15 + index * 0.1,
                }}
              />
            </g>

            {/* Tick marks around the sweep. */}
            {Array.from({ length: 21 }).map((_, t) => {
              const angle = ((START + (t / 20) * SWEEP) * Math.PI) / 180
              const inner = t % 5 === 0 ? 48 : 52
              return (
                <line
                  key={t}
                  x1={80 + Math.cos(angle) * inner}
                  y1={80 + Math.sin(angle) * inner}
                  x2={80 + Math.cos(angle) * 55}
                  y2={80 + Math.sin(angle) * 55}
                  stroke="var(--dial-tick)"
                  strokeWidth={t % 5 === 0 ? 1.6 : 0.9}
                  strokeLinecap="round"
                />
              )
            })}
          </svg>

          {/* ---- Numeral ----------------------------------------------
              A range like "60–90" is nearly twice as wide as a single figure,
              so it steps down a size rather than bursting out of the dial.
              The unit sits inside the dial too, which keeps all four cards
              structurally identical and their labels on one baseline. */}
          <div className="relative flex flex-col items-center justify-center">
            <span
              className={cn(
                'g-gradient-text leading-none font-black tracking-[-0.04em] tabular-nums',
                gauge.to != null ? 'text-[1.6875rem]' : 'text-[2.5rem]',
              )}
            >
              {inView ? (
                <CountUp
                  end={gauge.value}
                  duration={reduceMotion ? 0 : 2}
                  delay={reduceMotion ? 0 : 0.15 + index * 0.1}
                  useEasing
                />
              ) : (
                0
              )}
              {gauge.to != null && (
                <>
                  <span className="mx-px font-light">–</span>
                  {inView ? (
                    <CountUp
                      end={gauge.to}
                      duration={reduceMotion ? 0 : 2}
                      delay={reduceMotion ? 0 : 0.25 + index * 0.1}
                      useEasing
                    />
                  ) : (
                    0
                  )}
                </>
              )}
            </span>

            {gauge.suffix?.trim() && (
              <span className="mt-1.5 font-mono text-[0.625rem] tracking-[0.28em] text-mist uppercase">
                {gauge.suffix.trim()}
              </span>
            )}
          </div>
        </div>

        {/* ---- Label ------------------------------------------------- */}
        <h3 className="mt-6 text-[1rem] leading-snug font-bold tracking-[-0.02em] text-balance text-chalk">
          {gauge.label}
        </h3>

        <p className="mt-3 text-[0.875rem] leading-relaxed text-mist">
          {gauge.detail}
        </p>
      </div>
    </motion.li>
  )
}
