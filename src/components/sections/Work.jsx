import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { work } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { useFinePointer } from '@/hooks/usePointer'

/**
 * Live work, staged like vehicle launches.
 *
 * Full-bleed rows rather than a card grid: each one is a cinematic plate with
 * a scanning sweep, and hovering lifts the technology stack up from the base.
 * Rows alternate which side the plate lands on so the stack reads as a
 * sequence rather than three copies of the same slab.
 * No stock photography — the client has none, so the visual is generated from
 * the brand's own geometry instead of a placeholder image.
 */
export function Work() {
  return (
    <SectionShell id="work" labelledBy="work-heading" className="relative">
      {/* ---- Header ------------------------------------------------- */}
      <div className="max-w-3xl">
        <Eyebrow>{work.eyebrow}</Eyebrow>
        <SectionTitle id="work-heading" className="mt-7">
          What We’re <span className="g-gradient-text">Working On</span>
        </SectionTitle>
      </div>

      {/* Status rail. The live count and the sample-work caveat dock onto one
          hairline under the title rather than floating in the top-right
          corner — the count reads as instrumentation for the rows below, and
          it keeps this header from mirroring the Testimonials one. */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={fadeUp}
        className="mt-10 flex flex-col gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10 md:mt-12"
      >
        <span className="flex shrink-0 items-center gap-3">
          <LiveDot />
          <span className="g-label text-mist tabular-nums">
            {String(work.items.length).padStart(2, '0')} Active
          </span>
        </span>

        {work.placeholder && (
          <p className="flex max-w-xl items-start gap-3 text-[0.875rem] leading-relaxed text-dim">
            <Radio
              className="mt-0.5 size-4 shrink-0 text-accent"
              strokeWidth={2.2}
              aria-hidden="true"
            />
            {work.placeholderNote}
          </p>
        )}
      </motion.div>

      <motion.ul
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={stagger(0.12)}
        className="mt-14 flex flex-col gap-5 lg:mt-16"
      >
        {work.items.map((item, i) => (
          <ProjectPlate key={item.client} item={item} index={i} />
        ))}
      </motion.ul>

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={fadeUp}
        className="mt-12 flex justify-center"
      >
        <Button href={work.cta.href} variant="outline" size="lg" icon={false}>
          <MessageCircle className="size-4" strokeWidth={2.4} aria-hidden="true" />
          {work.cta.label}
        </Button>
      </motion.div>
    </SectionShell>
  )
}

function ProjectPlate({ item, index }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const [hovered, setHovered] = useState(false)

  // Odd rows put the plate first. Only the visual order flips — the brief
  // stays ahead of the plate in the DOM, so reading and tab order are
  // identical on every row and the single-column layout is unaffected.
  const flipped = index % 2 === 1

  return (
    <motion.li variants={fadeUp}>
      <motion.article
        ref={ref}
        onPointerEnter={() => fine && setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        className="group g-panel relative overflow-hidden rounded-3xl"
      >
        {/* Scanning sweep — the AI-inspection read, on hover only. */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              aria-hidden="true"
              initial={{ y: '-100%' }}
              animate={{ y: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
              className="pointer-events-none absolute inset-x-0 h-1/2 bg-linear-to-b from-transparent via-brand-pink/8 to-transparent"
            />
          )}
        </AnimatePresence>

        {/* Hairline sweeps outward from whichever edge the plate sits on. */}
        <span
          aria-hidden="true"
          className={cn(
            'g-gradient absolute inset-x-0 top-0 h-[1.5px] scale-x-0 transition-transform duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100',
            flipped ? 'origin-right' : 'origin-left',
          )}
        />

        <div
          className={cn(
            'relative grid gap-8 p-8 md:items-end md:gap-12 md:p-10 lg:p-12',
            flipped ? 'md:grid-cols-[auto_1fr]' : 'md:grid-cols-[1fr_auto]',
          )}
        >
          {/* ---- The brief — right-hand column on flipped rows -------- */}
          <div className={cn('min-w-0', flipped && 'md:order-2')}>
            <div className="flex flex-wrap items-center gap-4">
              <span
                className="font-mono text-[0.6875rem] tracking-[0.24em] text-dim tabular-nums"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')} /{' '}
                {String(work.items.length).padStart(2, '0')}
              </span>
              <span className="g-label text-accent">{item.client}</span>
              <StatusPill status={item.status} />
            </div>

            <h3 className="mt-6 text-[clamp(1.625rem,3.2vw,2.5rem)] leading-[1.05] font-black tracking-[-0.035em] text-chalk">
              {item.title}
            </h3>

            <p className="mt-5 max-w-2xl text-[1.0625rem] leading-relaxed text-mist">
              {item.body}
            </p>

            {/* Stack: always present for accessibility and mobile, but it
                rises and brightens on hover on pointer devices. */}
            <div className="mt-7">
              <span className="g-label mb-3.5 block text-dim">Stack</span>
              <ul className="flex flex-wrap gap-2">
                {item.stack.map((tech, t) => (
                  <motion.li
                    key={tech}
                    animate={
                      fine
                        ? { y: hovered ? 0 : 6, opacity: hovered ? 1 : 0.55 }
                        : { y: 0, opacity: 1 }
                    }
                    transition={{
                      duration: 0.5,
                      ease: EASE.expo,
                      delay: hovered ? t * 0.05 : 0,
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.03] px-3.5 py-1.5 text-[0.8125rem] font-medium text-mist"
                  >
                    <span
                      aria-hidden="true"
                      className="g-gradient size-1.5 rounded-full"
                    />
                    {tech}
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* ---- Generated plate — leads on flipped rows -------------- */}
          <LaunchPlate
            index={index}
            active={hovered}
            className={flipped ? 'md:order-1' : undefined}
          />
        </div>
      </motion.article>
    </motion.li>
  )
}

/** Brand-gradient dot with a ping halo. Shared by the header rail and pills. */
function LiveDot({ className }) {
  return (
    <span className={cn('relative grid size-1.5 place-items-center', className)}>
      <span className="g-gradient absolute inset-0 rounded-full" />
      <span className="g-gradient absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
    </span>
  )
}

/** "In Progress" indicator with a live pulse. */
function StatusPill({ status }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink/12 bg-ink/[0.03] px-3 py-1">
      <LiveDot />
      <span className="g-label text-mist">{status}</span>
    </span>
  )
}

/**
 * Stand-in hero visual, built from the brand's arrow rather than a stock
 * photo. Rotates through three compositions so the three rows never repeat.
 */
function LaunchPlate({ index, active, className }) {
  const rotations = [-18, 8, 26]
  const scales = [1, 1.12, 0.94]

  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative hidden aspect-square w-[13rem] shrink-0 place-items-center overflow-hidden rounded-2xl border border-ink/8 bg-abyss md:grid lg:w-[15rem]',
        className,
      )}
    >
      {/* Depth grid */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Bloom */}
      <motion.div
        animate={{ opacity: active ? 0.34 : 0.16, scale: active ? 1.1 : 1 }}
        transition={{ duration: 0.9, ease: EASE.expo }}
        className="absolute size-[11rem] blur-[54px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </motion.div>

      {/* Concentric rings */}
      {[0, 1, 2].map((r) => (
        <motion.span
          key={r}
          animate={{
            scale: active ? 1 + r * 0.16 : 0.9 + r * 0.16,
            opacity: active ? 0.35 - r * 0.08 : 0.18 - r * 0.05,
          }}
          transition={{ duration: 1, ease: EASE.expo, delay: r * 0.07 }}
          className="absolute size-[7rem] rounded-full border border-brand-violet"
        />
      ))}

      {/* The mark */}
      <motion.div
        animate={{
          rotate: active ? rotations[index % 3] + 12 : rotations[index % 3],
          scale: active ? scales[index % 3] * 1.08 : scales[index % 3],
        }}
        transition={{ duration: 1, ease: EASE.expo }}
        className="relative"
      >
        <ArrowGlyph gradient id={`work-${index}`} className="size-16 lg:size-20" />
      </motion.div>

      {/* Corner crosshairs */}
      {[
        'top-3 left-3 border-t border-l',
        'top-3 right-3 border-t border-r',
        'bottom-3 left-3 border-b border-l',
        'bottom-3 right-3 border-b border-r',
      ].map((pos) => (
        <span
          key={pos}
          className={cn(
            'absolute size-3 transition-colors duration-500',
            pos,
            active ? 'border-brand-pink' : 'border-ink/20',
          )}
        />
      ))}
    </div>
  )
}
