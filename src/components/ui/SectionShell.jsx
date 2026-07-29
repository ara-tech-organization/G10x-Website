import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { ArrowGlyph } from './ArrowGlyph'

/**
 * Section container. Owns only rhythm and the shared eyebrow treatment —
 * deliberately not a layout, because every section on this page lays itself
 * out differently.
 */
export function SectionShell({
  id,
  children,
  className,
  containerClassName,
  labelledBy,
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      // Padding is halved between neighbours: two adjacent sections each
      // contribute their own, so `lg:py-40` was stacking 320px of empty ground
      // between every pair. These values still read as generous once doubled.
      className={cn('relative w-full py-16 md:py-20 lg:py-24', className)}
    >
      <div
        className={cn(
          'mx-auto w-full max-w-[86rem] px-6 md:px-10 lg:px-14',
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  )
}

/** Eyebrow: arrow glyph + monospaced label. The page's consistent "you are here". */
export function Eyebrow({ children, className, align = 'left' }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={stagger(0.07)}
      className={cn(
        'flex items-center gap-3',
        align === 'center' && 'justify-center',
        className,
      )}
    >
      <motion.span variants={fadeUp} className="flex items-center gap-3">
        <ArrowGlyph gradient id={`eb-${children}`} className="size-3.5" />
        <span className="g-label text-mist">{children}</span>
      </motion.span>
      <motion.span
        variants={{
          hidden: { scaleX: 0, opacity: 0 },
          show: {
            scaleX: 1,
            opacity: 1,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1] },
          },
        }}
        style={{ transformOrigin: 'left' }}
        className="g-rule w-16 md:w-24"
        aria-hidden="true"
      />
    </motion.div>
  )
}

/** Display heading. `accent` words render in the brand ramp. */
export function SectionTitle({ children, id, className, size = 'display' }) {
  const sizes = {
    display: 'text-display',
    title: 'text-title',
  }
  return (
    <h2
      id={id}
      className={cn(
        'font-extrabold leading-[1.1] text-balance sm:leading-[1.02] lg:leading-[0.95]',
        sizes[size],
        className,
      )}
    >
      {children}
    </h2>
  )
}
