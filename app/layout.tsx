import type {Metadata} from 'next';
import {Header,Footer} from '@/components/site-chrome';
import './globals.css';
export const metadata:Metadata={metadataBase:new URL('https://dan-gate-consultancy.rosy-song-2898.chatgpt.site'),title:{default:'Dan Gate | Strategy. Technology. Growth.',template:'%s | Dan Gate'},description:'Dubai-based consultants connecting business strategy, marketing and technology. Practical expertise in CRM, digital transformation, SEO, automation and AI across the GCC.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'},openGraph:{title:'Dan Gate | Strategy. Technology. Growth.',description:'Independent thinking. Connected expertise. Dubai-based business, marketing and technology consultancy for the GCC.',type:'website',locale:'en_AE'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Header/>{children}<Footer/></body></html>}
