import { motion } from 'framer-motion'
import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { EASE, VIEWPORT, fadeUp, stagger } from '@/lib/motion'
import { company, footer } from '@/content/site'
import { Logo } from '@/components/ui/Logo'
import { ArrowGlyph } from '@/components/ui/ArrowGlyph'
import { scrollToTarget } from '@/hooks/useLenis'
import { useTheme } from '@/hooks/useTheme'

/**
 * The end of the road. An oversized wordmark sits behind the sitemap and the
 * horizon glow rises from the bottom edge — the journey decelerating rather
 * than simply stopping.
 */
export function Footer() {
  const { isLight } = useTheme()
  const year = new Date().getFullYear()

  return (
    <footer className="g-noise relative overflow-hidden border-t border-ink/8 bg-abyss">
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
            <Logo
              variant={isLight ? 'dark' : 'light'}
              className="w-[13rem] md:w-[15rem]"
            />

            <p className="max-w-sm text-[1.0625rem] leading-relaxed text-mist">
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

          {/* Sitemap */}
          <motion.div
            variants={fadeUp}
            className="grid gap-10 sm:grid-cols-3 sm:gap-8"
          >
            {footer.columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="g-label mb-6 text-chalk">{col.title}</h3>
                <ul className="flex flex-col gap-3.5">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="group inline-flex items-start gap-2 text-[0.9375rem] leading-snug text-mist transition-colors duration-300 hover:text-chalk"
                      >
                        <ArrowGlyph className="mt-[0.4em] size-2 shrink-0 -rotate-45 text-dim transition-all duration-400 group-hover:translate-x-0.5 group-hover:text-brand-pink" />
                        <span>{link.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </motion.div>
        </motion.div>

        {/* Oversized slogan — the visual philosophy, stated once, large. */}
        <div className="relative mt-20 md:mt-28">
          <div className="g-rule mb-10" />
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 1.2, ease: EASE.expo }}
            className="g-gradient-text text-center text-[clamp(2.75rem,13vw,12rem)] leading-[0.85] font-black tracking-[-0.05em] uppercase"
          >
            Defy Limits
          </motion.h2>
        </div>

        {/* Legal bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-ink/8 py-8 md:flex-row md:py-9">
          <p className="text-center text-[0.8125rem] text-dim md:text-left">
            © {year} {company.name}. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="/privacy-policy"
              className="text-[0.8125rem] text-dim transition-colors hover:text-chalk"
            >
              Privacy
            </a>
            <a
              href="/terms-and-conditions"
              className="text-[0.8125rem] text-dim transition-colors hover:text-chalk"
            >
              Terms
            </a>
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
      className="group flex items-start gap-3 text-[0.9375rem] leading-snug text-mist transition-colors duration-300 hover:text-chalk"
    >
      <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border border-ink/10 transition-colors duration-300 group-hover:border-brand-pink/50">
        <Icon className="size-3.5" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="max-w-xs">{label}</span>
    </a>
  )
}
