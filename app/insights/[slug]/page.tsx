import Link from 'next/link';
import {notFound} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import type {Metadata} from 'next';
import {insights,services} from '@/lib/content';
import {PageHero} from '@/components/page-hero';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const a=insights.find(a=>a.slug===slug);return a?{title:a.title,description:a.intro,alternates:{canonical:'/insights/'+slug}}:{title:'Insight not found'}}
export default async function InsightPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const a=insights.find(a=>a.slug===slug);if(!a)notFound();return <main id="main"><PageHero label={a.category} title={a.title}/><article className="article"><p className="article-intro">{a.intro}</p>{a.paragraphs.map(p=><p key={p}>{p}</p>)}<div className="article-cta"><span className="eyebrow">PUT THE THINKING INTO PRACTICE</span><Link className="text-link" href={'/services/'+a.service}>Explore {services.find(s=>s.slug===a.service)?.title.toLowerCase()} <ArrowUpRight size={18}/></Link></div><Link className="text-link" href="/insights">Back to all insights</Link></article></main>}
