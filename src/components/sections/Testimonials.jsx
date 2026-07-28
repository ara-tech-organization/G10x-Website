import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Quote, Radio } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { testimonials } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { useIsTablet, usePrefersReducedMotion } from '@/hooks/useMediaQuery'

const INTERVAL = 6500

/**
 * Testimonials as a channel strip.
 *
 * Three panels sit side by side; the tuned-in one opens to full width while
 * the others compress to vertical spines carrying the client's name. Nothing
 * is hidden behind a "next" button and no space is left empty — which is what
 * the previous single-slide carousel got wrong.
 *
 * Below `lg` the panels stack and all open, because a horizontal accordion in
 * a 380px viewport is unusable.
 */
export function Testimonials() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const reduceMotion = usePrefersReducedMotion()
  const compact = useIsTablet()
  const count = testimonials.items.length

  const go = useCallback(
    (delta) => setActive((i) => (i + delta + count) % count),
    [count],
  )

  // Autoplay only while the strip is collapsed, unattended and motion allowed.
  useEffect(() => {
    if (paused || reduceMotion || compact) return
    const id = setInterval(() => go(1), INTERVAL)
    return () => clearInterval(id)
  }, [paused, reduceMotion, compact, go])

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      go(-1)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      go(1)
    }
  }

  return (
    <SectionShell
      id="testimonials"
      labelledBy="testimonials-heading"
      className="relative overflow-hidden bg-abyss"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/3 opacity-[0.07] blur-[130px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </div>

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow>{testimonials.eyebrow}</Eyebrow>
            <SectionTitle id="testimonials-heading" className="mt-7">
              What Our Clients{' '}
              <span className="g-gradient-text">Are Saying</span>
            </SectionTitle>
          </div>

          {testimonials.placeholder && (
            <p className="flex max-w-sm items-start gap-3 text-[0.875rem] leading-relaxed text-dim lg:pb-3">
              <Radio
                className="mt-0.5 size-4 shrink-0 text-brand-pink"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              {testimonials.placeholderNote}
            </p>
          )}
        </div>

        {/* ---- Channel strip ---------------------------------------- */}
        <div
          role="group"
          aria-label="Client testimonials"
          onKeyDown={compact ? undefined : onKeyDown}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
          }}
          className="mt-14 flex flex-col gap-3 lg:mt-20 lg:h-[24rem] lg:flex-row"
        >
          {testimonials.items.map((item, i) => (
            <Channel
              key={item.name}
              item={item}
              index={i}
              total={count}
              open={compact || i === active}
              compact={compact}
              reduceMotion={reduceMotion}
              onOpen={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </SectionShell>
  )
}

function Channel({ item, index, total, open, compact, reduceMotion, onOpen }) {
  const panelId = `testimonial-panel-${index}`
  const tabId = `testimonial-tab-${index}`

  return (
    <motion.article
      // flexGrow/flexBasis drive the open/closed width — but only on the
      // horizontal layout. In the stacked column they would resolve against the
      // main axis and collapse every panel's height to zero, so the compact
      // layout sizes to content instead.
      animate={compact ? undefined : { flexGrow: open ? 3 : 0.55 }}
      transition={
        reduceMotion ? { duration: 0 } : { duration: 0.85, ease: EASE.expo }
      }
      style={compact ? undefined : { flexBasis: 0 }}
      className={cn(
        'g-panel relative overflow-hidden rounded-3xl',
        !compact && 'min-w-0',
      )}
    >
      {/* Top rail lights on the tuned-in channel. */}
      <span
        aria-hidden="true"
        className={cn(
          'g-gradient absolute inset-x-0 top-0 h-[1.5px] origin-left transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          open ? 'scale-x-100' : 'scale-x-0',
        )}
      />

      {/* ---- Collapsed spine (desktop only) ---------------------- */}
      {!compact && !open && (
        <button
          type="button"
          id={tabId}
          aria-expanded={false}
          aria-controls={panelId}
          onClick={onOpen}
          onMouseEnter={onOpen}
          onFocus={onOpen}
          className="group absolute inset-0 flex flex-col items-center justify-between py-8"
        >
          <span className="font-mono text-[0.625rem] tracking-[0.24em] text-dim tabular-nums">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* Name set vertically along the spine. */}
          <span
            className="text-[1.0625rem] font-bold tracking-[-0.01em] whitespace-nowrap text-mist transition-colors duration-400 group-hover:text-chalk"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {item.name}
          </span>

          {/* Signal bars — the section's namesake, and the affordance. */}
          <span aria-hidden="true" className="flex items-end gap-[3px]">
            {[6, 11, 8, 13].map((h, b) => (
              <span
                key={b}
                style={{ height: h, transitionDelay: `${b * 55}ms` }}
                className="w-[2px] rounded-full bg-ink/20 transition-colors duration-400 group-hover:bg-linear-to-t group-hover:from-brand-purple group-hover:to-brand-coral"
              />
            ))}
          </span>
        </button>
      )}

      {/* ---- Open panel ------------------------------------------ */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role={compact ? undefined : 'region'}
            aria-labelledby={compact ? undefined : tabId}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE.expo, delay: open ? 0.2 : 0 }}
            className="relative flex h-full flex-col justify-between p-7 md:p-10 lg:min-w-[18rem] lg:p-12"
          >
            <Quote
              className="pointer-events-none absolute -top-2 right-6 size-32 text-chalk/[0.03] md:size-44"
              strokeWidth={1}
              aria-hidden="true"
            />

            <blockquote className="relative">
              <p className="max-w-3xl text-[clamp(1.25rem,2.3vw,1.875rem)] leading-[1.28] font-bold tracking-[-0.025em] text-chalk">
                “{item.quote}”
              </p>
            </blockquote>

            <footer className="relative mt-10 flex items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                {/* Monogram plate — no stock avatars exist for these. */}
                <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-ink/12">
                  <span
                    aria-hidden="true"
                    className="g-gradient absolute inset-0 rounded-full opacity-20 blur-[10px]"
                  />
                  <span className="g-gradient-text relative text-base font-black">
                    {item.name.charAt(0)}
                  </span>
                </span>
                <div>
                  <cite className="block text-[1.0625rem] font-bold tracking-[-0.02em] text-chalk not-italic">
                    {item.name}
                  </cite>
                  <span className="mt-0.5 block text-[0.875rem] text-mist">
                    {item.role}
                  </span>
                </div>
              </div>

              <span
                className="font-mono text-[0.6875rem] tracking-[0.24em] text-dim tabular-nums"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}/
                {String(total).padStart(2, '0')}
              </span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}
