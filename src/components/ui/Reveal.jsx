import { motion } from 'framer-motion'
import { VIEWPORT, fadeUp, focusIn } from '@/lib/motion'

/**
 * Generic scroll-triggered reveal wrapper.
 *
 * Sections that need a staggered *group* compose `motion.ul` with
 * `variants={stagger()}` directly — that keeps the list semantics visible at
 * the call site instead of hiding them behind another wrapper.
 */
export function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  as = 'div',
  ...rest
}) {
  const Tag = motion[as] ?? motion.div
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={variants}
      transition={{ delay }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Paragraph that comes into focus, as if resolving at speed. */
export function RevealText({ children, className, delay = 0, as = 'p' }) {
  return (
    <Reveal as={as} variants={focusIn} delay={delay} className={className}>
      {children}
    </Reveal>
  )
}
