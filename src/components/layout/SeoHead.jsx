import { useEffect } from 'react'
import { allSchemas } from '@/content/schema'

/**
 * Structured data.
 *
 * The title/description/OG/Twitter/geo tags this component used to render are
 * now stamped into index.html at build time by the `g10x-head-meta` plugin —
 * link-preview scrapers do not execute JS, so React-hoisted og: tags never
 * reached them. Emitting both would duplicate every tag, so nothing static is
 * rendered here any more.
 *
 * JSON-LD stays on the client: Google renders JS before parsing structured
 * data, and React treats <script> children as a hydration hazard and will not
 * hoist them anyway. When per-route meta lands, this is where it belongs —
 * mutating the existing tags rather than appending new ones.
 */
export function SeoHead() {
  useEffect(() => {
    const node = document.createElement('script')
    node.type = 'application/ld+json'
    node.dataset.g10x = 'schema'
    // A @graph keeps all five entities in one block, which is what Google
    // prefers — so the per-entity @context is hoisted to the wrapper.
    node.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': allSchemas.map((entity) => {
        const rest = { ...entity }
        delete rest['@context']
        return rest
      }),
    })
    document.head.appendChild(node)
    return () => node.remove()
  }, [])

  return null
}
