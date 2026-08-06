import { useEffect } from 'react'
import { company } from '@/content/site'

/**
 * Per-route document head.
 *
 * The build-time plugin in vite.config.js stamps the *home* page's tags into
 * index.html, which is what link-preview scrapers read. Those scrapers do not
 * execute JS, so they will never see these — this exists for the browser tab,
 * for Google (which does render JS), and so a shared link's tab title is right
 * once the page is open.
 *
 * Tags are mutated in place rather than appended, otherwise every navigation
 * would leave the previous page's description behind alongside the new one.
 */
function setMeta(selector, attr, value, content) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return el
}

export function usePageMeta({ title, description, path, keywords, twitterTitle }) {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title

    const url = `${company.url.replace(/\/$/, '')}${path}`

    setMeta('meta[name="description"]', 'name', 'description', description)
    if (keywords) setMeta('meta[name="keywords"]', 'name', 'keywords', keywords)

    setMeta('meta[property="og:title"]', 'property', 'og:title', title)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)
    setMeta('meta[property="og:url"]', 'property', 'og:url', url)

    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', twitterTitle ?? title)
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description)

    let canonical = document.head.querySelector('link[rel="canonical"]')
    const previousCanonical = canonical?.getAttribute('href')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    return () => {
      document.title = previousTitle
      if (previousCanonical) canonical.setAttribute('href', previousCanonical)
    }
  }, [title, description, path, keywords, twitterTitle])
}
