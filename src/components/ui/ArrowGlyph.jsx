/**
 * The arrow lifted out of the G10X mark, as a reusable vector.
 *
 * It is the brand's load-bearing idea — forward movement, direction, speed —
 * so it recurs across the page as bullets, list markers, road paint and the
 * preloader's assembling core. One shape, many jobs.
 */
export function ArrowGlyph({ className, gradient = false, id = 'ag' }) {
  const gid = `${id}-grad`
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {gradient && (
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#7c2ff4" />
            <stop offset="55%" stopColor="#df4a94" />
            <stop offset="100%" stopColor="#f0655a" />
          </linearGradient>
        </defs>
      )}
      {/* Cursor/arrow silhouette matching the notch inside the logo's G. */}
      <path
        d="M12 50 L88 18 L56 94 L46 58 Z"
        fill={gradient ? `url(#${gid})` : 'currentColor'}
      />
    </svg>
  )
}
