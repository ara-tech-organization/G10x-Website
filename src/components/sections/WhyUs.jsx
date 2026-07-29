import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { VIEWPORT, riseFromFloor, stagger } from '@/lib/motion'
import { whyUs } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { useFinePointer } from '@/hooks/usePointer'

/**
 * Six reasons as machined spec tiles.
 *
 * A uniform 3×2 grid, but the tiles are chamfered rather than rounded and each
 * carries an oversized ghost numeral — the register is a spec sheet or a milled
 * faceplate, not another glass card wall. Equal heights on purpose: the earlier
 * asymmetric arrangement read as broken alignment rather than as composition.
 *
 * The chamfer is built from two stacked clipped layers, so the 1px edge stays
 * crisp along the diagonal and can light up in the brand ramp on hover.
 */
export function WhyUs() {
  return (
    <SectionShell
      id="why-us"
      labelledBy="why-heading"
      className="relative overflow-hidden"
    >
      {/* Faint machinist grid — the surface the tiles are cut from. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-3xl">
            <Eyebrow>{whyUs.eyebrow}</Eyebrow>
            <SectionTitle id="why-heading" className="mt-7">
              Why Are Businesses{' '}
              <span className="g-gradient-text">Choosing G10X?</span>
            </SectionTitle>
          </div>
          <RevealText className="max-w-sm text-[0.875rem] leading-relaxed text-mist lg:pb-3">
            {whyUs.intro}
          </RevealText>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.07)}
          className="g-perspective mt-16 grid gap-4 xs:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {whyUs.items.map((item, i) => (
            <SpecTile key={item.title} item={item} index={i} />
          ))}
        </motion.ul>
      </div>
    </SectionShell>
  )
}

function SpecTile({ item, index }) {
  const ref = useRef(null)
  const fine = useFinePointer()

  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const spotlight = useMotionTemplate`radial-gradient(20rem circle at ${mx}px ${my}px, rgba(223,74,148,0.14), transparent 60%)`

  const onPointerMove = (e) => {
    if (!fine || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    mx.set(e.clientX - rect.left)
    my.set(e.clientY - rect.top)
  }

  return (
    <motion.li variants={riseFromFloor} className="min-w-0">
      <motion.div
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          mx.set(-500)
          my.set(-500)
        }}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="group relative h-full"
      >
        {/* Edge layer — 1px of light that follows the chamfer. */}
        <div className="g-chamfer h-full bg-ink/[0.09] p-px transition-colors duration-500 group-hover:bg-transparent">
          <div
            aria-hidden="true"
            className="g-gradient g-chamfer absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-55"
          />

          {/* Inner surface. */}
          <div className="g-chamfer relative flex h-full min-h-[15.5rem] flex-col bg-panel p-7 md:p-8">
            {/* Solid wash so the gradient edge never bleeds through. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-ink/[0.05] via-ink/[0.012] to-transparent"
            />

            {fine && (
              <motion.span
                aria-hidden="true"
                style={{ background: spotlight }}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
              />
            )}

            {/* A short accent rule stands in for the index — the oversized
                ghost numerals duplicated the label and fought the chamfer. */}
            <span
              aria-hidden="true"
              className="g-gradient relative h-[2px] w-8 origin-left rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-150"
            />

            <h3 className="relative mt-7 text-[1.125rem] leading-tight font-bold tracking-[-0.025em] text-chalk md:text-[1.1875rem]">
              {item.title}
            </h3>

            <p className="relative mt-3.5 text-[0.875rem] leading-relaxed text-mist">
              {item.body}
            </p>

            {/* Anchored to the base so the glyph aligns across every tile. */}
            <ArrowGlyph
              gradient
              id={`why-${index}`}
              className="relative mt-auto size-3 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100"
            />
          </div>
        </div>
      </motion.div>
    </motion.li>
  )
}
