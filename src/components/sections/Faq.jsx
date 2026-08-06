import { useId, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { faq } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'

/**
 * FAQ as a disclosure list.
 *
 * Proper button/region wiring with aria-expanded and aria-controls, one panel
 * open at a time, and the question itself picks up the brand ramp while open —
 * so the open state is legible without relying on the icon alone.
 */
export function Faq() {
  const [openIndex, setOpenIndex] = useState(0)
  const baseId = useId()

  return (
    <SectionShell id="faq" labelledBy="faq-heading" className="relative">
      <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        {/* Sticky prompt column. */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <SectionTitle id="faq-heading" className="mt-7">
            Frequently Asked{' '}
            <span className="g-gradient-text">Questions (FAQs)</span>
          </SectionTitle>

          <p className="mt-7 max-w-sm text-[1rem] leading-relaxed text-mist">
            Still unsure about something? A short call answers more than a page
            of copy ever will.
          </p>

          <div className="mt-9">
            <Button href="#contact" variant="outline">
              Ask Us Directly
            </Button>
          </div>
        </div>

        {/* Disclosure list. */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.07)}
          className="border-t border-ink/8"
        >
          {faq.items.map((item, i) => {
            const open = openIndex === i
            const panelId = `${baseId}-panel-${i}`
            const buttonId = `${baseId}-button-${i}`

            return (
              <motion.div
                key={item.q}
                variants={fadeUp}
                className="border-b border-ink/8"
              >
                {/* H4 per the content spec — these sit under the section's H2. */}
                <h4>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    className="group relative flex w-full items-start gap-5 py-7 text-left"
                  >
                    {/* Left rail lights while open. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'g-gradient absolute top-6 bottom-6 -left-4 w-[2px] origin-center rounded-full transition-transform duration-500',
                        open ? 'scale-y-100' : 'scale-y-0',
                      )}
                    />

                    <span
                      className="mt-1 shrink-0 font-mono text-[0.6875rem] tracking-[0.24em] text-dim tabular-nums"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <span
                      className={cn(
                        'flex-1 text-[1rem] leading-snug font-bold tracking-[-0.02em] transition-colors duration-400 md:text-[1.125rem]',
                        open
                          ? 'g-gradient-text'
                          : 'text-chalk/85 group-hover:text-chalk',
                      )}
                    >
                      {item.q}
                    </span>

                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        open
                          ? 'rotate-45 border-brand-pink/60 text-accent'
                          : 'border-ink/14 text-mist group-hover:border-ink/32',
                      )}
                    >
                      <Plus className="size-4" strokeWidth={2.4} />
                    </span>
                  </button>
                </h4>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: EASE.expo }}
                      className="overflow-hidden"
                    >
                      <p className="pr-12 pb-8 pl-[3.25rem] text-[0.9375rem] leading-relaxed text-mist">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* A collapsed panel is unmounted, so four of the five answers
                    would be absent from the document. The FAQPage schema
                    declares all five, and Google expects schema content to be
                    present on the page — this keeps the answer in the DOM for
                    crawlers without showing it twice when the panel opens. */}
                {!open && <p className="sr-only">{item.a}</p>}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </SectionShell>
  )
}
