import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, Phone, X } from 'lucide-react'
import { cn } from '@/lib/cn'
import { EASE } from '@/lib/motion'
import { company } from '@/content/site'
import { primaryNav, serviceGroups } from '@/content/navigation'
import { LogoLink } from '@/components/ui/Logo'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/hooks/useTheme'

/**
 * Site navigation, built from the page structure in `content/navigation.js`.
 *
 * Behaviour: transparent over the hero, then settling onto the same dark ground
 * as the footer once the hero has scrolled past. The bar stays pinned for the
 * whole page — an auto-hiding header saves a strip of viewport but takes the
 * nav and the phone number away exactly when someone is reading a section and
 * might want to act on it.
 *
 * In the settled state the bar carries `data-theme="dark"`, which is what lets
 * one attribute re-colour the links, the phone pill and the hairlines to suit
 * the dark ground — in both page themes, with no per-element overrides.
 */
export function Header() {
  const { scrollY } = useScroll()
  const { isLight } = useTheme()
  const location = useLocation()

  const [condensed, setCondensed] = useState(false)
  const [pastHero, setPastHero] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)

  // Whether this page has a hero to measure the transparent phase against.
  const hasHero = useRef(true)
  const megaTimer = useRef(null)

  useMotionValueEvent(scrollY, 'change', (y) => {
    setCondensed(y > 40)
    // Pages without a hero have no transparent phase to protect, so the bar
    // settles as soon as the page moves at all.
    if (!hasHero.current) setPastHero(y > 40)
  })

  /**
   * Watch the hero rather than a pixel threshold: it is `100svh`, so any
   * hard-coded number would be wrong on every viewport but the one it was
   * measured on. The negative top margin shrinks the observer root by the
   * header's own height, so the switch lands as the hero's bottom edge slides
   * under the bar. It tracks the *condensed* height, since by the time the hero
   * is leaving the bar has long since condensed.
   */
  useEffect(() => {
    const hero = document.getElementById('top')
    hasHero.current = Boolean(hero)
    if (!hero) return

    const io = new IntersectionObserver(
      ([entry]) => setPastHero(!entry.isIntersecting),
      { rootMargin: '-60px 0px 0px 0px', threshold: 0 },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

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

  // Escape closes whichever layer is open.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setMenuOpen(false)
      setMegaOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => () => clearTimeout(megaTimer.current), [])

  // A short close delay keeps the panel open while the pointer crosses the gap
  // between the trigger and the panel itself.
  const openMega = () => {
    clearTimeout(megaTimer.current)
    setMegaOpen(true)
  }
  const closeMega = () => {
    clearTimeout(megaTimer.current)
    megaTimer.current = setTimeout(() => setMegaOpen(false), 140)
  }
  // The chevron's own action. Hover still reveals the panel for mouse users,
  // but the arrow is the explicit control — which is what makes it safe for the
  // label beside it to simply navigate.
  const toggleMega = () => {
    clearTimeout(megaTimer.current)
    setMegaOpen((v) => !v)
  }

  const isCurrent = (href) =>
    href === '/' ? location.pathname === '/' : location.pathname.startsWith(href)

  return (
    <>
      {/* Drops in once on load, then stays put for the rest of the page. */}
      <motion.header
        initial={{ y: -120 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: EASE.expo, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-[60]"
        onMouseLeave={closeMega}
      >
        <div
          // Scoped here rather than on <header> so the mobile sheet, a sibling,
          // stays on the page theme where it belongs.
          data-theme={pastHero || megaOpen ? 'dark' : undefined}
          className={cn(
            'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            condensed ? 'py-2' : 'py-3',
            pastHero || megaOpen
              ? 'border-b border-ink/8 bg-abyss'
              : 'border-b border-transparent',
          )}
        >
          <div className="mx-auto flex w-full max-w-[86rem] items-center justify-between gap-6 px-6 md:px-10 lg:px-14">
            {/* The brand ships two lockups; "dark" is the navy one, drawn for
                light surfaces. Names refer to the artwork, not the theme. Past
                the hero the bar is dark whatever the page theme, so the navy
                wordmark would disappear into it. */}
            {/* The lockup is 640×263, so its width is what actually sets the
                bar's height — at 10rem it stood 66px tall on its own and no
                amount of padding trimming would have shown. */}
            <LogoLink
              variant={pastHero || megaOpen || !isLight ? 'light' : 'dark'}
              imgClassName={cn(
                'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                condensed
                  ? 'w-[6.25rem] md:w-[6.75rem]'
                  : 'w-[7.25rem] md:w-[8rem]',
              )}
            />

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              {primaryNav.map((item) =>
                item.mega ? (
                  // Two targets, not one. The label is a plain link to the
                  // Services page; the chevron beside it is a button that opens
                  // the panel. Previously the whole thing — chevron included —
                  // navigated, so there was no way to browse the sub-pages
                  // without first landing on the index.
                  //
                  // Hover no longer opens the panel. With both behaviours live
                  // the pointer had already opened it by the time it reached
                  // the chevron, so the click that was meant to open it closed
                  // it instead. The arrow owns the panel outright.
                  <div key={item.href} className="flex items-center">
                    <Link
                      to={item.href}
                      aria-current={isCurrent(item.href) ? 'page' : undefined}
                      className={cn(
                        'group relative py-2 pr-1 pl-4 text-[0.875rem] font-medium transition-colors duration-300',
                        isCurrent(item.href)
                          ? 'text-chalk'
                          : 'text-mist hover:text-chalk',
                      )}
                    >
                      {item.label}
                      <NavUnderline
                        active={isCurrent(item.href)}
                        className="right-1"
                      />
                    </Link>
                    <button
                      type="button"
                      // No `onFocus` opener. Focus lands on mousedown, before
                      // the click, so opening on focus meant every click
                      // toggled a panel that had just opened itself. Enter and
                      // Space fire this same handler, so keyboard access is
                      // unaffected.
                      onClick={toggleMega}
                      aria-expanded={megaOpen}
                      aria-controls="services-menu"
                      aria-label={
                        megaOpen
                          ? `Hide ${item.label} menu`
                          : `Show ${item.label} menu`
                      }
                      className={cn(
                        'mr-2 grid size-7 place-items-center rounded-full transition-colors duration-300',
                        megaOpen ? 'text-chalk' : 'text-mist hover:text-chalk',
                      )}
                    >
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          'size-3.5 transition-transform duration-400',
                          megaOpen && 'rotate-180',
                        )}
                        strokeWidth={2.4}
                      />
                    </button>
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    to={item.href}
                    aria-current={isCurrent(item.href) ? 'page' : undefined}
                    className={cn(
                      'group relative px-4 py-2 text-[0.875rem] font-medium transition-colors duration-300',
                      isCurrent(item.href)
                        ? 'text-chalk'
                        : 'text-mist hover:text-chalk',
                    )}
                  >
                    {item.label}
                    <NavUnderline active={isCurrent(item.href)} />
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle className="size-10" />

              <a
                href={company.phoneHref}
                className="group hidden items-center gap-2.5 rounded-full border border-ink/12 px-4 py-2 text-[0.875rem] font-medium text-mist transition-colors duration-300 hover:border-ink/30 hover:text-chalk md:inline-flex"
              >
                <Phone className="size-3.5" strokeWidth={2.4} aria-hidden="true" />
                <span className="tabular-nums">{company.phone}</span>
              </a>

              <Button
                href="/contact-us"
                size="sm"
                className="hidden h-10 sm:inline-flex"
              >
                Talk to Us
              </Button>

              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="grid size-10 place-items-center rounded-full border border-ink/12 text-chalk transition-colors duration-300 hover:border-ink/30 lg:hidden"
              >
                {menuOpen ? (
                  <X className="size-5" strokeWidth={2.2} aria-hidden="true" />
                ) : (
                  <Menu className="size-5" strokeWidth={2.2} aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Panels close from their own handlers rather than by reacting to
              the pathname — a route-change effect would fire a second render
              pass on every navigation. */}
          <MegaMenu
            open={megaOpen}
            onKeep={openMega}
            onNavigate={() => setMegaOpen(false)}
          />
        </div>
      </motion.header>

      <MobileSheet open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

/**
 * Gradient underline that grows from the left.
 *
 * Inset from both edges rather than sized with a width calculation, so an
 * asymmetric link — the Services label, which gives its right-hand padding to
 * the chevron button — can adjust one side without recomputing the other.
 */
function NavUnderline({ active, className }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'g-gradient absolute right-4 bottom-1 left-4 h-[1.5px] origin-left rounded-full transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)]',
        active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        className,
      )}
    />
  )
}

/**
 * Services panel.
 *
 * Groups the document lists without children — Branding and Video Editing —
 * render as a single link with their parenthesised detail beneath. Groups that
 * only organise children and have no page of their own (Digital Marketing,
 * Application Development) render as plain headings rather than dead links.
 */
function MegaMenu({ open, onKeep, onNavigate }) {
  const columns = serviceGroups.filter((g) => g.items?.length)
  const standalone = serviceGroups.filter((g) => !g.items?.length)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: EASE.expo }}
          id="services-menu"
          // Only cancels a pending close. Leaving the panel is not itself a
          // close — the header's own `onMouseLeave` wraps both the bar and this
          // panel, so travelling between the two never dismisses it.
          onMouseEnter={onKeep}
          className="absolute inset-x-0 top-full hidden border-b border-ink/8 bg-abyss lg:block"
        >
          <div className="mx-auto grid w-full max-w-[86rem] gap-10 px-6 py-12 md:px-10 lg:grid-cols-4 lg:px-14">
            {columns.map((group) => (
              <div key={group.label}>
                {group.href ? (
                  // No trailing arrow: this label wraps to two lines in the
                  // column, and an inline-flex sibling detaches to the far
                  // right when it does. "View all services" carries the
                  // affordance instead.
                  <Link
                    to={group.href}
                    onClick={onNavigate}
                    className="g-label block text-accent transition-opacity duration-300 hover:opacity-80"
                  >
                    {group.label}
                  </Link>
                ) : (
                  <span className="g-label text-accent">{group.label}</span>
                )}

                <ul className="mt-5 flex flex-col gap-3.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={onNavigate}
                        className="group block text-[0.9375rem] font-medium text-mist transition-colors duration-300 hover:text-chalk"
                      >
                        {item.label}
                        {item.facets && (
                          <span className="mt-1 block text-[0.75rem] leading-relaxed text-dim">
                            {item.facets.join(' · ')}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Services that are a page in their own right with no sub-pages. */}
            <div className="flex flex-col gap-8">
              {standalone.map((group) => (
                <div key={group.label}>
                  <Link
                    to={group.href}
                    onClick={onNavigate}
                    className="group block text-[0.9375rem] font-semibold text-chalk"
                  >
                    <span className="g-gradient-text">{group.label}</span>
                    <span className="mt-1.5 block text-[0.75rem] leading-relaxed text-dim">
                      {group.facets.slice(0, 5).join(' · ')}
                    </span>
                  </Link>
                </div>
              ))}

              <Link
                to="/services"
                onClick={onNavigate}
                className="group inline-flex items-center gap-2 text-[0.875rem] font-semibold text-chalk"
              >
                View all services
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Mobile navigation. Enters as a perspective slab rather than a plain slide,
 * and Services expands in place so the hierarchy stays visible.
 */
function MobileSheet({ open, onClose }) {
  const [servicesOpen, setServicesOpen] = useState(false)

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
            className="g-perspective absolute inset-x-0 top-[4.5rem] bottom-6 mx-5 origin-top overflow-y-auto rounded-3xl p-3"
          >
            <div className="g-panel overflow-hidden rounded-3xl p-3">
              {primaryNav.map((item, i) =>
                item.mega ? (
                  <div key={item.href} className="border-b border-ink/6">
                    <div className="flex items-center justify-between">
                      <Link
                        to={item.href}
                        onClick={onClose}
                        className="flex-1 px-4 py-4 text-xl font-semibold tracking-[-0.02em] text-chalk"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((v) => !v)}
                        aria-expanded={servicesOpen}
                        aria-label={
                          servicesOpen ? 'Collapse services' : 'Expand services'
                        }
                        className="grid size-11 shrink-0 place-items-center text-mist"
                      >
                        <ChevronDown
                          className={cn(
                            'size-5 transition-transform duration-400',
                            servicesOpen && 'rotate-180',
                          )}
                          strokeWidth={2.2}
                          aria-hidden="true"
                        />
                      </button>
                    </div>

                    <AnimatePresence initial={false}>
                      {servicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE.expo }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-6 px-4 pt-1 pb-6">
                            {serviceGroups.map((group) => (
                              <div key={group.label}>
                                {group.href ? (
                                  <Link
                                    to={group.href}
                                    onClick={onClose}
                                    className="g-label text-accent"
                                  >
                                    {group.label}
                                  </Link>
                                ) : (
                                  <span className="g-label text-accent">
                                    {group.label}
                                  </span>
                                )}
                                {group.items?.length > 0 && (
                                  <ul className="mt-3 flex flex-col gap-2.5">
                                    {group.items.map((sub) => (
                                      <li key={sub.href}>
                                        <Link
                                          to={sub.href}
                                          onClick={onClose}
                                          className="block text-[0.9375rem] text-mist"
                                        >
                                          {sub.label}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.55,
                      ease: EASE.expo,
                      delay: 0.1 + i * 0.045,
                    }}
                    className="border-b border-ink/6 last:border-0"
                  >
                    <Link
                      to={item.href}
                      onClick={onClose}
                      className="group flex items-baseline justify-between px-4 py-4"
                    >
                      <span className="text-xl font-semibold tracking-[-0.02em] text-chalk">
                        {item.label}
                      </span>
                      <span className="g-label text-dim">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Link>
                  </motion.div>
                ),
              )}

              <div className="flex flex-col gap-2.5 p-3 pt-4">
                <Button href="/contact-us" onClick={onClose} className="w-full">
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
