/**
 * Structured data. Types and values follow the "Schema Markup" instruction in
 * the client content document: Organization, LocalBusiness (NAP + geo),
 * WebSite (SearchAction) and FAQPage.
 */
import { company, seo, faq, services } from './site'

const ADDRESS = {
  '@type': 'PostalAddress',
  streetAddress: company.address.line1,
  addressLocality: company.address.city,
  addressRegion: company.address.region,
  postalCode: company.address.postalCode,
  addressCountry: company.address.country,
}

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.name,
  alternateName: company.short,
  url: company.url,
  logo: `${company.url}assets/g10x-logo.png`,
  description:
    'G10X Private Limited is a digital marketing agency based in Thanjavur, Tamil Nadu, offering SEO, social media marketing, search engine marketing, branding, video editing, and website & app development services.',
  foundingDate: company.founded,
  founder: {
    '@type': 'Person',
    name: company.founder.name,
    jobTitle: company.founder.role,
  },
  address: ADDRESS,
  contactPoint: [
    {
      '@type': 'ContactPoint',
      telephone: '+91-92807-01655',
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: company.languages,
    },
  ],
}

export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${company.url}#localbusiness`,
  name: company.name,
  image: `${company.url}assets/g10x-logo.png`,
  url: company.url,
  telephone: '+91-92807-01655',
  email: company.email,
  priceRange: '₹₹',
  address: ADDRESS,
  geo: {
    '@type': 'GeoCoordinates',
    // Srinivasapuram, Thanjavur (613009)
    latitude: 10.7905,
    longitude: 79.1378,
  },
  areaServed: [
    { '@type': 'City', name: 'Thanjavur' },
    { '@type': 'AdministrativeArea', name: 'Tamil Nadu' },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Digital Marketing & Development Services',
    itemListElement: services.items.map((s) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: s.title, description: s.body },
    })),
  },
}

export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: company.name,
  url: company.url,
  description: seo.description,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${company.url}search?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: company.url },
  ],
}

export const allSchemas = [
  organizationSchema,
  localBusinessSchema,
  websiteSchema,
  faqSchema,
  breadcrumbSchema,
]
