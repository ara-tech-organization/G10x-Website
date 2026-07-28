import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { pricing } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'

/**
 * Pricing, without a price table.
 *
 * The client's model is explicitly "scoped on a free call", so inventing tiers
 * would be a lie dressed as a design decision. Instead this is a single
 * perspective slab that states the model plainly — one honest panel reads more
 * premium than three fake ones.
 */
export function Pricing() {
  return (
    <SectionShell
      id="pricing"
      labelledBy="pricing-heading"
      className="relative overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 60, rotateX: -10 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.15, ease: EASE.expo }}
        className="g-perspective relative"
      >
        <div className="g-panel relative overflow-hidden rounded-[2rem] p-8 md:p-14 lg:p-16">
          {/* Ambient glow, weighted to the right where the CTA sits. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-32 -right-24 size-[32rem] opacity-[0.13] blur-[120px]"
          >
            <div className="g-gradient size-full rounded-full" />
          </div>

          {/* Machined edge lines. */}
          <span
            aria-hidden="true"
            className="g-gradient absolute inset-x-0 top-0 h-[1.5px]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                'linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 70%, transparent) 1px, transparent 1px)',
              backgroundSize: '56px 56px',
            }}
          />

          <div className="relative grid gap-12 lg:grid-cols-[1.25fr_1fr] lg:items-end lg:gap-20">
            <div>
              <Eyebrow>{pricing.eyebrow}</Eyebrow>
              <SectionTitle id="pricing-heading" className="mt-7">
                Transparent Pricing,{' '}
                <span className="g-gradient-text">No Surprises</span>
              </SectionTitle>
              <p className="mt-7 max-w-2xl text-lead leading-relaxed text-mist">
                {pricing.body}
              </p>
            </div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              variants={stagger(0.09, 0.2)}
              className="flex flex-col gap-5"
            >
              <ul className="flex flex-col gap-3.5">
                {pricing.points.map((point) => (
                  <motion.li
                    key={point}
                    variants={fadeUp}
                    className="flex items-start gap-3.5"
                  >
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-ink/12">
                      <Check
                        className="size-3.5 text-accent"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>
                    <span className="text-[1rem] leading-snug font-medium text-chalk">
                      {point}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <motion.div variants={fadeUp} className="pt-3">
                <Button href={pricing.cta.href} size="lg">
                  {pricing.cta.label}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </SectionShell>
  )
}
