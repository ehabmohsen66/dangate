// Content for the redesigned homepage (stats strip, platforms marquee, selected work).
// ⚠️ Anything marked `placeholder: true` is SAMPLE DATA. It renders with a small
// "Sample" tag on the site. Replace it with real figures and set placeholder to false
// (or delete the entry) before publishing.
import {services,consultants,countries} from '@/lib/content';

export type Stat={value:number;prefix?:string;suffix?:string;label:string;placeholder?:boolean};
export const stats:Stat[]=[
  {value:consultants.length,label:'Senior consultants you work with directly'},
  {value:countries.length,label:'GCC markets covered from Dubai'},
  {value:services.length,label:'Connected services, one team'},
  {value:100,suffix:'+',label:'Campaigns & projects delivered',placeholder:true},
];

// Platforms the team works with (swap for client logos once you have permission to show them).
export const platforms=['Meta Ads','Google Ads','GA4','HubSpot','Salesforce','Zoho CRM','LinkedIn Ads','TikTok Ads','Shopify','WordPress','Looker Studio','Zapier','Make','Search Console','Snapchat Ads','OpenAI'];

export type CaseStudy={industry:string;title:string;metric:number;decimals?:number;prefix?:string;suffix:string;metricLabel:string;before:string;after:string;services:string[];placeholder?:boolean};
export const caseStudies:CaseStudy[]=[
  {industry:'Real estate · UAE',title:'Rebuilt paid media and CRM hand-off for an off-plan launch.',metric:38,prefix:'−',suffix:'%',metricLabel:'cost per qualified lead',before:'AED 410 CPL',after:'AED 254 CPL',services:['Media buying','CRM integration'],placeholder:true},
  {industry:'Retail & e-commerce · KSA',title:'Technical SEO and content architecture for a bilingual store.',metric:2.4,decimals:1,suffix:'×',metricLabel:'organic revenue in 6 months',before:'18% of revenue',after:'41% of revenue',services:['SEO','Web technology'],placeholder:true},
  {industry:'Professional services · Qatar',title:'Positioning, lead automation and a clear go-to-market plan.',metric:65,prefix:'+',suffix:'%',metricLabel:'sales pipeline value',before:'Manual follow-up',after:'Automated nurture',services:['Strategy','Automation'],placeholder:true},
];
