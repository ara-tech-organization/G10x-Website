import { useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Home } from '@/pages/Home'
import { Services } from '@/pages/Services'
import { PageStub } from '@/pages/PageStub'
import { allRoutes } from '@/content/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Preloader } from '@/components/layout/Preloader'
import { SeoHead } from '@/components/layout/SeoHead'
import { PageTransition } from '@/components/layout/PageTransition'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { CursorGlow } from '@/components/ui/CursorGlow'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { StageCanvas } from '@/components/layout/StageCanvas'
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

      {/* One WebGL scene for the whole visit, behind everything. Mounted here
          rather than inside a page so it survives route changes. */}
      <StageCanvas />

      <ScrollProgress />
      <CursorGlow />
      <Header />

      <main id="main" className="relative z-10">
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            {/* Routes are generated from the page structure in
                content/navigation.js, so the router, the header menu and the
                footer sitemap are all driven by one list and cannot drift.
                Only Home is built; the rest resolve to a stub that names the
                page and offers a way through, rather than silently rendering
                Home under a URL that promises something else. */}
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              {allRoutes
                .filter((r) => r.href !== '/' && r.href !== '/services')
                .map((r) => (
                  <Route
                    key={r.href}
                    path={r.href}
                    element={<PageStub title={r.title} label={r.label} />}
                  />
                ))}
              <Route
                path="*"
                element={<PageStub title="Page not found" label="404" />}
              />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </main>

      <Footer />
    </ThemeProvider>
  )
}
