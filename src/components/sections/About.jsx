import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { about } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { RevealText } from '@/components/ui/Reveal'

/**
 * About, told as a route rather than a paragraph block.
 *
 * A lit highway runs down the right-hand side; the arrow travels it as you
 * scroll and each marker lights up as it is passed. The copy stays sticky on
 * the left so the story and the journey advance together.
 */
export function About() {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start 78%', 'end 62%'],
  })

  // Smoothed so the travelling arrow never jitters with the wheel.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <SectionShell id="about" labelledBy="about-heading" className="pt-28 md:pt-36">
      {/* `min-w-0` on both columns: grid items default to `min-width: auto`,
          so the widest child's min-content can push the track past the
          container. At 320px the route column's 4rem left inset did exactly
          that and widened the whole section by 30px. */}
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-20">
        {/* ---- Story column (sticky) ---------------------------------- */}
        <div className="min-w-0 lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{about.eyebrow}</Eyebrow>

          <SectionTitle id="about-heading" className="mt-7">
            Meet G10X —{' '}
            <span className="g-gradient-text">Your Growth Partner</span>
          </SectionTitle>

          <div className="mt-8 flex flex-col gap-6">
            {about.body.map((para, i) => (
              <RevealText
                key={i}
                delay={i * 0.08}
                className="text-lead leading-relaxed text-mist"
              >
                {para}
              </RevealText>
            ))}
          </div>

          {/* Pull quote — the one line worth isolating. */}
          <motion.blockquote
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1, ease: EASE.expo, delay: 0.15 }}
            className="relative mt-10 pl-6"
          >
            <span
              aria-hidden="true"
              className="g-gradient absolute top-1 bottom-1 left-0 w-[2px] rounded-full"
            />
            {/* Sized independently of --text-title: this is a full sentence
                rather than a short line, so at heading scale it ran to three
                heavy lines and competed with the section h2 above it. */}
            <p className="text-[clamp(1.0625rem,1.75vw,1.375rem)] leading-[1.35] font-semibold text-balance text-chalk">
              “{about.pullQuote}”
            </p>
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.9, ease: EASE.expo, delay: 0.25 }}
            className="mt-10"
          >
            <Button href={about.cta.href} variant="outline">
              {about.cta.label}
            </Button>
          </motion.div>
        </div>

        {/* ---- The route --------------------------------------------- */}
        <div ref={trackRef} className="relative min-w-0">
          <Highway progress={progress} />

          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.14)}
            className="relative flex flex-col gap-6 pl-16 md:gap-8 md:pl-24"
          >
            {about.markers.map((marker, i) => (
              <Marker
                key={marker.k}
                marker={marker}
                index={i}
                total={about.markers.length}
                progress={progress}
              />
            ))}
          </motion.ul>
        </div>
      </div>
    </SectionShell>
  )
}

/**
 * The road itself: a dark lane, a gradient lane that fills with scroll
 * progress, dashed centre paint, and the arrow riding the head of the fill.
 */
function Highway({ progress }) {
  const arrowTop = useTransform(progress, [0, 1], ['0%', '100%'])
  const glowOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.7])

  return (
    <div
      aria-hidden="true"
      className="absolute top-0 bottom-0 left-5 w-11 md:left-7 md:w-14"
    >
      {/* Lane surface */}
      <div className="absolute inset-y-0 left-1/2 w-11 -translate-x-1/2 rounded-full border border-ink/8 bg-panel/60 md:w-14" />

      {/* Dashed centre paint — the arrow motif repeating down the lane. */}
      <div
        className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 opacity-30"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, color-mix(in srgb, var(--color-ink) 50%, transparent) 0 14px, transparent 14px 34px)',
        }}
      />

      {/* Travelled distance, filled in the brand ramp. */}
      <motion.div
        style={{ scaleY: progress, opacity: glowOpacity }}
        className="absolute inset-y-0 left-1/2 w-[3px] origin-top -translate-x-1/2 rounded-full"
      >
        <div className="g-gradient size-full rounded-full" />
        <div className="g-gradient absolute inset-0 rounded-full blur-[8px] opacity-70" />
      </motion.div>

      {/* The vehicle: the mark, travelling. */}
      <motion.div
        style={{ top: arrowTop }}
        className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative grid size-11 place-items-center md:size-14">
          <span className="g-gradient absolute inset-0 rounded-full opacity-30 blur-[14px]" />
          <span className="g-glass absolute inset-0 rounded-full" />
          <ArrowGlyph
            gradient
            id="hw-arrow"
            className="relative size-4 rotate-[135deg] md:size-5"
          />
        </div>
      </motion.div>
    </div>
  )
}

/** A milestone. Lights up once the arrow has reached its share of the road. */
function Marker({ marker, index, total, progress }) {
  const threshold = (index + 0.35) / total
  const lit = useTransform(progress, (p) => (p >= threshold ? 1 : 0))
  const dim = useTransform(lit, [0, 1], [0.45, 1])

  return (
    <motion.li variants={fadeUp} style={{ opacity: dim }}>
      <motion.div
        className="g-panel group relative overflow-hidden rounded-2xl p-6 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:p-7"
        whileHover={{ scale: 1.012 }}
      >
        {/* Headlight wash on hover. */}
        <span
          aria-hidden="true"
          className="g-gradient pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-15"
        />

        <div className="relative flex items-start justify-between gap-5">
          <div>
            <span className="g-label text-accent">{marker.k}</span>
            <h3 className="mt-2.5 text-xl font-bold tracking-[-0.02em] text-chalk md:text-2xl">
              {marker.label}
            </h3>
            <p className="mt-2.5 max-w-sm text-[0.875rem] leading-relaxed text-mist">
              {marker.detail}
            </p>
          </div>
          <span
            className="font-mono text-[0.6875rem] tracking-[0.2em] text-dim tabular-nums"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </motion.div>
    </motion.li>
  )
}
