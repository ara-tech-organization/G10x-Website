import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import {
  serviceSections,
  servicesHero,
  servicesSeo,
  totalServices,
} from '@/content/servicesPage'
import { SectionShell } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { usePageMeta } from '@/hooks/usePageMeta'


/**
 * Services index.
 *
 * Shares the home page's vocabulary — the ignition palette, the arrow glyph,
 * gradient hairlines, monospaced eyebrows — but none of its compositions. The
 * home page already uses type-over-3D overlay, sticky travelling rails, a
 * list-plus-readout console, uniform tile grids, marquee lanes, pinned
 * horizontal scrollers, gauges, a drawn spine and a channel strip. This page
 * therefore uses the two structures none of those do: a hard split-screen hero
 * with no scrim at all, and a packed mosaic in which the group heading is
 * itself a tile in the grid.
 */
export function Services() {
  usePageMeta({
    title: servicesSeo.title,
    description: servicesSeo.description,
    path: servicesSeo.path,
    keywords: servicesSeo.keywords,
    twitterTitle: servicesSeo.twitterTitle,
  })

  return (
    <>
      <SplitHero />
      <CapabilityMosaic />
      <ServicesCta />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Hero — hard split                                                           */
/* -------------------------------------------------------------------------- */

/**
 * A true split rather than an overlay.
 *
 * The writing sits on solid ground and the right-hand half is a clear window
 * onto the page-wide stage, so the particle cloud is never dimmed by a scrim
 * and the type never competes with it. Below `lg` the window becomes a banner
 * above the copy rather than behind it.
 */
function SplitHero() {
  return (
    <section
      id="top"
      aria-labelledby="services-h1"
      className="relative grid lg:min-h-[92svh] lg:grid-cols-[1.08fr_1fr]"
    >
      {/* ---- Writing half ------------------------------------------- */}
      <div className="g-noise relative order-2 flex items-center bg-void px-6 pt-16 pb-20 md:px-10 lg:order-1 lg:py-32 lg:pr-16 lg:pl-14">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger(0.09, 0.2)}
          className="relative w-full max-w-2xl lg:ml-auto"
        >
          <motion.span
            variants={fadeUp}
            className="g-label flex items-center gap-3 text-accent"
          >
            <ArrowGlyph gradient id="svc-eyebrow" className="size-3" />
            {servicesHero.eyebrow}
          </motion.span>

          {/* The document's H1 is one long sentence. It is set as a strong
              lead with the qualifying clause beneath, so it stays scannable
              without a word being changed — the full string is still the
              accessible name of the heading. */}
          <h1 id="services-h1" className="mt-7">
            <span className="sr-only">{servicesHero.h1}</span>
            <motion.span
              variants={fadeUp}
              aria-hidden="true"
              className="text-display block leading-[1.04] font-extrabold tracking-[-0.035em] text-balance text-chalk lg:leading-[0.95]"
            >
              Our <span className="g-gradient-text">Services</span>
            </motion.span>
            <motion.span
              variants={fadeUp}
              aria-hidden="true"
              className="mt-5 block text-[clamp(1rem,1.5vw,1.3125rem)] leading-snug font-semibold text-balance text-mist"
            >
              {servicesHero.h1Rest}
            </motion.span>
          </h1>

          {servicesHero.body.map((para, i) => (
            <motion.p
              key={i}
              variants={fadeUp}
              className="mt-6 text-[0.9375rem] leading-relaxed text-mist md:text-base"
            >
              {para}
            </motion.p>
          ))}

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-wrap items-center gap-3.5"
          >
            {servicesHero.ctas.map((cta) => (
              <Button
                key={cta.label}
                href={cta.href}
                size="lg"
                variant={cta.primary ? 'primary' : 'outline'}
                icon={Boolean(cta.primary)}
              >
                {cta.label}
              </Button>
            ))}
          </motion.div>

          <motion.dl
            variants={fadeUp}
            className="mt-12 grid grid-cols-3 gap-4 border-t border-ink/10 pt-6"
          >
            {[
              { k: 'Services', v: String(totalServices).padStart(2, '0') },
              {
                k: 'Disciplines',
                v: String(serviceSections.length).padStart(2, '0'),
              },
              { k: 'Base', v: 'Thanjavur' },
            ].map((stat) => (
              <div key={stat.k}>
                <dd className="g-gradient-text text-[1.375rem] leading-none font-black tabular-nums">
                  {stat.v}
                </dd>
                <dt className="g-label mt-2 text-dim">{stat.k}</dt>
              </div>
            ))}
          </motion.dl>
        </motion.div>
      </div>

      {/* ---- Scene half --------------------------------------------- */}
      <div
        aria-hidden="true"
        className="relative order-1 h-[46svh] overflow-hidden lg:order-2 lg:h-auto"
      >
        <StaticBackdrop />

      </div>
    </section>
  )
}

/** Range rings framing the window onto the stage. */
function StaticBackdrop() {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden">
      <div className="g-gradient absolute size-[30rem] rounded-full opacity-[0.16] blur-[120px]" />
      {[1, 0.72, 0.48, 0.28].map((s, i) => (
        <span
          key={s}
          className="absolute size-[30rem] rounded-full border border-brand-violet"
          style={{ transform: `scale(${s})`, opacity: 0.16 - i * 0.03 }}
        />
      ))}
      {/* What the page-wide stage measures itself against. It shares the rings'
          box exactly, so the particle wordmark centres on the bullseye rather
          than on the column — the two are not the same point once the column
          carries anything else, and the rings are what the eye reads as the
          centre. */}
      <span
        data-stage-anchor
        className="pointer-events-none absolute size-[30rem] rounded-full"
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Capability mosaic                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Column counts chosen so every group packs exactly, with no orphan cell.
 *
 * Each grid holds the heading tile plus that group's services, so the cell
 * count is `items + 1`: 4 → four columns, 3 and 6 → three. The heading being a
 * tile rather than a band above the grid is what removes the dead space the
 * previous layout left beside it.
 */
const COLS = { 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4', 6: 'lg:grid-cols-3' }

const NUMBERED = (() => {
  let n = 0
  return serviceSections.map((section) => ({
    ...section,
    items: section.items.map((item) => ({ ...item, n: ++n })),
  }))
})()

function CapabilityMosaic() {
  return (
    <SectionShell className="pt-16 md:pt-20">
      <div className="flex flex-col gap-4 lg:gap-5">
        {NUMBERED.map((section) => (
          <GroupMosaic key={section.heading} section={section} />
        ))}
      </div>
    </SectionShell>
  )
}

function GroupMosaic({ section }) {
  const headingId = `group-${section.index}`
  const cells = section.items.length + 1

  return (
    <motion.section
      aria-labelledby={headingId}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(0.07)}
      className={cn(
        'grid gap-4 sm:grid-cols-2 lg:gap-5',
        COLS[cells] ?? 'lg:grid-cols-3',
      )}
    >
      {/* The heading, as the first tile in the grid. */}
      <motion.div variants={fadeUp} className="min-w-0">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-7 md:p-8">
          <span aria-hidden="true" className="g-gradient-fill absolute inset-0" />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, rgba(255,255,255,0.85) 1px, transparent 1px)',
              backgroundSize: '34px 34px',
            }}
          />

          {/* Literal white throughout: this tile sits on the gradient fill,
              which does not invert, so its text must not either. */}
          <span className="relative font-mono text-[0.6875rem] tracking-[0.28em] text-white/70 tabular-nums">
            {section.index}
          </span>

          <div className="relative mt-10">
            <h2
              id={headingId}
              className="text-[clamp(1.375rem,2.1vw,1.75rem)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance text-white"
            >
              {section.heading}
            </h2>
            <span className="mt-3 block font-mono text-[0.6875rem] tracking-[0.28em] text-white/70 uppercase tabular-nums">
              {String(section.items.length).padStart(2, '0')} services
            </span>
          </div>
        </div>
      </motion.div>

      {section.items.map((item) => (
        <ServiceTile key={item.title} item={item} />
      ))}
    </motion.section>
  )
}

/**
 * One service. The accent is a full-height bar on the leading edge that widens
 * on hover — distinct from the home page's tiles, which light a hairline along
 * their top edge.
 */
function ServiceTile({ item }) {
  return (
    <motion.div variants={fadeUp} className="min-w-0">
      <Link
        to={item.href}
        className="g-panel group relative flex h-full flex-col overflow-hidden rounded-2xl p-7 pl-8 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 md:p-8 md:pl-9"
      >
        <span
          aria-hidden="true"
          className="g-gradient absolute inset-y-0 left-0 w-[3px] origin-left transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[6px]"
        />
        <span
          aria-hidden="true"
          className="g-gradient pointer-events-none absolute -inset-24 opacity-0 blur-[80px] transition-opacity duration-600 group-hover:opacity-10"
        />

        {/* Oversized index, ghosted into the corner. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-3 right-3 text-[4.5rem] leading-none font-black text-ink/[0.04] tabular-nums transition-colors duration-500 select-none group-hover:text-ink/[0.07]"
        >
          {String(item.n).padStart(2, '0')}
        </span>

        <span className="g-label relative text-accent">{item.abbr}</span>

        <h3 className="relative mt-5 text-[1.0625rem] leading-snug font-bold tracking-[-0.025em] text-chalk md:text-[1.1875rem]">
          {item.title}
        </h3>

        <p className="relative mt-3.5 text-[0.875rem] leading-relaxed text-mist">
          {item.body}
        </p>

        <span className="relative mt-auto flex items-center gap-2 pt-7 text-[0.8125rem] font-semibold text-chalk">
          <span className="relative">
            View More
            <span
              aria-hidden="true"
              className="g-gradient absolute -bottom-1 left-0 h-[1.5px] w-full origin-left scale-x-0 rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
            />
          </span>
          <ArrowUpRight
            className="size-3.5 transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.4}
            aria-hidden="true"
          />
        </span>
      </Link>
    </motion.div>
  )
}

/* -------------------------------------------------------------------------- */
/* Closing call to action                                                      */
/* -------------------------------------------------------------------------- */

function ServicesCta() {
  return (
    <SectionShell className="pt-4">
      <motion.div
        initial={{ opacity: 0, y: 44 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1, ease: EASE.expo }}
        className="g-panel relative overflow-hidden rounded-3xl"
      >
        <span
          aria-hidden="true"
          className="g-gradient absolute inset-x-0 top-0 h-[2px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="g-gradient absolute -top-28 -right-24 size-[30rem] rounded-full opacity-[0.1] blur-[120px]" />
        </div>

        <div className="relative flex flex-col items-start gap-9 p-9 md:p-14 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <ArrowGlyph gradient id="services-cta" className="size-4" />
            <h2 className="mt-6 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.08] font-black tracking-[-0.035em] text-balance text-chalk sm:leading-[1.02]">
              Not sure which service you need?
            </h2>
            <p className="mt-5 max-w-xl text-lead leading-relaxed text-mist">
              Every plan starts with a free call. We will tell you what your
              business actually needs — even when that is less than you expected.
            </p>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button href="/contact-us" size="lg">
              Talk to Us
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              Explore Pricing
            </Button>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}
