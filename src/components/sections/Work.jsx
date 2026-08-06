import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { MessageCircle, Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp } from '@/lib/motion'
import { work } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { useIsTablet, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

/**
 * Live work as a pinned showcase.
 *
 * The section holds still while the three projects advance through it: a large
 * generated plate on the left, the brief on the right, and a rail down the edge
 * marking position. One project occupies the whole viewport at a time, which is
 * what the brief asked for — large cinematic previews rather than a list.
 *
 * Note there is no `overflow-hidden` on the section. An ancestor that clips
 * becomes the sticky containing block and the pin silently stops working; the
 * decorative glow is clipped by its own wrapper instead.
 *
 * Below `lg`, and under reduced-motion, the three simply stack in flow.
 */
export function Work() {
  const trackRef = useRef(null)
  const compact = useIsTablet()
  const reduceMotion = usePrefersReducedMotion()
  const pinned = !compact && !reduceMotion

  const [active, setActive] = useState(0)
  const total = work.items.length

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  // Discrete index rather than a spring: the panels crossfade between fixed
  // states, so a continuously interpolated value would just thrash React.
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (!pinned) return
    const next = Math.min(total - 1, Math.max(0, Math.floor(p * total * 0.999)))
    setActive((cur) => (cur === next ? cur : next))
  })

  return (
    <SectionShell id="work" labelledBy="work-heading" className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="g-gradient absolute top-1/3 -left-32 size-[34rem] rounded-full opacity-[0.05] blur-[140px]" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow>{work.eyebrow}</Eyebrow>
            <SectionTitle id="work-heading" className="mt-7">
              What We’re <span className="g-gradient-text">Working On</span>
            </SectionTitle>
          </div>

          {work.placeholder && (
            <p className="flex max-w-sm items-start gap-3 text-[0.875rem] leading-relaxed text-dim lg:pb-3">
              <Radio
                className="mt-0.5 size-4 shrink-0 text-accent"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              {work.placeholderNote}
            </p>
          )}
        </div>
      </div>

      {pinned ? (
        <PinnedShowcase trackRef={trackRef} active={active} total={total} />
      ) : (
        <StackedList />
      )}

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        variants={fadeUp}
        className="relative mt-16 flex justify-center"
      >
        <Button href={work.cta.href} variant="outline" size="lg" icon={false}>
          <MessageCircle className="size-4" strokeWidth={2.4} aria-hidden="true" />
          {work.cta.label}
        </Button>
      </motion.div>
    </SectionShell>
  )
}

/* -------------------------------------------------------------------------- */
/* Desktop — pinned, one project at a time                                     */
/* -------------------------------------------------------------------------- */

function PinnedShowcase({ trackRef, active, total }) {
  return (
    // One viewport of scroll per project, plus a little run-out.
    <div ref={trackRef} className="relative mt-12 h-[280vh]">
      <div className="sticky top-[7rem] grid h-[calc(100vh-11rem)] grid-cols-[3.5rem_1fr_1.05fr] items-center gap-12">
        {/* ---- Position rail --------------------------------------- */}
        <ol className="flex h-full flex-col justify-center gap-6" aria-hidden="true">
          {work.items.map((item, i) => (
            <li key={item.client} className="flex items-center gap-3">
              <span
                className={cn(
                  'font-mono text-[0.6875rem] tracking-[0.2em] tabular-nums transition-colors duration-500',
                  i === active ? 'text-accent' : 'text-dim',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="relative h-px w-6 overflow-hidden rounded-full bg-ink/15">
                <span
                  className={cn(
                    'g-gradient absolute inset-0 origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    i === active ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </span>
            </li>
          ))}
        </ol>

        {/* ---- Plate ------------------------------------------------ */}
        <div className="relative h-full max-h-[34rem] min-h-[22rem]">
          {work.items.map((item, i) => (
            <motion.div
              key={item.client}
              animate={{
                opacity: i === active ? 1 : 0,
                scale: i === active ? 1 : 0.94,
              }}
              transition={{ duration: 0.7, ease: EASE.expo }}
              className="absolute inset-0"
              aria-hidden={i !== active}
            >
              <Plate index={i} />
            </motion.div>
          ))}
        </div>

        {/* ---- Brief ------------------------------------------------ */}
        <div className="relative h-full max-h-[34rem] min-h-[22rem]">
          {work.items.map((item, i) => (
            <motion.article
              key={item.client}
              animate={{
                opacity: i === active ? 1 : 0,
                y: i === active ? 0 : 24,
              }}
              transition={{ duration: 0.6, ease: EASE.expo }}
              className="absolute inset-0 flex flex-col justify-center"
              // Inert copy must not be reachable by keyboard or screen reader.
              // React 19 takes `inert` as a real boolean; the old empty-string
              // form logs a warning and is treated as false.
              inert={i !== active}
            >
              <Brief item={item} index={i} total={total} />
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}

/** Shared copy block, used pinned and stacked. */
function Brief({ item, index, total }) {
  return (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <span className="g-gradient-text text-[2rem] leading-none font-black tracking-[-0.05em] tabular-nums">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="font-mono text-[0.625rem] tracking-[0.24em] text-dim tabular-nums">
          /{String(total).padStart(2, '0')}
        </span>
        <span className="g-label text-accent">{item.client}</span>
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/12 px-3 py-1">
          <span className="relative grid size-1.5 place-items-center">
            <span className="g-gradient absolute inset-0 rounded-full" />
            <span className="g-gradient absolute inset-0 animate-ping rounded-full opacity-60 motion-reduce:animate-none" />
          </span>
          <span className="g-label text-mist">{item.status}</span>
        </span>
      </div>

      <h3 className="mt-7 text-[clamp(1.375rem,2.5vw,2rem)] leading-[1.06] font-black tracking-[-0.035em] text-chalk">
        {item.title}
      </h3>

      <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-mist">
        {item.body}
      </p>

      <ul className="mt-8 flex flex-wrap gap-2">
        {item.stack.map((tech) => (
          <li
            key={tech}
            className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-ink/[0.03] px-3.5 py-1.5 text-[0.8125rem] font-medium text-mist"
          >
            <span aria-hidden="true" className="g-gradient size-1.5 rounded-full" />
            {tech}
          </li>
        ))}
      </ul>
    </>
  )
}

/**
 * Generated preview. The client has no photography, and a stock image would be
 * worse than none — so the plate is built from the brand's own geometry, with a
 * different attitude per project so the three never read as one asset repeated.
 */
function Plate({ index }) {
  const attitude = [-16, 10, 28]
  const scale = [1, 1.1, 0.94]

  return (
    <div
      aria-hidden="true"
      className="relative grid size-full place-items-center overflow-hidden rounded-[1.75rem] border border-ink/8 bg-abyss"
    >
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
        }}
      />

      <div className="g-gradient absolute size-[18rem] rounded-full opacity-25 blur-[80px]" />

      {[0, 1, 2, 3].map((r) => (
        <span
          key={r}
          className="absolute rounded-full border border-brand-violet"
          style={{
            width: `${8 + r * 4.5}rem`,
            height: `${8 + r * 4.5}rem`,
            opacity: 0.28 - r * 0.055,
          }}
        />
      ))}

      <span
        className="relative block"
        style={{
          transform: `rotate(${attitude[index % 3]}deg) scale(${scale[index % 3]})`,
        }}
      >
        <ArrowGlyph gradient id={`work-plate-${index}`} className="size-24" />
      </span>

      {[
        'top-4 left-4 border-t border-l',
        'top-4 right-4 border-t border-r',
        'bottom-4 left-4 border-b border-l',
        'bottom-4 right-4 border-b border-r',
      ].map((pos) => (
        <span key={pos} className={`absolute size-4 border-ink/25 ${pos}`} />
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Tablet and below — plain stack                                              */
/* -------------------------------------------------------------------------- */

function StackedList() {
  return (
    <ul className="relative mt-12 flex flex-col gap-16">
      {work.items.map((item, i) => (
        <motion.li
          key={item.client}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10% 0px' }}
          transition={{ duration: 0.8, ease: EASE.expo }}
        >
          <div className="mb-8 aspect-[4/3] w-full sm:aspect-[16/9]">
            <Plate index={i} />
          </div>
          <Brief item={item} index={i} total={work.items.length} />
        </motion.li>
      ))}
    </ul>
  )
}
