import { cn } from '@/lib/cn'

/**
 * Infinite marquee, CSS-driven so it costs nothing on the main thread.
 *
 * The track is duplicated once and the pair translated by exactly -50%, which
 * is what makes the loop seamless. The duplicate is `aria-hidden` so screen
 * readers hear the content once, and the wrapper is a plain element rather than
 * `role="marquee"` — that role is a live region, and this is decorative motion
 * over static content, not an announcement.
 *
 * The keyframes live in index.css (`g-marquee`) so several marquees on one page
 * share a single rule instead of injecting a <style> block each.
 */

/** One copy of the content. Declared at module scope so its identity is stable. */
function Track({ items, className, duplicate }) {
  return (
    <div
      className={cn('flex shrink-0 items-center', className)}
      aria-hidden={duplicate || undefined}
    >
      {items}
    </div>
  )
}

export function Marquee({
  children,
  speed = 38,
  reverse = false,
  pauseOnHover = true,
  className,
  itemClassName,
}) {
  const items = Array.isArray(children) ? children : [children]

  return (
    <div
      className={cn(
        'g-edge-fade-x group relative flex overflow-hidden',
        className,
      )}
    >
      <div
        className={cn(
          'flex w-max animate-[g-marquee_linear_infinite] motion-reduce:animate-none',
          pauseOnHover && 'group-hover:[animation-play-state:paused]',
        )}
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
      >
        <Track items={items} className={itemClassName} />
        <Track items={items} className={itemClassName} duplicate />
      </div>
    </div>
  )
}
