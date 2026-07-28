import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Preloader } from '@/components/layout/Preloader'
import { SeoHead } from '@/components/layout/SeoHead'
import { PageTransition } from '@/components/layout/PageTransition'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { useLenis } from '@/hooks/useLenis'

export default function App() {
  const location = useLocation()
  const [booted, setBooted] = useState(false)

  // Smooth scroll starts only once the ignition sequence has handed over,
  // otherwise Lenis fights the preloader's scroll lock.
  useLenis({ enabled: booted })

  // Every route change starts at the top.
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <ThemeProvider>
      <SeoHead />

      {/* Skip link — first tab stop, visible only when focused. Painted in
          chalk-on-void rather than white-on-dark so it inverts with the theme
          and stays the highest-contrast thing on screen in both. */}
      <a
        href="#main"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[300] focus-visible:rounded-full focus-visible:bg-chalk focus-visible:px-5 focus-visible:py-3 focus-visible:text-sm focus-visible:font-semibold focus-visible:text-void"
      >
        Skip to main content
      </a>

      <Preloader onComplete={() => setBooted(true)} />

      <ScrollProgress />
      <CursorGlow />
      <Header />

      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              {/* The remaining routes ship with their own pages; until then an
                  unknown path renders Home rather than a dead end. */}
              <Route path="*" element={<Home />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </ThemeProvider>
  )
}
