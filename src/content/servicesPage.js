/**
 * Services page copy, taken from the "Services" section of the client's
 * content document. Wording is unchanged.
 *
 * Note this page groups its services slightly differently from the site-wide
 * page structure in `navigation.js` — here "Other Services" means Video Editing
 * and Graphic Design, and the WordPress entry is the page the structure calls
 * CMS Website Development. The groups below follow this page's own document;
 * the `href` on each entry points at the detail page that structure defines,
 * which is what "View More - Redirect to main page" refers to.
 */

export const servicesSeo = {
  title: 'Our Services | G10X Private Limited',
  description:
    "Explore G10X Private Limited's complete range of services in Thanjavur, SEO, SMM, SEM, video editing, graphic design, website and app development for growing businesses.",
  twitterTitle:
    'Our Services – Digital Marketing, Web & App Development | G10X Private Limited',
  path: '/services',
  keywords:
    'Digital Marketing and Web Development Company in Thanjavur, IT Services Thanjavur, G10X Private Limited Services, SEO SMM SEM services Thanjavur, website development company Thanjavur, app development company Thanjavur, graphic design and video editing services Thanjavur',
}

export const servicesHero = {
  eyebrow: 'Capabilities',
  h1: 'Our Services – Digital Marketing, Website & App Development Solutions by G10X Private Limited',
  // The H1 is long by design (it is the document's), so the display treatment
  // splits it: a short lead, then the qualifying clause at a smaller weight.
  h1Lead: 'Our Services',
  h1Rest:
    'Digital Marketing, Website & App Development Solutions by G10X Private Limited',
  body: [
    'G10X Private Limited is a full-service digital solutions company helping startups, businesses and enterprises grow their online presence through smart marketing, design and technology.',
    'From SEO and social media marketing to website and app development, we deliver result-driven solutions tailored to your goals. Our team combines creativity, strategy and technical expertise to build brands that stand out and perform.',
  ],
  ctas: [
    { label: 'Talk to Us', href: '/contact-us', primary: true },
    { label: 'Call +91 92807 01655', href: 'tel:+919280701655' },
  ],
}

export const serviceSections = [
  {
    index: '01',
    heading: 'Digital Marketing',
    items: [
      {
        title: 'Search Engine Optimization (SEO)',
        abbr: 'SEO',
        body: 'G10X Private Limited delivers result-driven SEO services covering on-page, off-page, technical and local SEO to strengthen your search rankings. Our data-backed strategies help businesses attract organic traffic and convert visitors into loyal customers. We continuously optimize your online presence to stay ahead of competitors.',
        href: '/services/search-engine-optimization',
      },
      {
        title: 'Social Media Marketing (SMM)',
        abbr: 'SMM',
        body: "We craft engaging social media strategies across Facebook, Instagram and LinkedIn to grow your brand's reach and engagement. Our creative campaigns build a loyal community around your business and connect you with the right audience. G10X ensures your brand stays active, relevant and top of mind.",
        href: '/services/social-media-marketing',
      },
      {
        title: 'Search Engine Marketing (SEM)',
        abbr: 'SEM',
        body: 'Our SEM experts run high-performing Google Ads, PPC and display campaigns that generate qualified leads quickly. We focus on maximizing return on ad spend through precise targeting and continuous optimization. G10X turns every click into a genuine business opportunity.',
        href: '/services/search-engine-marketing',
      },
    ],
  },
  {
    index: '02',
    heading: 'Other Services',
    items: [
      {
        title: 'Video Editing',
        abbr: 'VIDEO',
        body: "G10X offers professional video editing that transforms raw footage into polished, engaging content for every platform. From reels and promos to corporate videos and motion graphics, our team brings your vision to life. Every edit is crafted to tell your brand's story effectively.",
        href: '/services/video-editing',
      },
      {
        title: 'Graphic Design',
        abbr: 'DESIGN',
        body: 'Our design team creates striking visuals that capture attention and communicate your brand identity clearly. From logos to social creatives and marketing collateral, we design with purpose and consistency. G10X helps your brand stand out visually across every touchpoint.',
        href: '/services/branding',
      },
    ],
  },
  {
    index: '03',
    heading: 'Website Development',
    items: [
      {
        title: 'Static Website Development',
        abbr: 'STATIC',
        body: 'G10X builds fast, clean and low-maintenance static websites ideal for portfolios, landing pages and informational sites. We focus on lightweight code and optimized performance for quick loading. Every static site we deliver is polished, reliable and search-friendly.',
        href: '/services/static-website-development',
      },
      {
        title: 'Dynamic Website Development',
        abbr: 'DYNAMIC',
        body: 'Our dynamic website development delivers interactive, data-driven web experiences tailored to your business needs. We build scalable solutions where content updates in real time for users. G10X combines strong functionality with clean design for a seamless experience.',
        href: '/services/dynamic-website-development',
      },
      {
        title: 'WordPress Website Development',
        abbr: 'WORDPRESS',
        body: "G10X specializes in custom WordPress websites that are easy to manage, update and scale over time. We build responsive, SEO-friendly WordPress sites tailored to your brand's identity. Our solutions balance flexibility, performance and long-term ease of use.",
        href: '/services/cms-website-development',
      },
      {
        title: 'Ecommerce Website Development',
        abbr: 'ECOMMERCE',
        body: 'We design and develop robust ecommerce platforms that drive sales and deliver seamless shopping experiences. From product catalogs to secure payment integration, G10X builds online stores that convert visitors into buyers. Scale your business with a reliable, high-performing ecommerce foundation.',
        href: '/services/ecommerce-website-development',
      },
      {
        title: 'Enterprise Website Development',
        abbr: 'ENTERPRISE',
        body: 'G10X delivers enterprise-grade web solutions built for scalability, security and long-term performance. We design custom systems that streamline operations and support complex business growth. Our enterprise development is tailored to meet demanding organizational needs.',
        href: '/services/enterprise-website-development',
      },
    ],
  },
  {
    index: '04',
    heading: 'App Development',
    items: [
      {
        title: 'Web Application Development',
        abbr: 'WEB APP',
        body: 'Our team builds powerful, scalable web applications tailored to your unique business processes and workflows. We combine modern technology with intuitive design to deliver seamless digital experiences. G10X ensures your web app performs reliably across every platform.',
        href: '/services/website-application-development',
      },
      {
        title: 'Mobile Application Development',
        abbr: 'MOBILE APP',
        body: 'G10X creates high-performing mobile applications for Android and iOS that engage users and drive real results. We focus on intuitive UI/UX design paired with robust, dependable functionality. Turn your idea into a feature-rich mobile experience with our development team.',
        href: '/services/mobile-application-development',
      },
    ],
  },
]

/** Every service on the page, used for the count in the hero readout. */
export const totalServices = serviceSections.reduce(
  (n, s) => n + s.items.length,
  0,
)
