import { motion } from 'framer-motion'
import { VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { tools } from '@/content/site'
import { Eyebrow, SectionShell, SectionTitle } from '@/components/ui/SectionShell'
import { RevealText } from '@/components/ui/Reveal'

/**
 * The toolchain, laid out as a wiring diagram.
 *
 * Eight platforms sit on a blueprint grid, connected by hairlines that draw
 * themselves in. The point is legibility of the *system* — which tool does
 * which job — not a logo wall we do not have the assets for.
 */
export function Toolstack() {
  return (
    <SectionShell
      id="technology"
      labelledBy="tools-heading"
      className="relative overflow-hidden bg-abyss"
    >
      {/* Blueprint grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/3 size-[34rem] opacity-[0.07] blur-[130px]"
      >
        <div className="g-gradient size-full rounded-full" />
      </div>

      <div className="relative">
        <div className="max-w-2xl">
          <Eyebrow>{tools.eyebrow}</Eyebrow>
          <SectionTitle id="tools-heading" className="mt-7">
            The Tools Behind{' '}
            <span className="g-gradient-text">Our Strategy</span>
          </SectionTitle>
          <RevealText className="mt-7 text-lead leading-relaxed text-mist">
            {tools.intro}
          </RevealText>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.06)}
          className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-ink/8 bg-ink/[0.06] xs:grid-cols-2 lg:mt-20 lg:grid-cols-4"
        >
          {tools.items.map((tool, i) => (
            <ToolCell key={tool.name} tool={tool} index={i} />
          ))}
        </motion.ul>
      </div>
    </SectionShell>
  )
}

/**
 * A single node in the diagram. Hairline borders come from the parent's 1px
 * gap showing through, which is what keeps the grid perfectly even at every
 * breakpoint without border-collapse gymnastics.
 */
function ToolCell({ tool, index }) {
  return (
    <motion.li variants={fadeUp} className="group relative bg-void">
      <div className="relative flex h-full min-h-[13rem] flex-col justify-between p-7 transition-colors duration-500 group-hover:bg-panel/70">
        {/* Corner registration marks — blueprint detailing. */}
        <span
          aria-hidden="true"
          className="absolute top-4 left-4 size-2 border-t border-l border-ink/15 transition-colors duration-500 group-hover:border-brand-pink"
        />
        <span
          aria-hidden="true"
          className="absolute right-4 bottom-4 size-2 border-r border-b border-ink/15 transition-colors duration-500 group-hover:border-brand-coral"
        />

        {/* Beam that ignites across the top edge on hover. */}
        <span
          aria-hidden="true"
          className="g-gradient absolute inset-x-0 top-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
        />

        <div className="flex items-start justify-between">
          <span
            className="font-mono text-[0.6875rem] tracking-[0.24em] text-dim tabular-nums transition-colors duration-500 group-hover:text-accent"
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          {/* Signal bars: reads as a connected instrument. */}
          <span aria-hidden="true" className="flex items-end gap-[3px]">
            {[3, 6, 9, 12].map((h, b) => (
              <span
                key={h}
                style={{ height: h, transitionDelay: `${b * 50}ms` }}
                className="w-[2px] rounded-full bg-ink/18 transition-colors duration-400 group-hover:bg-linear-to-t group-hover:from-brand-purple group-hover:to-brand-coral"
              />
            ))}
          </span>
        </div>

        <div>
          <h3 className="text-[1rem] leading-snug font-bold tracking-[-0.02em] text-chalk">
            {tool.name}
          </h3>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-mist">
            {tool.role}
          </p>
        </div>
      </div>
    </motion.li>
  )
}
