/**
 * Single source of truth for all Home-page copy.
 *
 * Every string here is taken from the client's "G10X - Website Content"
 * document (Home section). Wording is only lightly tightened for on-screen
 * readability — meaning, claims and numbers are unchanged. Nothing is invented.
 *
 * Items flagged `placeholder: true` are marked in the source document as
 * samples awaiting real client work / verified reviews.
 */

export const company = {
  name: 'G10X Private Limited',
  short: 'G10X',
  slogan: 'Defy Limits',
  founded: '2026',
  founder: { name: 'Mehala Kumar', role: 'CEO' },
  phone: '+91 92807 01655',
  phoneHref: 'tel:+919280701655',
  whatsappHref: 'https://wa.me/919280701655',
  email: 'grow.10.x.org@gamil.com',
  address: {
    line1: '67A, Giri Road, Srinivasapuram',
    city: 'Thanjavur',
    region: 'Tamil Nadu',
    postalCode: '613009',
    country: 'IN',
  },
  addressFull:
    '67A, Giri Road, Srinivasapuram, Thanjavur, Tamil Nadu – 613009',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=G10X+Private+Limited,+67A+Giri+Road,+Srinivasapuram,+Thanjavur,+Tamil+Nadu+613009',
  // Must match seo.canonical — schema.org url/@id pointing at a different
  // host than the canonical tag splits the entity for crawlers.
  url: 'https://g10x.co/',
  languages: ['English', 'Tamil'],
}

export const seo = {
  title: 'Digital Marketing Company in Thanjavur | G10X Private Limited',
  description:
    'Looking for a trusted Digital Marketing Company in Thanjavur? G10X Private Limited offers SEO, social media, branding, web design, and digital marketing solutions.',
  canonical: 'https://g10x.co/',
  // Share card. Absolute per the OG spec — relative paths are rejected by
  // most scrapers. Regenerate with `npm run make:og`.
  ogImage: 'https://g10x.co/og-image.png',
  ogImageAlt:
    'G10X Private Limited — digital marketing company in Thanjavur',
  // All five keyword groups from the content document: primary, secondary,
  // long-tail, local and LSI — previously only primary + secondary shipped.
  keywords: [
    // Primary
    'digital marketing company in Thanjavur',
    'digital marketing agency Thanjavur',
    // Secondary
    'best SEO company Thanjavur',
    'social media marketing Thanjavur',
    'branding agency Thanjavur',
    'website development company Thanjavur',
    // Long-tail
    'affordable digital marketing services for small business Thanjavur',
    'digital marketing agency near Srinivasapuram Thanjavur',
    // Local
    'G10X Thanjavur',
    'digital marketing Giri Road Thanjavur',
    'Thanjavur digital agency 613009',
    // Ranking-target variants
    'best digital marketing company in Thanjavur',
    'best digital marketing companies in Thanjavur',
    'best digital marketing services in Thanjavur',
    'best digital marketing agency in Thanjavur',
    'best branding agency in Thanjavur',
    'top digital marketing company in Thanjavur',
    'top digital marketing companies in Thanjavur',
    'top digital marketing services in Thanjavur',
    'top digital marketing agency in Thanjavur',
    // LSI
    'online visibility',
    'lead generation',
    'ROI-driven marketing',
    'brand growth',
    'performance marketing',
    'organic traffic',
  ].join(', '),
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Process', href: '#process' },
  { label: 'Work', href: '#work' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export const hero = {
  eyebrow: 'Digital Marketing Company · Thanjavur',
  // "Digital Growth, Built for Your Business!" — split for the display treatment.
  // The document's H1 is "Digital Growth, Built for Your Business!" — split
  // across three lines for the display treatment, exclamation mark included.
  headline: ['Digital Growth,', 'Built for Your', 'Business!'],
  accentWordIndex: 2,
  sub: 'G10X Private Limited blends strategy, creativity and technology to help brands get found online, win more customers and grow with confidence — without the guesswork, making us the best digital marketing company in Thanjavur for businesses ready to grow online.',
  supporting:
    'As a top digital marketing agency in Thanjavur, we work with shopkeepers, clinics, builders, manufacturers and ambitious startups who want a marketing partner that actually shows up, explains things clearly, and ties every rupee spent back to a result.',
  primaryCta: { label: 'Talk to Us', href: '#contact' },
  callCta: { label: 'Call +91 92807 01655', href: 'tel:+919280701655' },
  secondaryCta: { label: 'Start Today', href: '#contact' },
  trustStrip: [
    'Accessible team, always within reach',
    'Transparent monthly reporting from day one',
    'One team for SEO, ads, social, branding and web',
    'Get expert advice before you decide',
  ],
}

export const about = {
  eyebrow: 'Who We Are',
  heading: 'Meet G10X — Your Growth Partner',
  body: [
    'G10X Private Limited was built around one idea: businesses deserve marketing that is honest, strategic and genuinely effective — not recycled templates dressed up as strategy. We sit down with every business owner, understand what "growth" actually means for them, and build a plan around that goal instead of a one-size-fits-all package.',
    'Whether you are opening your first store, scaling a manufacturing unit, or trying to get your clinic’s phone to ring more often, our team designs the digital groundwork — search visibility, social presence, advertising and web experience — so your business shows up exactly when your next customer is searching. And as the best branding agency in Thanjavur, we make sure every touchpoint looks and feels consistent along the way.',
  ],
  // The document's own closing line for paragraph one, isolated rather than
  // dropped — it carries the "best digital marketing services" phrasing.
  pullQuote:
    'That’s why business owners across the district consider us among the best digital marketing services in Thanjavur when they want a partner who listens first and strategizes second.',
  cta: { label: 'Learn Our Story', href: '/about-us' },
  // Real, verifiable markers pulled from the document — not fabricated metrics.
  markers: [
    {
      k: 'Base',
      label: 'Srinivasapuram, Thanjavur',
      detail: 'Serving the district and beyond, including remote clients.',
    },
    {
      k: 'Founded',
      label: '2026',
      detail: 'Founder-led, with direct access to decision-makers.',
    },
    {
      k: 'Scope',
      label: 'Six growth channels',
      detail: 'SEO, social, paid ads, branding, video and web under one roof.',
    },
    {
      k: 'Model',
      label: 'No lock-in contracts',
      detail: 'You stay because you are seeing results.',
    },
  ],
}

export const whyUs = {
  eyebrow: 'The Difference',
  heading: 'Why Are Businesses Choosing G10X?',
  intro:
    'Here’s why more businesses are calling G10X the best digital marketing agency in Thanjavur.',
  items: [
    {
      title: 'Straight-talking strategy',
      body: 'No confusing marketing talk — just clear explanations, honest advice, and strategies you can understand.',
    },
    {
      title: 'One partner, every channel',
      body: 'SEO, paid ads, social media, branding and website development under a single accountable roof.',
    },
    {
      title: 'Reporting you can actually read',
      body: 'Regular performance updates that focus on measurable growth, not surface-level metrics.',
    },
    {
      title: 'Founder-led attention',
      body: 'Direct access to decision-makers instead of getting passed between account managers — a hallmark of the top digital marketing company in Thanjavur businesses trust for accountability.',
    },
    {
      title: 'Strategies built around your goals',
      body: 'Every campaign, creative and decision is aligned with your business objectives, not generic industry playbooks.',
    },
    {
      title: 'Focused on long-term growth',
      body: 'We build sustainable digital foundations that help your brand grow consistently, not just chase short-term wins.',
    },
  ],
}

export const services = {
  eyebrow: 'Capabilities',
  heading: 'Build! Grow! Dominate Online!',
  intro:
    'From search rankings to scroll-stopping creatives, G10X brings every growth lever together under one strategy, delivering the top digital marketing services in Thanjavur businesses need to compete.',
  items: [
    {
      id: 'seo',
      index: '01',
      title: 'Search Engine Optimization',
      abbr: 'SEO',
      body: 'Rank higher on Google with technical, on-page, off-page and local SEO built for real search intent.',
      facets: ['On-Page', 'Off-Page', 'Mobile SEO', 'Local / GBP SEO'],
      cta: { label: 'View SEO Services', href: '/services/seo' },
    },
    {
      id: 'smm',
      index: '02',
      title: 'Social Media Marketing',
      abbr: 'SMM',
      body: 'Strategy-driven content creation and community management across Meta, Instagram, LinkedIn and Pinterest.',
      facets: ['Meta', 'LinkedIn', 'Pinterest', 'SMO'],
      cta: {
        label: 'View Social Media Services',
        href: '/services/social-media-marketing',
      },
    },
    {
      id: 'sem',
      index: '03',
      title: 'Search Engine Marketing',
      abbr: 'SEM',
      body: 'Google Ads, display, remarketing and press-release amplification that turns clicks into customers.',
      facets: ['Google Ads', 'PPC', 'Press Release', 'Guest Blogging'],
      cta: {
        label: 'View SEM Services',
        href: '/services/search-engine-marketing',
      },
    },
    {
      id: 'branding',
      index: '04',
      title: 'Branding & Design',
      abbr: 'BRAND',
      body: 'From logos to social media, we craft consistent brand experiences that make a lasting impact.',
      facets: ['Logo', 'Brochure', 'Flyer & Banner', 'Social Posts'],
      cta: { label: 'View Branding Services', href: '/services/branding' },
    },
    {
      id: 'video',
      index: '05',
      title: 'Video Editing',
      abbr: 'VIDEO',
      body: 'Reels, promos, corporate films and motion graphics that hold attention and build trust.',
      facets: ['Corporate', 'Reels & YouTube', 'Drone', 'Cinematic'],
      cta: {
        label: 'View Video Editing Services',
        href: '/services/video-editing',
      },
    },
    {
      id: 'web',
      index: '06',
      title: 'Website & App Development',
      abbr: 'BUILD',
      body: 'High-performance websites and applications designed to maximize conversions.',
      facets: ['Static & Dynamic', 'Enterprise', 'Ecommerce & CMS', 'Web & Mobile Apps'],
      cta: {
        label: 'View Web Development Services',
        href: '/services/website-development',
      },
    },
  ],
}

export const industries = {
  eyebrow: 'Sectors',
  heading: 'Industries We Serve',
  intro:
    'We tailor every strategy to how your industry actually sells, not a generic playbook.',
  items: [
    'Healthcare & Clinics',
    'Education & Coaching Institutes',
    'Real Estate & Builders',
    'Retail & eCommerce',
    'Restaurants & Hospitality',
    'Manufacturing & Industrial Suppliers',
    'Fashion & Lifestyle Brands',
    'Automotive & Showrooms',
    'Home Services & Contractors',
    'Salons, Spas & Wellness Studios',
  ],
  outro: 'Don’t see your industry here? Let’s discuss your business needs.',
  cta: { label: 'Talk to Us', href: '#contact' },
}

export const process = {
  eyebrow: 'The Route',
  heading: 'How We Turn Strategy Into Results',
  stages: [
    {
      n: '01',
      title: 'Initial Consultation',
      body: 'We learn your business, goals, customers and competitors.',
      phase: 'Grid',
    },
    {
      n: '02',
      title: 'Custom Growth Plan',
      body: 'A roadmap mapped to your budget and timeline, not a generic package.',
      phase: 'Grid',
    },
    {
      n: '03',
      title: 'SEO & Content Foundation',
      body: 'On-page, technical and local optimisation built to last.',
      phase: 'Launch',
    },
    {
      n: '04',
      title: 'Campaign Launch',
      body: 'Ads, social and content go live with clear KPIs attached.',
      phase: 'Launch',
    },
    {
      n: '05',
      title: 'Creative Execution',
      body: 'Design, video and copy that fit your brand voice.',
      phase: 'Push',
    },
    {
      n: '06',
      title: 'Tracking & Reporting',
      body: 'Monthly insights showing what’s going on and what’s next.',
      phase: 'Push',
    },
    {
      n: '07',
      title: 'Ongoing Optimisation',
      body: 'Continuous refinement so growth compounds.',
      phase: 'Compound',
    },
  ],
}

/**
 * The source document explicitly instructs: "no fabricated numbers".
 * So this readout uses only figures that are literally stated in it —
 * the SEO timeline, and counts of things we actually list on this page.
 */
export const telemetry = {
  eyebrow: 'Readout',
  heading: 'The Numbers We Can Stand Behind',
  note: 'No inflated vanity metrics. These are the only figures we will quote before your first report lands.',
  gauges: [
    {
      value: 60,
      to: 90,
      suffix: ' days',
      label: 'To measurable SEO movement',
      detail:
        'Most businesses start seeing ranking and traffic movement in this window, with stronger compounding results over 6 months.',
      max: 180,
    },
    {
      value: 6,
      suffix: '',
      label: 'Growth channels, one roof',
      detail:
        'SEO, social, paid ads, branding, video and web development — a single accountable team.',
      max: 6,
    },
    {
      value: 10,
      suffix: '',
      label: 'Industries served',
      detail:
        'From clinics and builders to manufacturers, retail and wellness studios.',
      max: 10,
    },
    {
      value: 0,
      suffix: '',
      label: 'Lock-in contracts',
      detail:
        'Stay because you are seeing results, not because a contract is holding you back.',
      max: 6,
    },
  ],
}

export const tools = {
  eyebrow: 'Instrumentation',
  heading: 'The Tools Behind Our Strategy',
  intro:
    'We rely on trusted, industry-standard platforms to plan, execute and measure every campaign.',
  items: [
    { name: 'Google Analytics', role: 'Traffic & Audience Insights' },
    { name: 'Google Search Console', role: 'Search Performance Monitoring' },
    { name: 'Google Business Profile', role: 'Local Visibility' },
    { name: 'Google Ads', role: 'Paid Search & Display Campaigns' },
    { name: 'Meta Ads Manager', role: 'Facebook & Instagram Advertising' },
    { name: 'SEMrush / Ahrefs-class', role: 'Keyword & Competitor Research' },
    { name: 'Canva & Adobe CC', role: 'Design & Creative Production' },
    { name: 'CRM & Lead Tracking', role: 'Pipeline Visibility' },
  ],
}

export const promises = {
  eyebrow: 'Commitments',
  heading: 'Our Promises to Every Client',
  intro:
    'These are the promises that set us apart from other top digital marketing companies in Thanjavur.',
  items: [
    {
      title: 'Full Transparency',
      body: 'You get real access to your Analytics, Ads and reporting dashboards.',
    },
    {
      title: 'No Lock-In Contracts',
      body: 'Stay with us because you’re seeing results, not because a contract is holding you back.',
    },
    {
      title: 'Honest Reporting',
      body: 'Monthly updates that explain results in plain language.',
    },
    {
      title: 'Dedicated Attention',
      body: 'A named point of contact who actually knows your account.',
    },
    {
      title: 'Ethical Practices',
      body: 'White-hat SEO and platform-compliant advertising, always.',
    },
    {
      title: 'Continuous Optimisation',
      body: 'We regularly refine and optimise campaigns to keep performance moving forward.',
    },
  ],
  cta: { label: 'Book Now', href: '#contact' },
}

export const work = {
  eyebrow: 'In Flight',
  heading: 'What We’re Working On',
  // Flagged in the source document as samples to be replaced with live work.
  placeholder: true,
  placeholderNote:
    'Sample project cards — to be replaced with real, live client work as campaigns launch.',
  items: [
    {
      client: 'Healthcare Clinic',
      title: 'Local SEO & Google Business Profile Setup',
      body: 'Building out on-page SEO, Google Business Profile optimisation, and appointment-focused landing pages to help clinics get found by patients searching on Google.',
      status: 'In Progress',
      stack: ['Local SEO', 'GBP', 'Landing Pages', 'On-Page'],
    },
    {
      client: 'Retail Fashion Store',
      title: 'Social Media & Reels Strategy',
      body: 'Developing an Instagram and Facebook content calendar with reels editing and creative posters to grow footfall and online enquiries for a fashion retailer.',
      status: 'In Progress',
      stack: ['Content Calendar', 'Reels', 'Creative Design', 'Meta'],
    },
    {
      client: 'Home Services Business',
      title: 'Website Build & Lead Generation',
      body: 'Designing a fast, mobile-first website with WhatsApp lead capture and a Google Ads campaign to generate consistent service enquiries.',
      status: 'In Progress',
      stack: ['Web Build', 'WhatsApp Capture', 'Google Ads', 'CRO'],
    },
  ],
  cta: { label: 'Chat Now', href: 'https://wa.me/919280701655' },
}

export const testimonials = {
  eyebrow: 'Signal',
  heading: 'What Our Clients Are Saying',
  // Flagged in the source document as samples pending verified reviews.
  placeholder: true,
  placeholderNote:
    'Sample quotes — to be replaced with verified client testimonials as reviews come in.',
  items: [
    {
      quote:
        'G10X took the time to actually understand our business before suggesting anything. It felt like a real partnership from the first call.',
      name: 'Raja Sekar',
      role: 'Retail Business',
    },
    {
      quote:
        'Clear communication and a strategy that made sense for our budget. Exactly what we needed as a small business.',
      name: 'Kuldeep',
      role: 'Healthcare Clinic',
    },
    {
      quote:
        'They explained our website plan in a way we actually understood — no confusing tech talk.',
      name: 'Praveen Kumar',
      role: 'Local Service Business',
    },
  ],
}

export const pricing = {
  eyebrow: 'Investment',
  heading: 'Transparent Pricing, No Surprises',
  body: 'Our plans range from a standalone service like SEO or a fresh website, to complete monthly marketing management spanning social media, ads and content. Every marketing plan starts with a free initial call — so you only pay for what your business actually needs.',
  points: [
    'Standalone service, or full monthly management',
    'Every plan starts with a free initial call',
    'Pay only for what your business actually needs',
  ],
  cta: { label: 'Explore Pricing Plans', href: '/pricing' },
}

export const faq = {
  eyebrow: 'Answers',
  heading: 'Frequently Asked Questions (FAQs)',
  items: [
    {
      q: 'Which is the best digital marketing company in Thanjavur for businesses?',
      a: 'G10X Private Limited is built specifically for Thanjavur businesses that want affordable, transparent digital marketing including SEO, social media and paid ads without long-term lock-in contracts.',
    },
    {
      q: 'How much does digital marketing cost in Thanjavur?',
      a: 'Cost depends on your goals, competition and chosen channels. We offer a free consultation to scope your requirements and recommend a package that fits your budget realistically.',
    },
    {
      q: 'How long does SEO take to show results?',
      a: 'Most businesses start seeing measurable ranking and traffic movement within 60–90 days, with stronger compounding results over 6 months of consistent optimisation.',
    },
    {
      q: 'Does G10X only work with businesses located in Thanjavur?',
      a: 'Our office is based in Srinivasapuram, Thanjavur, and we serve businesses across the district and beyond, including remote clients who prefer calls and video updates.',
    },
    {
      q: 'What makes G10X different from other agencies in Thanjavur?',
      a: 'We limit how many clients we take on at a time so every account gets founder-level attention, honest reporting, and a strategy tailored to your specific market, not a copy-paste package. It’s what makes us one of the best digital marketing services in Thanjavur for businesses that want measurable results.',
    },
  ],
}

export const contact = {
  eyebrow: 'Contact',
  heading: 'Let’s Start the Conversation',
  finalHeading: 'Ready to Put Your Business on the Map?',
  finalBody:
    'Book a free, no-pressure strategy call and see exactly how G10X would grow your business online — and why we are counted among the best digital marketing companies in Thanjavur.',
  ctas: [
    { label: 'Join Today', href: '#contact-form', primary: true },
    { label: 'Call +91 92807 01655', href: 'tel:+919280701655' },
  ],
  trustChips: [
    'Free Consultation',
    'No Lock-in Contracts',
    'Transparent Reporting',
    'Experienced Digital Team',
  ],
  channels: [
    {
      k: 'Studio',
      value: '67A, Giri Road, Srinivasapuram, Thanjavur, Tamil Nadu – 613009',
      href: 'https://www.google.com/maps/search/?api=1&query=G10X+Private+Limited,+67A+Giri+Road,+Srinivasapuram,+Thanjavur,+Tamil+Nadu+613009',
      action: 'Get Directions',
    },
    {
      k: 'Phone / WhatsApp',
      value: '+91 92807 01655',
      href: 'tel:+919280701655',
      action: 'Call Now',
    },
    {
      k: 'Email',
      value: 'grow.10.x.org@gamil.com',
      href: 'mailto:grow.10.x.org@gamil.com',
      action: 'Write to Us',
    },
  ],
  formServices: [
    'Search Engine Optimization',
    'Social Media Marketing',
    'Search Engine Marketing',
    'Branding & Design',
    'Video Editing',
    'Website & App Development',
    'Not sure yet — advise me',
  ],
}

export const footer = {
  tagline: 'Defy Limits',
  blurb:
    'A digital marketing company in Thanjavur building honest, strategic growth for businesses ready to compete online.',
  columns: [
    {
      title: 'Services',
      links: [
        { label: 'Search Engine Optimization', href: '/services/seo' },
        {
          label: 'Social Media Marketing',
          href: '/services/social-media-marketing',
        },
        {
          label: 'Search Engine Marketing',
          href: '/services/search-engine-marketing',
        },
        { label: 'Branding & Design', href: '/services/branding' },
        { label: 'Video Editing', href: '/services/video-editing' },
        {
          label: 'Website & App Development',
          href: '/services/website-development',
        },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about-us' },
        { label: 'Services', href: '/services' },
        { label: 'Pricing & Packages', href: '/pricing' },
        { label: 'Gallery', href: '/gallery' },
        { label: 'Contact Us', href: '/contact-us' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms & Conditions', href: '/terms-and-conditions' },
      ],
    },
  ],
}
