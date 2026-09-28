import {consultationSchema} from '@/lib/consultation';
import {generateCaptcha, verifyCaptcha} from '@/lib/captcha';

// In-memory rate limiting and storage for environments without Cloudflare D1
interface ConsultationRecord {
  id: string;
  name: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  challenge: string;
  createdAt: number;
  ipHash: string;
}

const memoryStore = new Map<string, ConsultationRecord>();
const ipSubmissions = new Map<string, number[]>();

export async function GET() {
  const challenge = generateCaptcha();
  return Response.json(challenge, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    }
  });
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) {
      return Response.json(
        {error: 'Please send your enquiry from this website.'},
        {status: 403}
      );
    }

    if (!request.headers.get('content-type')?.includes('application/json')) {
      return Response.json(
        {error: 'Invalid request format.'},
        {status: 415}
      );
    }

    const raw = await request.text();
    if (raw.length > 15000) {
      return Response.json(
        {error: 'Your enquiry is too long. Please shorten it and try again.'},
        {status: 413}
      );
    }

    let payload: unknown;
    try {
      payload = JSON.parse(raw);
    } catch {
      return Response.json({error: 'Invalid request.'}, {status: 400});
    }

    const parsed = consultationSchema.safeParse(payload);
    if (!parsed.success) {
      return Response.json(
        {error: parsed.error.issues[0].message},
        {status: 400}
      );
    }

    const d = parsed.data;

    // Honeypot check
    if (d.website) {
      return Response.json(
        {error: 'Your enquiry could not be saved. Please try again.'},
        {status: 400}
      );
    }

    // Math Captcha verification
    const isCaptchaValid = verifyCaptcha(d.captchaAnswer, d.captchaToken);
    if (!isCaptchaValid) {
      return Response.json(
        {error: 'Incorrect security answer. Please solve the math question again.'},
        {status: 400}
      );
    }

    const reference = 'DG-' + d.requestId.slice(0, 8).toUpperCase();

    // Check if duplicate submission
    if (memoryStore.has(d.requestId)) {
      return Response.json({reference}, {status: 200});
    }

    const forwarded = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'local';
    const clientIp = forwarded.split(',')[0].trim();
    const day = new Date().toISOString().slice(0, 10);
    const digest = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(clientIp + ':' + day)
    );
    const ipHash = Array.from(new Uint8Array(digest))
      .map(v => v.toString(16).padStart(2, '0'))
      .join('');
    const now = Date.now();

    // Try Cloudflare D1 if available in Cloudflare runtime
    let savedToD1 = false;
    try {
      const {env} = await import('cloudflare:workers');
      if (env?.DB) {
        const existing = await env.DB.prepare('SELECT id FROM consultations WHERE id = ?')
          .bind(d.requestId)
          .first<{id: string}>();
        if (existing) {
          return Response.json({reference}, {status: 200});
        }

        const result = await env.DB.prepare(
          'INSERT INTO consultations (id, name, company, job_title, email, phone, country, service, challenge, ip_hash, created_at) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? WHERE (SELECT COUNT(*) FROM consultations WHERE ip_hash = ? AND created_at > ?) < 5 ON CONFLICT(id) DO NOTHING'
        ).bind(
          d.requestId,
          d.name,
          d.company,
          d.jobTitle,
          d.email,
          d.phone,
          d.country,
          d.service,
          d.challenge,
          ipHash,
          now,
          ipHash,
          now - 3600000
        ).run();

        if (result?.meta && !result.meta.changes) {
          return Response.json(
            {error: 'Several enquiries have already been received. Please try again in an hour.'},
            {status: 429}
          );
        }
        savedToD1 = true;
      }
    } catch {
      // Not on Cloudflare D1 runtime; fallback to memoryStore
    }

    if (!savedToD1) {
      // Memory store rate limiting (max 5 per IP per hour)
      const recent = (ipSubmissions.get(ipHash) || []).filter(t => now - t < 3600000);
      if (recent.length >= 5) {
        return Response.json(
          {error: 'Several enquiries have already been received. Please try again in an hour.'},
          {status: 429}
        );
      }
      recent.push(now);
      ipSubmissions.set(ipHash, recent);

      memoryStore.set(d.requestId, {
        id: d.requestId,
        name: d.name,
        company: d.company,
        jobTitle: d.jobTitle,
        email: d.email,
        phone: d.phone,
        country: d.country,
        service: d.service,
        challenge: d.challenge,
        createdAt: now,
        ipHash
      });
    }

    return Response.json({reference}, {status: 201});
  } catch (error) {
    console.error('Consultation could not be saved', error instanceof Error ? error.message : 'Unknown error');
    return Response.json(
      {error: 'We couldn’t save your request just now. Your details are still here — please try again shortly.'},
      {status: 503}
    );
  }
}
