import { cn } from '@/lib/cn'
import lightWebp320 from '@/assets/optimized/logo-light-320.webp'
import lightWebp640 from '@/assets/optimized/logo-light-640.webp'
import lightPng640 from '@/assets/optimized/logo-light-640.png'
import darkWebp320 from '@/assets/optimized/logo-dark-320.webp'
import darkWebp640 from '@/assets/optimized/logo-dark-640.webp'
import darkPng640 from '@/assets/optimized/logo-dark-640.png'

/**
 * The supplied G10X lockups.
 *
 * Two files ship with the brand: `Header.png` (navy "10X" — built for light
 * surfaces) and `Footer.png` (white "10X" — built for dark surfaces). Because
 * this entire experience sits on #050814, the light-on-dark lockup is the one
 * that stays legible, so it is the default. Pass `variant="dark"` for the navy
 * lockup if a light panel is ever introduced.
 *
 * Sources are the WebP/PNG variants produced by `npm run optimize:logos` — the
 * originals are 6160px wide and never render above ~240px, so shipping them
 * raw would cost 1.4 MB for two images.
 */
const SOURCES = {
  light: {
    webp: `${lightWebp320} 320w, ${lightWebp640} 640w`,
    png: lightPng640,
  },
  dark: {
    webp: `${darkWebp320} 320w, ${darkWebp640} 640w`,
    png: darkPng640,
  },
}

// Intrinsic ratio of the supplied artwork (6160 × 2533), carried through so
// the browser reserves the right box and never shifts layout.
const W = 640
const H = 263

export function Logo({ variant = 'light', className, priority = false, sizes = '240px' }) {
  const source = SOURCES[variant] ?? SOURCES.light

  return (
    <picture>
      <source type="image/webp" srcSet={source.webp} sizes={sizes} />
      <img
        src={source.png}
        alt="G10X Private Limited — Defy Limits"
        width={W}
        height={H}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        className={cn('h-auto select-none', className)}
      />
    </picture>
  )
}

/**
 * Logo as a home link. Scale-on-hover only — the mark is the one thing on the
 * page that should never feel gimmicky.
 */
export function LogoLink({ className, imgClassName, variant = 'light' }) {
  return (
    <a
      href="/"
      aria-label="G10X Private Limited — home"
      className={cn(
        'group relative inline-flex items-center transition-opacity duration-300 hover:opacity-90',
        className,
      )}
    >
      <Logo
        variant={variant}
        priority
        sizes="(max-width: 768px) 136px, 160px"
        className={cn(
          'transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]',
          imgClassName,
        )}
      />
    </a>
  )
}
