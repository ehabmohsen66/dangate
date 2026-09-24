import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { services, consultants } from '@/lib/content';
import { PageHero } from '@/components/page-hero';
import { CallToAction } from '@/components/site-chrome';
import { JsonLd } from '@/components/json-ld';
import { getBreadcrumbJsonLd, getServiceJsonLd, SITE_URL } from '@/lib/seo';

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) return { title: 'Service not found' };

  const title = `${s.title} Consulting Dubai & GCC | Dan Gate`;
  const description = `${s.description} Dan Gate provides specialized ${s.title.toLowerCase()} consulting across Dubai, UAE, and the GCC.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/services/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/services/${slug}`,
      images: [
        {
          url: '/images/dubai.jpg',
          width: 2600,
          height: 1463,
          alt: `${s.title} Consulting - Dan Gate Dubai`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = services.find((s) => s.slug === slug);
  if (!s) notFound();
  const p = consultants[s.consultant];

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Our Expertise', path: '/services' },
    { name: s.title, path: `/services/${slug}` },
  ];

  return (
    <main id="main">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={getServiceJsonLd(s)} />
      <PageHero
        label={s.title}
        title={s.title + '.'}
        description={s.description}
        service={s.title}
      />
      <section className="interior-content">
        <div className="service-detail">
          <div>
            <span className="eyebrow">BUILT AROUND YOUR OBJECTIVES</span>
            <h2>Where we can help.</h2>
            <ul className="scope-list">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <aside className="expert-aside">
            <img
              src={'/images/' + p.photo}
              alt={`${p.name} - ${p.role} at Dan Gate Consultancy Dubai`}
              width="100"
              height="100"
            />
            <span className="eyebrow">CONNECTED EXPERTISE</span>
            <h3>{p.name}</h3>
            <p>{p.role}</p>
            <Link
              className="text-link"
              href={
                '/contact?service=' +
                encodeURIComponent(s.title) +
                '&consultant=' +
                encodeURIComponent(p.name)
              }
            >
              Discuss your challenge <ArrowUpRight size={17} />
            </Link>
          </aside>
        </div>
        <div className="service-connected">
          <span className="eyebrow">BETTER CONNECTED</span>
          <h2>Explore related expertise.</h2>
          <div>
            {services
              .filter(
                (other) => other.group === s.group && other.slug !== s.slug
              )
              .slice(0, 3)
              .map((other) => (
                <Link key={other.slug} href={'/services/' + other.slug}>
                  {other.title} ↗
                </Link>
              ))}
          </div>
        </div>
      </section>
      <CallToAction />
    </main>
  );
}
