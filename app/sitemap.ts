import type {MetadataRoute} from 'next';
import {services,insights} from '@/lib/content';
export default function sitemap():MetadataRoute.Sitemap{const origin='https://dan-gate-consultancy.rosy-song-2898.chatgpt.site';return ['','/services','/about','/consultants','/industries','/gcc','/insights','/contact',...services.map(s=>'/services/'+s.slug),...insights.map(a=>'/insights/'+a.slug)].map(path=>({url:origin+path,changeFrequency:'monthly',priority:path===''?1:.7}))}
