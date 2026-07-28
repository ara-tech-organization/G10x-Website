import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { useTheme } from '@/hooks/useTheme'

/**
 * Day / night switch.
 *
 * Borrows the header's pill geometry so it reads as part of the instrument
 * cluster rather than a bolted-on control. The icon shows the theme you will
 * get, not the one you are in — a sun on the dark theme, a moon on the light
 * one — which is the convention users already expect from this control.
 */
export function ThemeToggle({ className }) {
  const { isLight, toggle } = useTheme()
  const next = isLight ? 'dark' : 'light'
  const Icon = isLight ? Moon : Sun

  return (
    <button
      type="button"
      onClick={toggle}
      // The button's own state is the *current* theme, so the label has to
      // spell out the action; an icon-only control gives a screen reader
      // nothing else to go on.
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={cn(
        'group relative grid size-11 shrink-0 place-items-center overflow-hidden',
        'rounded-full border border-ink/12 text-chalk',
        'transition-colors duration-300 hover:border-ink/30',
        className,
      )}
    >
      {/* Brand wash on hover — same treatment as the outline Button. */}
      <span
        aria-hidden="true"
        className="g-gradient absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-12"
      />

      {/* The two icons never coexist, so the swap can share one grid cell and
          arc through it rather than cross-fading in place. */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={next}
          initial={{ rotate: -70, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 70, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.34, ease: EASE.expo }}
          className="relative grid place-items-center"
        >
          <Icon className="size-[1.15rem]" strokeWidth={2.2} aria-hidden="true" />
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
