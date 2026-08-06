/**
 * The site's page structure — the single source of truth for the header menu,
 * the footer sitemap and the router.
 *
 * Transcribed from the "Page Structure" block at the top of the client's
 * content document, and every `href` is that page's own `URL Slug:` line from
 * the same document. Nothing here is invented: if a page has no slug in the
 * document it is a grouping label only, and carries no `href`.
 *
 * The document's indentation matters and is preserved. "Branding" and "Video
 * Editing" sit at the same level as "Digital Marketing" — they are siblings of
 * that group, not members of it.
 */

/**
 * Services, exactly as the document nests them.
 *
 * A group with an `href` is itself a page as well as a heading (Website Design
 * & Development). A group without one is a label that only organises its
 * children (Digital Marketing, Application Development) — rendered as a
 * non-interactive heading rather than a dead link.
 *
 * `facets` are the parenthesised lists from the document. They are shown as
 * supporting detail in the menu, not as separate pages.
 */
export const serviceGroups = [
  {
    label: 'Digital Marketing',
    items: [
      {
        label: 'Search Engine Optimization',
        href: '/services/search-engine-optimization',
        facets: ['On-Page', 'Off-Page', 'Mobile SEO', 'Local (GBP) SEO'],
      },
      {
        label: 'Social Media Marketing',
        href: '/services/social-media-marketing',
        facets: ['Meta', 'LinkedIn', 'Pinterest', 'SMO'],
      },
      {
        label: 'Search Engine Marketing',
        href: '/services/search-engine-marketing',
        facets: ['Google Ads', 'PPC', 'Press Release', 'Guest Blogging'],
      },
      {
        label: 'Other Services',
        href: '/services/other-marketing-services',
        facets: ['Email Marketing', 'Influencer Marketing', 'SMS Marketing'],
      },
    ],
  },
  {
    label: 'Website Design & Development',
    href: '/services/website-development',
    items: [
      {
        label: 'Static Website Development',
        href: '/services/static-website-development',
      },
      {
        label: 'Dynamic Website Development',
        href: '/services/dynamic-website-development',
      },
      {
        label: 'Enterprise Website Development',
        href: '/services/enterprise-website-development',
      },
      {
        label: 'Ecommerce Website Development',
        href: '/services/ecommerce-website-development',
      },
      {
        label: 'CMS Website Development',
        href: '/services/cms-website-development',
      },
    ],
  },
  {
    label: 'Application Development',
    items: [
      {
        label: 'Web Application Development',
        href: '/services/website-application-development',
      },
      {
        label: 'Mobile Application Development',
        href: '/services/mobile-application-development',
      },
    ],
  },
  {
    label: 'Branding',
    href: '/services/branding',
    facets: [
      'Logo',
      'Brochure',
      'Business Flyer',
      'Banner Design',
      'Pamphlet Design',
      'Business Card',
      'Letterhead',
      'Social Media Post',
      'Visiting Card',
    ],
    items: [],
  },
  {
    label: 'Video Editing',
    href: '/services/video-editing',
    facets: [
      'Business Video',
      'Corporate Video',
      'Drone Video',
      'YouTube Video',
      'Branding Video',
      'Cinematic Storytelling',
    ],
    items: [],
  },
]

/** Top-level navigation. `Services` opens the menu built from the groups above. */
export const primaryNav = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Services', href: '/services', mega: true },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact Us', href: '/contact-us' },
]

/** Pages that sit outside the main navigation. */
export const legalNav = [
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms-and-conditions' },
]

/** Linked from the home page but not part of the document's page structure. */
export const utilityNav = [{ label: 'Pricing & Packages', href: '/pricing' }]

/**
 * Flat list of every routable page, derived from the tree above so the router
 * and the navigation can never drift apart.
 *
 * `title` is that page's `SEO Title:` from the document, trimmed of the shared
 * " | G10X Private Limited" suffix.
 */
const SERVICE_TITLES = {
  '/services': 'Our Services',
  '/services/search-engine-optimization':
    'Search Engine Optimization (SEO) in Thanjavur',
  '/services/social-media-marketing':
    'Social Media Marketing Company in Thanjavur',
  '/services/search-engine-marketing': 'Google Ads & PPC Company in Thanjavur',
  '/services/other-marketing-services':
    'Email, SMS & WhatsApp Marketing Services in Thanjavur',
  '/services/branding': 'Branding & Graphic Design Company in Thanjavur',
  '/services/video-editing': 'Video Editing Company in Thanjavur',
  '/services/website-development':
    'Website Design & Development Company in Thanjavur',
  '/services/static-website-development':
    'Static Website Development Company in Thanjavur',
  '/services/dynamic-website-development':
    'Dynamic Website Development Company in Thanjavur',
  '/services/enterprise-website-development':
    'Enterprise Website Development Company in Thanjavur',
  '/services/ecommerce-website-development':
    'Ecommerce Website Development Company in Thanjavur',
  '/services/cms-website-development':
    'CMS & WordPress Website Development in Thanjavur',
  '/services/website-application-development':
    'Web Application Development Company in Thanjavur',
  '/services/mobile-application-development':
    'Mobile App Development Company in Thanjavur',
}

function collectServiceRoutes() {
  const out = [{ href: '/services', label: 'Services' }]
  for (const group of serviceGroups) {
    if (group.href) out.push({ href: group.href, label: group.label })
    for (const item of group.items ?? []) {
      out.push({ href: item.href, label: item.label })
    }
  }
  return out
}

export const allRoutes = [
  { href: '/', label: 'Home', title: 'Digital Marketing Company in Thanjavur' },
  { href: '/about-us', label: 'About Us', title: 'About Us' },
  ...collectServiceRoutes().map((r) => ({ ...r, title: SERVICE_TITLES[r.href] })),
  { href: '/gallery', label: 'Gallery', title: 'Gallery' },
  { href: '/contact-us', label: 'Contact Us', title: 'Contact Us' },
  { href: '/pricing', label: 'Pricing & Packages', title: 'Pricing & Packages' },
  { href: '/privacy-policy', label: 'Privacy Policy', title: 'Privacy Policy' },
  {
    href: '/terms-and-conditions',
    label: 'Terms & Conditions',
    title: 'Terms & Conditions',
  },
]
