import { motion } from 'framer-motion'
import { VIEWPORT, fadeUp } from '@/lib/motion'
import { industries } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'
import { Marquee } from '@/components/ui/Marquee'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'

/**
 * Industries as passing signage.
 *
 * Three lanes of oversized outlined type scroll in alternating directions;
 * hovering a name floods it with the brand ramp. Reads as roadside boards seen
 * at speed — and it holds ten long labels without a single card.
 */
export function Industries() {
  // Split into three uneven lanes so the rows never line up into a grid.
  const lanes = [
    industries.items.slice(0, 4),
    industries.items.slice(4, 7),
    industries.items.slice(7),
  ]

  return (
    <SectionShell
      id="industries"
      labelledBy="industries-heading"
      className="relative overflow-hidden bg-abyss py-16 md:py-20 lg:py-24"
      containerClassName="max-w-none px-0 md:px-0 lg:px-0"
    >
      <div className="mx-auto w-full max-w-[86rem] px-6 md:px-10 lg:px-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <Eyebrow>{industries.eyebrow}</Eyebrow>
            <SectionTitle id="industries-heading" className="mt-7">
              Industries <span className="g-gradient-text">We Serve</span>
            </SectionTitle>
          </div>
          <RevealText className="max-w-md text-lead leading-relaxed text-mist lg:pb-2">
            {industries.intro}
          </RevealText>
        </div>
      </div>

      {/* ---- Signage lanes ------------------------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.2 }}
        className="mt-16 flex flex-col gap-2 md:mt-20 md:gap-3"
      >
        {lanes.map((lane, laneIndex) => (
          <Marquee
            key={laneIndex}
            speed={38 + laneIndex * 11}
            reverse={laneIndex % 2 === 1}
            className="py-1"
          >
            {lane.map((name) => (
              <IndustryPlate key={name} name={name} />
            ))}
          </Marquee>
        ))}
      </motion.div>

      {/* ---- Outro --------------------------------------------------- */}
      <div className="mx-auto mt-16 w-full max-w-[86rem] px-6 md:mt-20 md:px-10 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="g-panel flex flex-col items-start justify-between gap-6 rounded-3xl p-8 md:flex-row md:items-center md:p-10"
        >
          <p className="max-w-lg text-[1.25rem] leading-snug font-semibold tracking-[-0.025em] text-chalk md:text-[1.4375rem]">
            {industries.outro}
          </p>
          <Button href={industries.cta.href} size="lg" className="shrink-0">
            {industries.cta.label}
          </Button>
        </motion.div>
      </div>
    </SectionShell>
  )
}

/**
 * One board. Outlined by default, flooded on hover — the reveal is the point,
 * so the label stays fully legible in both states.
 */
function IndustryPlate({ name }) {
  return (
    <span className="group flex shrink-0 items-center gap-6 pr-8 md:gap-9 md:pr-12">
      <span className="relative block text-[clamp(1.5625rem,4.048vw,3.3125rem)] leading-none font-black tracking-[-0.035em] whitespace-nowrap">
        {/* Base: hollow, low-contrast. */}
        <span className="text-chalk/22 transition-colors duration-500 group-hover:text-transparent">
          {name}
        </span>
        {/* Overlay: the gradient fill, wiped in from the left. */}
        <span
          aria-hidden="true"
          className="g-gradient-text absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        >
          {name}
        </span>
      </span>

      <ArrowGlyph
        gradient
        id={`ind-${name.slice(0, 5)}`}
        className="size-3 shrink-0 opacity-30 transition-opacity duration-500 group-hover:opacity-100 md:size-4"
      />
    </span>
  )
}
