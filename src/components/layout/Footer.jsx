import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { company, footer } from '@/content/site'
import {
  legalNav,
  primaryNav,
  serviceGroups,
  utilityNav,
} from '@/content/navigation'

/**
 * Footer sitemap, derived from the same tree as the header menu.
 *
 * "Services" lists the pages a visitor can actually open — the group headings
 * that have no page of their own (Digital Marketing, Application Development)
 * are structural, so they are flattened out here rather than shown as text a
 * visitor might try to click.
 */
const footerColumns = [
  {
    title: 'Services',
    links: serviceGroups.flatMap((group) =>
      group.href
        ? [{ label: group.label, href: group.href }]
        : (group.items ?? []).map((i) => ({ label: i.label, href: i.href })),
    ),
  },
  {
    title: 'Company',
    links: [
      ...primaryNav.filter((i) => i.href !== '/'),
      ...utilityNav,
    ].map((i) => ({ label: i.label, href: i.href })),
  },
  { title: 'Legal', links: legalNav },
]
import { Logo } from '@/components/ui/Logo'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { scrollToTarget } from '@/hooks/useLenis'

/**
 * The end of the road. The horizon glow rises from the bottom edge — the
 * journey decelerating rather than simply stopping.
 *
 * Pinned dark in both themes via `data-theme="dark"` on the element itself.
 * The theme blocks in index.css are attribute selectors, so scoping one to a
 * subtree re-declares every surface, text and ink token beneath it — the
 * footer keeps this ground, and everything inside it (hairlines, the receding
 * grid, the muted link colours) follows automatically rather than needing a
 * per-element override. It reads as brand furniture closing the page, the same
 * way the ignition curtain opens it.
 */
export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      data-theme="dark"
      className="g-noise relative overflow-hidden border-t border-ink/8 bg-abyss"
    >
      {/* Horizon: the last light of the tunnel. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[22rem] left-1/2 h-[34rem] w-[130%] -translate-x-1/2 opacity-[0.18] blur-[110px]"
      >
        <div className="g-gradient size-full rounded-[100%]" />
      </div>

      {/* Receding road grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-[0.13] [mask-image:linear-gradient(0deg,#000,transparent)]"
        style={{
          // Mixed off --color-ink rather than a literal white so the receding
          // grid stays visible when the ground inverts.
          backgroundImage:
            'linear-gradient(color-mix(in srgb, var(--color-ink) 30%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-ink) 30%, transparent) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          transform: 'perspective(340px) rotateX(62deg)',
          transformOrigin: 'bottom',
        }}
      />

      <div className="relative mx-auto w-full max-w-[86rem] px-6 pt-24 md:px-10 md:pt-32 lg:px-14">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          variants={stagger(0.09)}
          className="grid gap-16 lg:grid-cols-[1.15fr_2fr]"
        >
          {/* Brand column — the supplied footer lockup. */}
          <motion.div variants={fadeUp} className="flex flex-col gap-7">
            {/* Always the light-on-dark lockup: the ground here no longer
                inverts, so the navy wordmark would disappear into it. */}
            <Logo variant="light" className="w-[13rem] md:w-[15rem]" />

            <p className="max-w-sm text-[1rem] leading-relaxed text-mist">
              {footer.blurb}
            </p>

            <div className="flex flex-col gap-3.5 pt-1">
              <FooterContact
                icon={MapPin}
                href={company.mapsHref}
                external
                label={company.addressFull}
              />
              <FooterContact
                icon={Phone}
                href={company.phoneHref}
                label={company.phone}
              />
              <FooterContact
                icon={Mail}
                href={`mailto:${company.email}`}
                label={company.email}
              />
            </div>
          </motion.div>

          {/* Sitemap — the same tree the header menu is built from, so the two
              can never drift apart. */}
          <motion.div
            variants={fadeUp}
            className="grid gap-10 xs:grid-cols-2 sm:grid-cols-3 sm:gap-8"
          >
            {footerColumns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="g-label mb-6 text-chalk">{col.title}</h3>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="group inline-flex items-start gap-2 text-[0.875rem] leading-snug text-mist transition-colors duration-300 hover:text-chalk"
                      >
                        <ArrowGlyph className="mt-[0.4em] size-2 shrink-0 -rotate-45 text-dim transition-all duration-400 group-hover:translate-x-0.5 group-hover:text-accent" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </motion.div>
        </motion.div>

        {/* Legal bar. The slogan already appears in the lockup directly above,
            so the oversized repeat of it was removed rather than resized. */}
        <div className="mt-20 flex flex-col items-center justify-between gap-5 border-t border-ink/8 py-8 md:mt-24 md:flex-row md:py-9">
          <p className="text-center text-[0.8125rem] text-dim md:text-left">
            © {year} {company.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              to="/privacy-policy"
              className="text-[0.8125rem] text-dim transition-colors hover:text-chalk"
            >
              Privacy
            </Link>
            <Link
              to="/terms-and-conditions"
              className="text-[0.8125rem] text-dim transition-colors hover:text-chalk"
            >
              Terms
            </Link>
            <button
              type="button"
              onClick={() => scrollToTarget('#top', 0)}
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-mist transition-colors hover:text-chalk"
            >
              Back to top
              <ArrowUpRight
                className="size-3.5 transition-transform duration-400 group-hover:-translate-y-0.5"
                strokeWidth={2.4}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterContact({ icon: Icon, href, label, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className="group flex items-start gap-3 text-[0.875rem] leading-snug text-mist transition-colors duration-300 hover:text-chalk"
    >
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/10 transition-colors duration-300 group-hover:border-brand-pink/50">
        <Icon className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="max-w-xs">{label}</span>
    </a>
  )
}
