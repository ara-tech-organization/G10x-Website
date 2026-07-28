import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { company, seo } from './src/content/site.js'

/**
 * Stamp the document head into index.html at build time.
 *
 * These tags used to be rendered by <SeoHead> and hoisted by React. That is
 * fine for Google, which executes JS, but Facebook, LinkedIn, WhatsApp and
 * Slack scrapers do not — they read the served HTML and stop. Any og:/twitter:
 * tag that only exists after hydration is invisible to every one of them, so
 * the card never rendered. Emitting them here keeps site.js as the single
 * source of truth while putting the tags in the initial payload.
 */
function headMeta() {
  const meta = (attr, key, content) => ({
    tag: 'meta',
    attrs: { [attr]: key, content },
    injectTo: 'head',
  })

  return {
    name: 'g10x-head-meta',
    transformIndexHtml: () => [
      { tag: 'title', children: seo.title, injectTo: 'head' },
      meta('name', 'description', seo.description),
      meta('name', 'keywords', seo.keywords),
      meta('name', 'robots', 'index, follow, max-image-preview:large'),
      meta('name', 'author', company.name),
      meta('name', 'theme-color', '#050814'),
      {
        tag: 'link',
        attrs: { rel: 'canonical', href: seo.canonical },
        injectTo: 'head',
      },

      // Open Graph
      meta('property', 'og:type', 'website'),
      meta('property', 'og:site_name', company.name),
      meta('property', 'og:title', seo.title),
      meta('property', 'og:description', seo.description),
      meta('property', 'og:url', seo.canonical),
      meta('property', 'og:locale', 'en_IN'),
      meta('property', 'og:image', seo.ogImage),
      meta('property', 'og:image:secure_url', seo.ogImage),
      meta('property', 'og:image:type', 'image/png'),
      meta('property', 'og:image:width', '1200'),
      meta('property', 'og:image:height', '630'),
      meta('property', 'og:image:alt', seo.ogImageAlt),

      // Twitter
      meta('name', 'twitter:card', 'summary_large_image'),
      meta('name', 'twitter:title', seo.title),
      meta('name', 'twitter:description', seo.description),
      meta('name', 'twitter:image', seo.ogImage),
      meta('name', 'twitter:image:alt', seo.ogImageAlt),

      // Local signals
      meta('name', 'geo.region', 'IN-TN'),
      meta('name', 'geo.placename', 'Thanjavur'),
      meta('name', 'geo.position', '10.7905;79.1378'),
      meta('name', 'ICBM', '10.7905, 79.1378'),
    ],
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves this repo from /G10x-Website/, so every asset URL has
  // to be prefixed or the built index.html requests /assets/* from the domain
  // root and renders a blank page. Overridable for a custom domain / local
  // preview via BASE_PATH=/ npm run build.
  base: process.env.BASE_PATH ?? '/G10x-Website/',
  plugins: [react(), tailwindcss(), headMeta()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    cssCodeSplit: true,
    // three.js is code-split behind React.lazy; its chunk is legitimately large.
    chunkSizeWarningLimit: 900,
  },
})
