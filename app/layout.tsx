import type { Metadata, Viewport } from 'next';
import { Header, Footer } from '@/components/site-chrome';
import { JsonLd } from '@/components/json-ld';
import {
  SITE_URL,
  SITE_NAME,
  SITE_FULL_NAME,
  KEYWORDS,
  getOrganizationJsonLd,
  getWebSiteJsonLd,
} from '@/lib/seo';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#0a0d14',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dan Gate | Business Strategy, Marketing & Technology Consultancy Dubai',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Dan Gate connects business strategy, marketing and technology for ambitious organizations in Dubai, UAE and across the GCC. Practical expertise in CRM, digital transformation, technical SEO, media buying and AI automation.',
  keywords: KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_FULL_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_FULL_NAME,
  category: 'Business & Consulting',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Dan Gate | Business Strategy, Marketing & Technology Consultancy Dubai',
    description:
      'Independent thinking. Connected expertise. Dubai-based business, marketing and technology consultancy for high-growth enterprises in the UAE & GCC.',
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: '/images/dubai.jpg',
        width: 2600,
        height: 1463,
        alt: 'Dan Gate Consultancy - Dubai and GCC Presence',
      },
    ],
    locale: 'en_AE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dan Gate | Strategy. Technology. Growth.',
    description:
      'Dubai-based consultants connecting business strategy, marketing and technology across the GCC.',
    images: ['/images/dubai.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@400;500;600;700;800&display=swap"
        />
        <JsonLd data={getOrganizationJsonLd()} />
        <JsonLd data={getWebSiteJsonLd()} />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
