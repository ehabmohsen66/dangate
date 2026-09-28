import crypto from 'node:crypto';

const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || 'dan-gate-secure-math-captcha-salt-2026';

export interface CaptchaChallenge {
  question: string;
  token: string;
}

export function generateCaptcha(): CaptchaChallenge {
  // Generate two intuitive single-digit numbers (1 to 9)
  const num1 = Math.floor(Math.random() * 9) + 1;
  const num2 = Math.floor(Math.random() * 9) + 1;
  const sum = num1 + num2;
  const timestamp = Date.now();

  const signature = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(`${timestamp}:${sum}`)
    .digest('hex');

  const token = `${timestamp}:${num1}:${num2}:${signature}`;

  return {
    question: `${num1} + ${num2}`,
    token
  };
}

export function verifyCaptcha(answer: string, token: string): boolean {
  if (!answer || !token) return false;

  const parts = token.split(':');
  if (parts.length !== 4) return false;

  const [timestampStr, num1Str, num2Str, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  const num1 = parseInt(num1Str, 10);
  const num2 = parseInt(num2Str, 10);

  if (isNaN(timestamp) || isNaN(num1) || isNaN(num2)) return false;

  // 15 minutes expiration window
  if (Date.now() - timestamp > 15 * 60 * 1000) return false;

  const expectedSum = num1 + num2;
  const expectedSignature = crypto
    .createHmac('sha256', CAPTCHA_SECRET)
    .update(`${timestamp}:${expectedSum}`)
    .digest('hex');

  try {
    const isSignatureValid = crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
    if (!isSignatureValid) return false;

    const parsedAnswer = parseInt(answer.trim(), 10);
    return parsedAnswer === expectedSum;
  } catch {
    return false;
  }
}
