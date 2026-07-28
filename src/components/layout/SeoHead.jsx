import { useEffect } from 'react'
import { allSchemas } from '@/content/schema'
import { company, seo } from '@/content/site'

/**
 * Document head management.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree
 * into <head>, so this component can simply return them — no helmet library,
 * no extra dependency. JSON-LD still goes through an effect, because React
 * treats <script> children as a hydration hazard and will not hoist them.
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

  return (
    <>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords} />
      <link rel="canonical" href={seo.canonical} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="author" content={company.name} />
      <meta name="theme-color" content="#050814" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={company.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={seo.canonical} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />

      {/* Local signals */}
      <meta name="geo.region" content="IN-TN" />
      <meta name="geo.placename" content="Thanjavur" />
      <meta name="geo.position" content="10.7905;79.1378" />
      <meta name="ICBM" content="10.7905, 79.1378" />
    </>
  )
}
