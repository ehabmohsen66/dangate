export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : null) ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
  'https://dangate.com';

export const SITE_NAME = 'Dan Gate';
export const SITE_FULL_NAME = 'Dan Gate Consultancy';
export const SITE_TAGLINE = 'Strategy. Technology. Growth.';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/dubai.jpg`;

export const KEYWORDS = [
  'business consultancy dubai',
  'management consulting uae',
  'marketing strategy dubai',
  'crm consulting dubai',
  'digital transformation gcc',
  'seo consultant dubai',
  'web technology strategy uae',
  'ai automation consulting gcc',
  'business development dubai',
  'saudi arabia market expansion',
  'performance marketing gcc',
  'dan gate consultancy',
];

export function absoluteUrl(path: string = '') {
  if (!path) return SITE_URL;
  if (path.startsWith('http')) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Organization + ProfessionalService Schema (LocalBusiness in Dubai, GCC)
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': `${SITE_URL}/#organization`,
    name: SITE_FULL_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl('/images/dan-gate.png'),
    image: absoluteUrl('/images/dubai.jpg'),
    description:
      'Dubai-based business strategy, marketing and technology consultancy serving clients across the UAE, Saudi Arabia, Qatar, Kuwait, Bahrain and Oman.',
    slogan: SITE_TAGLINE,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressRegion: 'Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.2048',
      longitude: '55.2708',
    },
    areaServed: [
      { '@type': 'Country', name: 'United Arab Emirates' },
      { '@type': 'Country', name: 'Saudi Arabia' },
      { '@type': 'Country', name: 'Qatar' },
      { '@type': 'Country', name: 'Kuwait' },
      { '@type': 'Country', name: 'Bahrain' },
      { '@type': 'Country', name: 'Oman' },
    ],
    knowsAbout: [
      'Business Strategy',
      'Digital Transformation',
      'CRM Integration & Consulting',
      'Search Engine Optimization (SEO)',
      'Performance Marketing & Media Buying',
      'AI Solutions & Automation',
      'Web Technology Strategy',
      'Go-To-Market Planning in the GCC',
    ],
    priceRange: '$$$$',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Consultation',
      url: absoluteUrl('/contact'),
      availableLanguage: ['English', 'Arabic'],
    },
  };
}

/**
 * WebSite Schema with SearchAction
 */
export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_FULL_NAME,
    alternateName: SITE_NAME,
    description:
      'Independent thinking. Connected expertise. Dubai-based business, marketing and technology consultancy for the GCC.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    inLanguage: 'en-US',
  };
}

/**
 * BreadcrumbList Schema
 */
export function getBreadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Service Schema for individual service pages
 */
export function getServiceJsonLd(service: {
  title: string;
  slug: string;
  description: string;
  items: string[];
  group: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': absoluteUrl(`/services/${service.slug}#service`),
    name: `${service.title} Consulting`,
    serviceType: service.title,
    category: service.group,
    description: service.description,
    provider: {
      '@id': `${SITE_URL}/#organization`,
    },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '25.2048',
        longitude: '55.2708',
      },
      geoRadius: '2500000',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `${service.title} Capabilities`,
      itemListElement: service.items.map((item) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item,
        },
      })),
    },
  };
}

/**
 * Article Schema for Insights / Blog posts
 */
export function getArticleJsonLd(article: {
  title: string;
  slug: string;
  intro: string;
  category: string;
  paragraphs: string[];
  authorName?: string;
  datePublished?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': absoluteUrl(`/insights/${article.slug}#article`),
    headline: article.title,
    description: article.intro,
    articleSection: article.category,
    articleBody: article.paragraphs.join(' '),
    url: absoluteUrl(`/insights/${article.slug}`),
    datePublished: article.datePublished || '2025-01-15T08:00:00+04:00',
    dateModified: '2026-09-24T12:00:00+04:00',
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: article.authorName || 'Dan Gate Advisory Team',
      jobTitle: 'Consultant',
      worksFor: {
        '@id': `${SITE_URL}/#organization`,
      },
    },
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': absoluteUrl(`/insights/${article.slug}`),
    },
  };
}

/**
 * FAQPage Schema
 */
export function getFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
