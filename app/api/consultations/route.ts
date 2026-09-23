import {consultationSchema} from '@/lib/consultation';
import {consultationDb} from '@/db/consultations';
import {env} from 'cloudflare:workers';
export async function POST(request:Request){
try{
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Please send your enquiry from this website.'},{status:403});
 if(!request.headers.get('content-type')?.includes('application/json'))return Response.json({error:'Invalid request format.'},{status:415});
 const raw=await request.text();if(raw.length>15000)return Response.json({error:'Your enquiry is too long. Please shorten it and try again.'},{status:413});
 let payload;try{payload=JSON.parse(raw)}catch{return Response.json({error:'Invalid request.'},{status:400})}
 const parsed=consultationSchema.safeParse(payload);if(!parsed.success)return Response.json({error:parsed.error.issues[0].message},{status:400});
 const d=parsed.data;if(d.website)return Response.json({error:'Your enquiry could not be saved. Please try again.'},{status:400});
 const secret=env.TURNSTILE_SECRET_KEY;if(!secret){console.error('Turnstile secret key is not configured');return Response.json({error:'The security check is not configured. Please try again later.'},{status:503})}
 const verification=new FormData();verification.set('secret',secret);verification.set('response',d.turnstileToken);const remoteIp=request.headers.get('cf-connecting-ip');if(remoteIp)verification.set('remoteip',remoteIp);
 const verificationResponse=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verification});
 const verificationResult=await verificationResponse.json() as {success?:boolean;action?:string};const actionIsValid=verificationResult.action==='consultation'||(secret==='1x0000000000000000000000000000000AA'&&!verificationResult.action);if(!verificationResponse.ok||!verificationResult.success||!actionIsValid)return Response.json({error:'Please complete the security check and try again.'},{status:400});
 const db=consultationDb();const existing=await db.prepare('SELECT id FROM consultations WHERE id = ?').bind(d.requestId).first<{id:string}>();
 const reference='DG-'+d.requestId.slice(0,8).toUpperCase();if(existing)return Response.json({reference},{status:200});
 const ip=request.headers.get('cf-connecting-ip')||'local';const day=new Date().toISOString().slice(0,10);const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ip+':'+day));const hash=Array.from(new Uint8Array(digest)).map(v=>v.toString(16).padStart(2,'0')).join('');const now=Date.now();
 const result=await db.prepare('INSERT INTO consultations (id, name, company, job_title, email, phone, country, service, challenge, ip_hash, created_at) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM consultations WHERE ip_hash = ? AND created_at > ?) < 5 ON CONFLICT(id) DO NOTHING').bind(d.requestId,d.name,d.company,d.jobTitle,d.email,d.phone,d.country,d.service,d.challenge,hash,now,hash,now-3600000).run();
 if(!result.meta.changes)return Response.json({error:'Several enquiries have already been received. Please try again in an hour.'},{status:429});
 return Response.json({reference},{status:201});
}catch(error){console.error('Consultation could not be saved',error instanceof Error?error.message:'Unknown error');return Response.json({error:'We couldn’t save your request just now. Your details are still here — please try again shortly.'},{status:503})}}
