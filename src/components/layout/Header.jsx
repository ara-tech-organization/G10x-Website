import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { company, nav } from '@/content/site'
import { LogoLink } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { scrollToTarget } from '@/hooks/useLenis'
import { useTheme } from '@/hooks/useTheme'

/**
 * Navigation that behaves like an instrument binnacle: transparent over the
 * hero, then condensing into a glass rail once the journey starts. It also
 * hides on scroll-down and returns on scroll-up so it never covers content.
 */
export function Header() {
  const { scrollY } = useScroll()
  const { isLight } = useTheme()
  const [condensed, setCondensed] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('')

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setCondensed(y > 40)
    // Only auto-hide well past the hero, and never while the menu is open.
    setHidden(y > 560 && y > prev && !menuOpen)
  })

  // Lock the page behind the mobile sheet.
  useEffect(() => {
    if (!menuOpen) return
    const lenis = window.__lenis
    lenis?.stop()
    document.body.style.overflow = 'hidden'
    return () => {
      lenis?.start()
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  // Close the sheet on Escape.
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // Track the section in view to light up the matching nav item.
  useEffect(() => {
    const sections = nav
      .map((n) => document.querySelector(n.href))
      .filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const go = (href) => (e) => {
    e.preventDefault()
    setMenuOpen(false)
    // Let the sheet begin closing before the scroll starts.
    setTimeout(() => scrollToTarget(href), menuOpen ? 260 : 0)
  }

  return (
    <>
      <motion.header
        initial={{ y: -120 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.6, ease: EASE.expo }}
        className="fixed inset-x-0 top-0 z-[60] will-change-transform"
      >
        <div
          className={cn(
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            condensed
              ? 'g-glass border-b border-ink/8 py-3'
              : 'border-b border-transparent py-5',
          )}
        >
          <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-6 px-6 md:px-10 lg:px-14">
            {/* The brand ships two lockups; "dark" is the navy one, drawn for
                light surfaces. Names refer to the artwork, not the theme. */}
            <LogoLink
              variant={isLight ? 'dark' : 'light'}
              imgClassName={cn(
                'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                condensed ? 'w-[7.25rem] md:w-[8rem]' : 'w-[8.5rem] md:w-[10rem]',
              )}
            />

            <nav
              aria-label="Primary"
              className="hidden items-center gap-1 lg:flex"
            >
              {nav.map((item) => {
                const isActive = active === item.href
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={go(item.href)}
                    aria-current={isActive ? 'true' : undefined}
                    className={cn(
                      'group relative px-4 py-2.5 text-[0.9375rem] font-medium transition-colors duration-300',
                      isActive ? 'text-chalk' : 'text-mist hover:text-chalk',
                    )}
                  >
                    {item.label}
                    {/* Animated underline that grows from the left. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'g-gradient absolute bottom-1.5 left-4 h-[1.5px] origin-left rounded-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
                        'w-[calc(100%-2rem)]',
                        isActive
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </a>
                )
              })}
            </nav>

            <div className="flex items-center gap-2.5">
              <ThemeToggle />

              <a
                href={company.phoneHref}
                className="group hidden items-center gap-2.5 rounded-full border border-ink/12 px-4 py-2.5 text-[0.875rem] font-medium text-mist transition-colors duration-300 hover:border-ink/30 hover:text-chalk md:inline-flex"
              >
                <Phone className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                <span className="tabular-nums">{company.phone}</span>
              </a>

              <Button href="#contact" size="sm" className="hidden sm:inline-flex">
                Talk to Us
              </Button>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="grid size-11 place-items-center rounded-full border border-ink/12 text-chalk transition-colors duration-300 hover:border-ink/30 lg:hidden"
              >
                {menuOpen ? (
                  <X className="size-5" strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <Menu className="size-5" strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <MobileSheet open={menuOpen} onClose={() => setMenuOpen(false)} go={go} />
    </>
  )
}

/**
 * Mobile navigation. Enters as a perspective slab rather than a plain slide —
 * the same camera-move language used for page transitions.
 */
function MobileSheet({ open, onClose, go }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: EASE.expo }}
          className="fixed inset-0 z-[59] lg:hidden"
        >
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="absolute inset-0 bg-abyss/85 backdrop-blur-xl"
          />

          <motion.nav
            aria-label="Mobile"
            initial={{ y: -40, rotateX: -12, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            exit={{ y: -30, rotateX: -8, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE.expo }}
            className="g-perspective absolute inset-x-0 top-[5.5rem] mx-5 origin-top rounded-3xl p-3"
          >
            <div className="g-panel overflow-hidden rounded-3xl p-3">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={go(item.href)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.55,
                    ease: EASE.expo,
                    delay: 0.1 + i * 0.045,
                  }}
                  className="group flex items-baseline justify-between border-b border-ink/6 px-4 py-4 last:border-0"
                >
                  <span className="text-xl font-semibold tracking-[-0.02em] text-chalk">
                    {item.label}
                  </span>
                  <span className="g-label text-dim transition-colors group-hover:text-brand-pink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.a>
              ))}

              <div className="flex flex-col gap-2.5 p-3 pt-4">
                <Button href="#contact" onClick={onClose} className="w-full">
                  Talk to Us
                </Button>
                <Button
                  href={company.phoneHref}
                  variant="outline"
                  icon={false}
                  className="w-full"
                >
                  <Phone className="size-4" strokeWidth={2.4} aria-hidden="true" />
                  {company.phone}
                </Button>
              </div>
            </div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
