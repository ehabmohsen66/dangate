import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import { insights, services, consultants } from '@/lib/content';
import { PageHero } from '@/components/page-hero';
import { JsonLd } from '@/components/json-ld';
import { getBreadcrumbJsonLd, getArticleJsonLd, SITE_URL } from '@/lib/seo';

export async function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = insights.find((a) => a.slug === slug);
  if (!a) return { title: 'Insight not found' };

  const title = `${a.title} | Dan Gate Insights`;
  const description = a.intro;

  return {
    title,
    description,
    alternates: {
      canonical: `/insights/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/insights/${slug}`,
      type: 'article',
      images: [
        {
          url: '/images/dubai.jpg',
          width: 2600,
          height: 1463,
          alt: `${a.title} - Dan Gate Insights`,
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

export default async function InsightPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = insights.find((a) => a.slug === slug);
  if (!a) notFound();

  const relatedService = services.find((s) => s.slug === a.service);
  const author = relatedService ? consultants[relatedService.consultant]?.name : 'Dan Gate Advisory';

  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Insights', path: '/insights' },
    { name: a.title, path: `/insights/${slug}` },
  ];

  const articleSchema = getArticleJsonLd({
    ...a,
    authorName: author,
  });

  return (
    <main id="main">
      <JsonLd data={getBreadcrumbJsonLd(breadcrumbs)} />
      <JsonLd data={articleSchema} />
      <PageHero label={a.category} title={a.title} />
      <article className="article">
        <p className="article-intro">{a.intro}</p>
        {a.paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <div className="article-cta">
          <span className="eyebrow">PUT THE THINKING INTO PRACTICE</span>
          <Link
            className="text-link"
            href={'/services/' + a.service}
          >
            Explore {relatedService?.title.toLowerCase()} <ArrowUpRight size={18} />
          </Link>
        </div>
        <Link className="text-link" href="/insights">
          Back to all insights
        </Link>
      </article>
    </main>
  );
}
