import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { EASE } from '@/lib/motion'
import { Eyebrow, SectionShell } from '@/components/ui/SectionShell'
import { Button } from '@/components/ui/Button'
import { company } from '@/content/site'

/**
 * Placeholder for a page in the structure that has not been built yet.
 *
 * Deliberately blunt rather than dressed up as a finished page: it states what
 * the route is for and sends the visitor somewhere useful. The copy in the
 * client document for each of these pages exists and is substantial — this is a
 * routing shell so the navigation is honest in the meantime, not a stand-in for
 * that content.
 */
export function PageStub({ title, label }) {
  useEffect(() => {
    const previous = document.title
    document.title = `${title} | ${company.name}`
    return () => {
      document.title = previous
    }
  }, [title])

  return (
    <SectionShell
      labelledBy="stub-heading"
      className="min-h-[70svh] pt-40 md:pt-48"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE.expo }}
        className="max-w-3xl"
      >
        <Eyebrow>{label}</Eyebrow>

        <h1
          id="stub-heading"
          className="text-display mt-7 leading-[1.1] font-extrabold text-balance text-chalk sm:leading-[1.02] lg:leading-[0.95]"
        >
          {title}
        </h1>

        <p className="mt-7 max-w-xl text-lead leading-relaxed text-mist">
          This page is being built. In the meantime the team can answer anything
          about {label.toLowerCase()} directly — usually the faster route anyway.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-3.5">
          <Button href="/contact-us" size="lg">
            Talk to Us
          </Button>
          <Button
            href={company.phoneHref}
            variant="outline"
            size="lg"
            icon={false}
          >
            Call {company.phone}
          </Button>
        </div>

        <p className="mt-12 text-[0.875rem] text-dim">
          <Link
            to="/"
            className="underline underline-offset-4 transition-colors hover:text-chalk"
          >
            Back to the home page
          </Link>
        </p>
      </motion.div>
    </SectionShell>
  )
}
