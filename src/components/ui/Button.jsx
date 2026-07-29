import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { useMagnetic } from '@/hooks/useMagnetic'
import { scrollToTarget } from '@/hooks/useLenis'

/**
 * The page's only button. Three visual weights, one behaviour:
 * it leans toward the cursor, and a light sweep crosses it on hover.
 *
 * Renders as <a> when `href` is present, <button> otherwise, so semantics
 * always match intent.
 */
export function Button({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon = true,
  className,
  onClick,
  ...rest
}) {
  const { ref, x, y, onPointerMove, onPointerLeave } = useMagnetic({
    strength: variant === 'primary' ? 10 : 7,
  })

  const isInternalHash = href?.startsWith('#')

  const handleClick = (e) => {
    if (isInternalHash) {
      e.preventDefault()
      scrollToTarget(href)
    }
    onClick?.(e)
  }

  const sizes = {
    sm: 'h-11 px-5 text-[0.875rem]',
    md: 'h-[3.25rem] px-7 text-[0.875rem]',
    lg: 'h-[3.75rem] px-9 text-base',
  }

  const variants = {
    // Literal white, not --color-chalk: this label sits on the gradient fill,
    // which does not change between themes, so the text must not either.
    primary: 'text-white',
    outline: 'text-chalk border border-ink/20 hover:border-ink/45',
    ghost: 'text-mist hover:text-chalk',
  }

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      ref={ref}
      href={href}
      onClick={handleClick}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ x, y }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'group relative inline-flex shrink-0 items-center justify-center gap-2.5',
        'overflow-hidden rounded-full font-semibold tracking-[-0.01em]',
        'transition-colors duration-300 will-change-transform',
        sizes[size],
        variants[variant],
        className,
      )}
      {...(href && !isInternalHash && href.startsWith('http')
        ? { target: '_blank', rel: 'noopener noreferrer' }
        : {})}
      {...rest}
    >
      {variant === 'primary' && (
        <>
          {/* Deepened ramp: white label text has to clear WCAG AA across the
              whole fill, which the display gradient does not. */}
          <span className="g-gradient-fill absolute inset-0" aria-hidden="true" />
          {/* Specular sweep — a headlight passing across the surface. Also
              literal white: it is a highlight on the gradient, not on the
              page, so inverting it with the theme would turn it into a smear
              of shadow. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-full"
          />
        </>
      )}

      {variant === 'outline' && (
        <span
          aria-hidden="true"
          className="g-gradient absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-12"
        />
      )}

      <span className="relative z-10 flex items-center gap-2.5">
        {children}
        {icon && (
          <ArrowUpRight
            className="size-[1.05em] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2.4}
            aria-hidden="true"
          />
        )}
      </span>
    </Tag>
  )
}
