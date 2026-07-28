import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { services } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { useIsTablet } from '@/hooks/useMediaQuery'

/**
 * Services as a command console.
 *
 * Six channels listed as illuminated rows on the left; selecting one drives a
 * live readout panel on the right — light beam and facet breakdown. On tablet
 * and below the rows expand in place instead, because a two-pane console does
 * not survive a narrow viewport.
 */
export function Services() {
  const [activeId, setActiveId] = useState(services.items[0].id)
  const compact = useIsTablet()
  const active = services.items.find((s) => s.id === activeId) ?? services.items[0]

  return (
    <SectionShell
      id="services"
      labelledBy="services-heading"
      className="relative"
    >
      {/* Console backlight. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 size-[38rem] opacity-[0.07] blur-[120px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </div>

      <div className="relative">
        <div className="max-w-3xl">
          <Eyebrow>{services.eyebrow}</Eyebrow>
          <SectionTitle id="services-heading" className="mt-7">
            Build! Grow!{' '}
            <span className="g-gradient-text">Dominate Online!</span>
          </SectionTitle>
          <RevealText className="mt-7 text-lead leading-relaxed text-mist">
            {services.intro}
          </RevealText>
        </div>

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          {/* ---- Channel list ---------------------------------------- */}
          <motion.ul
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={stagger(0.07)}
            className="flex flex-col border-t border-ink/8"
          >
            {services.items.map((service) => (
              <ServiceRow
                key={service.id}
                service={service}
                active={service.id === activeId}
                compact={compact}
                onActivate={() => setActiveId(service.id)}
              />
            ))}
          </motion.ul>

          {/* ---- Readout panel (desktop) ----------------------------- */}
          {!compact && (
            <div className="relative lg:sticky lg:top-32 lg:self-start">
              <Readout service={active} />
            </div>
          )}
        </div>
      </div>
    </SectionShell>
  )
}

function ServiceRow({ service, active, compact, onActivate }) {
  return (
    <motion.li variants={fadeUp} className="border-b border-ink/8">
      <button
        type="button"
        onMouseEnter={compact ? undefined : onActivate}
        onFocus={onActivate}
        onClick={onActivate}
        aria-expanded={compact ? active : undefined}
        className="group relative flex w-full items-center gap-5 py-6 text-left md:gap-7 md:py-7"
      >
        {/* Light beam that sweeps in from the left edge on activation. */}
        <span
          aria-hidden="true"
          className={cn(
            'g-gradient absolute inset-y-0 left-0 w-full origin-left rounded-r-2xl opacity-[0.06] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
            active ? 'scale-x-100' : 'scale-x-0',
          )}
        />
        <span
          aria-hidden="true"
          className={cn(
            'g-gradient absolute inset-y-0 left-0 w-[2px] origin-center rounded-full transition-transform duration-500',
            active ? 'scale-y-100' : 'scale-y-0',
          )}
        />

        <span
          className={cn(
            'relative shrink-0 font-mono text-[0.75rem] tracking-[0.2em] tabular-nums transition-colors duration-400',
            active ? 'text-accent' : 'text-dim',
          )}
          aria-hidden="true"
        >
          {service.index}
        </span>

        <span className="relative flex-1">
          <span
            className={cn(
              'block text-[1.375rem] leading-tight font-bold tracking-[-0.025em] transition-colors duration-400 md:text-[1.75rem]',
              active ? 'text-chalk' : 'text-mist group-hover:text-chalk',
            )}
          >
            {service.title}
          </span>

          {/* On narrow screens the row carries its own detail. */}
          <AnimatePresence initial={false}>
            {compact && active && (
              <motion.span
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE.expo }}
                className="block overflow-hidden"
              >
                <span className="block pt-3.5 text-[0.9375rem] leading-relaxed text-mist">
                  {service.body}
                </span>
                <span className="mt-4 flex flex-wrap gap-2">
                  {service.facets.map((f) => (
                    <Facet key={f}>{f}</Facet>
                  ))}
                </span>
                <a
                  href={service.cta.href}
                  className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-chalk"
                >
                  {service.cta.label}
                  <ArrowUpRight className="size-4" strokeWidth={2.4} aria-hidden="true" />
                </a>
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        <ArrowGlyph
          className={cn(
            'relative size-3 shrink-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            active
              ? 'translate-x-1 text-accent'
              : 'text-dim group-hover:translate-x-1',
          )}
        />
      </button>
    </motion.li>
  )
}

/** The live panel: description, facets, and the deep link. */
function Readout({ service }) {
  return (
    <div className="g-panel relative overflow-hidden rounded-3xl p-9 lg:p-10">
      {/* Beam sweeping the top edge. */}
      <span
        aria-hidden="true"
        className="g-gradient absolute inset-x-0 top-0 h-[1.5px]"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={service.id}
          initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: EASE.expo }}
          className="relative"
        >
          <span className="g-label text-accent">{service.abbr}</span>

          <h3 className="mt-4 text-[1.75rem] leading-[1.1] font-bold tracking-[-0.03em] text-chalk">
            {service.title}
          </h3>

          <p className="mt-5 text-[1.0625rem] leading-relaxed text-mist">
            {service.body}
          </p>

          <div className="mt-7">
            <span className="g-label mb-3.5 block text-dim">Included</span>
            <div className="flex flex-wrap gap-2">
              {service.facets.map((facet, i) => (
                <motion.span
                  key={facet}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease: EASE.expo,
                    delay: 0.12 + i * 0.05,
                  }}
                >
                  <Facet>{facet}</Facet>
                </motion.span>
              ))}
            </div>
          </div>

          <a
            href={service.cta.href}
            className="group mt-9 inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-chalk"
          >
            <span className="relative">
              {service.cta.label}
              <span
                aria-hidden="true"
                className="g-gradient absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
              />
            </span>
            <ArrowUpRight
              className="size-4 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              strokeWidth={2.4}
              aria-hidden="true"
            />
          </a>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Facet({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-ink/[0.03] px-3.5 py-1.5 text-[0.8125rem] font-medium text-mist">
      {children}
    </span>
  )
}
