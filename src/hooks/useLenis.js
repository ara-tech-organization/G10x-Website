import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Installs Lenis smooth scrolling and drives it from a single rAF loop that
 * also ticks GSAP-free consumers. Returns the instance ref so callers can
 * stop/start it (used by the preloader and the mobile menu).
 *
 * Disabled entirely when the user prefers reduced motion — hijacking scroll is
 * the single most common accessibility failure in sites like this one.
 */
export function useLenis({ enabled = true } = {}) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (!enabled) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      duration: 1.15,
      // Slight ease-out so flicks decelerate like a heavy object.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // Native momentum on touch feels better than emulated.
      syncTouch: false,
      touchMultiplier: 1.6,
    })
    lenisRef.current = lenis
    window.__lenis = lenis

    let frame
    const raf = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
      delete window.__lenis
    }
  }, [enabled])

  return lenisRef
}

/** Scroll to a hash target through Lenis when present, natively otherwise. */
export function scrollToTarget(target, offset = -72) {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target
  if (!el) return
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset, duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
