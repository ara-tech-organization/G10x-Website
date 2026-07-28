import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { promises } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'
import { Button } from '@/components/ui/Button'

/**
 * Six commitments on a curved timeline.
 *
 * The spine is an actual bezier that draws itself as you scroll, and each
 * promise hangs off it at an alternating offset. A straight list would have
 * been quicker; the curve is what makes the section feel authored.
 */
export function Promises() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 72%', 'end 55%'],
  })
  const draw = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 26,
    restDelta: 0.001,
  })

  return (
    <SectionShell
      id="promises"
      labelledBy="promises-heading"
      className="relative overflow-hidden"
    >
      <div className="max-w-2xl">
        <Eyebrow>{promises.eyebrow}</Eyebrow>
        <SectionTitle id="promises-heading" className="mt-7">
          Our Promises to{' '}
          <span className="g-gradient-text">Every Client</span>
        </SectionTitle>
        <RevealText className="mt-7 text-lead leading-relaxed text-mist">
          {promises.intro}
        </RevealText>
      </div>

      <div ref={ref} className="relative mt-16 lg:mt-24">
        <CurvedSpine draw={draw} />

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.1)}
          className="relative grid gap-4 md:gap-5 lg:grid-cols-2 lg:gap-x-24 lg:gap-y-16"
        >
          {promises.items.map((item, i) => (
            <motion.li
              key={item.title}
              variants={fadeUp}
              // Alternating vertical offset traces the curve on wide screens.
              className={
                i % 2 === 0 ? 'lg:translate-y-0' : 'lg:translate-y-16'
              }
            >
              <div className="g-panel group relative h-full overflow-hidden rounded-2xl p-7 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 md:p-8">
                <span
                  aria-hidden="true"
                  className="g-gradient pointer-events-none absolute -inset-16 opacity-0 blur-[60px] transition-opacity duration-600 group-hover:opacity-12"
                />

                <div className="relative flex items-start gap-5">
                  {/* Numbered node, sitting on the spine. */}
                  <span className="relative grid size-11 shrink-0 place-items-center rounded-full border border-ink/12">
                    <span
                      aria-hidden="true"
                      className="g-gradient absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <span className="relative font-mono text-[0.75rem] font-semibold tracking-[0.1em] text-chalk tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <div className="min-w-0">
                    <h3 className="text-[1.1875rem] leading-snug font-bold tracking-[-0.02em] text-chalk md:text-[1.3125rem]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-mist">
                      {item.body}
                    </p>
                  </div>
                </div>
              </div>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={fadeUp}
          className="relative mt-14 flex justify-center lg:mt-28"
        >
          <Button href={promises.cta.href} size="lg">
            {promises.cta.label}
          </Button>
        </motion.div>
      </div>
    </SectionShell>
  )
}

/**
 * The spine. Drawn with pathLength so the stroke reveals along its own curve
 * regardless of the viewBox scale, and hidden below lg where the layout is a
 * single column and a curve would have nothing to connect.
 */
function CurvedSpine({ draw }) {
  const opacity = useTransform(draw, [0, 0.06], [0, 1])

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1000 620"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden size-full lg:block"
    >
      <defs>
        <linearGradient id="spine-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c2ff4" />
          <stop offset="50%" stopColor="#df4a94" />
          <stop offset="100%" stopColor="#f0655a" />
        </linearGradient>
      </defs>

      {/* Ghost of the full route. */}
      <path
        d="M 60 40 C 380 40, 420 200, 700 210 C 940 220, 620 400, 320 420 C 90 436, 480 580, 940 590"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Travelled route. */}
      <motion.path
        d="M 60 40 C 380 40, 420 200, 700 210 C 940 220, 620 400, 320 420 C 90 436, 480 580, 940 590"
        fill="none"
        stroke="url(#spine-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        style={{ pathLength: draw, opacity }}
      />
    </svg>
  )
}
