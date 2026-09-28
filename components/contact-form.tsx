'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, Check, RefreshCw} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem} from '@/components/ui/select';
import {services, countries} from '@/lib/content';
import {consultationSchema} from '@/lib/consultation';

const empty = {
  name: '',
  company: '',
  jobTitle: '',
  email: '',
  phone: '',
  country: 'United Arab Emirates',
  service: 'Not sure yet',
  challenge: '',
  website: '',
  captchaAnswer: ''
};

export function ContactForm() {
  const [values, setValues] = useState(() => {
    if (typeof window === 'undefined') return empty;
    const q = new URLSearchParams(window.location.search);
    const selected = q.get('service');
    const context = [
      q.get('consultant') && 'I would like to speak with ' + q.get('consultant') + '.',
      q.get('industry') && 'My industry: ' + q.get('industry') + '.',
      q.get('challenge') && 'I would like help with ' + q.get('challenge') + '.'
    ].filter(Boolean).join('\n');
    return {
      ...empty,
      service: services.some(s => s.title === selected) ? selected! : 'Not sure yet',
      challenge: context
    };
  });

  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [loadingCaptcha, setLoadingCaptcha] = useState(true);

  const requestId = useRef(typeof crypto === 'undefined' ? '' : crypto.randomUUID());
  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  const fetchCaptcha = async () => {
    setLoadingCaptcha(true);
    try {
      const res = await fetch('/api/consultations', {method: 'GET', cache: 'no-store'});
      if (res.ok) {
        const data = await res.json() as {question: string; token: string};
        setCaptchaQuestion(data.question);
        setCaptchaToken(data.token);
        setValues(v => ({...v, captchaAnswer: ''}));
      }
    } catch {
      // Fallback local challenge if offline/network hiccup
      setCaptchaQuestion('5 + 3');
    } finally {
      setLoadingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  useEffect(() => {
    if (status === 'success' || status === 'error') {
      messageRef.current?.focus();
    }
  }, [status]);

  const change = (field: string, value: string) => setValues(v => ({...v, [field]: value}));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setError('');

    const parsed = consultationSchema.safeParse({
      ...values,
      requestId: requestId.current,
      captchaToken
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      setStatus('error');
      return;
    }

    setStatus('sending');

    try {
      const response = await fetch('/api/consultations', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(parsed.data)
      });

      const result = await response.json() as {error?: string; reference: string};

      if (!response.ok) {
        // Refresh captcha on failure
        fetchCaptcha();
        throw new Error(result.error || 'Your enquiry could not be saved. Please try again.');
      }

      setReference(result.reference);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Please try again.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="form-success" tabIndex={-1} ref={messageRef} role="status">
        <Check size={34} color="#075794" />
        <h2>Your next chapter<br />is on the table.</h2>
        <p>Thank you, {values.name.split(' ')[0]}. Your consultation request has been saved for the Dan Gate team to review.</p>
        <p className="reference">Your reference: {reference}</p>
        <Link className="text-link" href="/services">
          Explore our expertise <ArrowUpRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} className="contact-form" onSubmit={submit} aria-label="Request a consultation">
      <div className="field full">
        <span className="eyebrow">TELL US ABOUT YOUR PROJECT</span>
      </div>

      {[
        ['name', 'Your name *', 'text', 'name'],
        ['company', 'Company', 'text', 'organization'],
        ['jobTitle', 'Job title', 'text', 'organization-title'],
        ['email', 'Business email *', 'email', 'email'],
        ['phone', 'Phone / WhatsApp', 'tel', 'tel']
      ].map(([name, label, type, auto]) => (
        <div className="field" key={name}>
          <label htmlFor={name}>{label}</label>
          <Input
            id={name}
            name={name}
            type={type}
            autoComplete={auto}
            value={values[name as keyof typeof values]}
            onChange={e => change(name, e.target.value)}
            required={['name', 'email'].includes(name)}
            maxLength={name === 'email' ? 254 : 150}
          />
        </div>
      ))}

      <div className="field">
        <label htmlFor="country">Country *</label>
        <Select value={values.country} onValueChange={v => change('country', v)}>
          <SelectTrigger id="country" aria-label="Country">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[...countries, 'Egypt', 'Other country'].map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="field full">
        <label htmlFor="service">What can we help you with?</label>
        <Select value={values.service} onValueChange={v => change('service', v)}>
          <SelectTrigger id="service" aria-label="What can we help you with?">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not sure yet">Not sure yet — let’s explore</SelectItem>
            {services.map(s => (
              <SelectItem value={s.title} key={s.slug}>{s.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="field full">
        <label htmlFor="challenge">Tell us about your challenge *</label>
        <Textarea
          id="challenge"
          name="challenge"
          placeholder="What are you working towards, and what’s getting in the way?"
          value={values.challenge}
          onChange={e => change('challenge', e.target.value)}
          required
          minLength={20}
          maxLength={4000}
        />
      </div>

      {/* Honeypot field for bot suppression */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={e => change('website', e.target.value)}
        />
      </div>

      {/* Simplified, elegant math verification */}
      <div className="field full captcha-box" style={{background: '#f4f6f8', padding: '18px 20px', border: '1px solid #d5dce2', borderRadius: '4px', marginTop: '6px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px'}}>
          <label htmlFor="captchaAnswer" style={{fontWeight: 600, fontSize: '14px', letterSpacing: '0.02em', color: 'var(--ink)'}}>
            Security Question: What is <span style={{display: 'inline-block', background: '#fff', padding: '2px 8px', borderRadius: '3px', border: '1px solid #c9ced2', fontWeight: 700, margin: '0 4px', color: 'var(--blue)'}}>{captchaQuestion || '...'}</span> ? *
          </label>
          <button
            type="button"
            onClick={fetchCaptcha}
            title="Refresh question"
            disabled={loadingCaptcha}
            style={{background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center', color: '#606471'}}
          >
            <RefreshCw size={16} className={loadingCaptcha ? 'animate-spin' : ''} />
          </button>
        </div>
        <Input
          id="captchaAnswer"
          name="captchaAnswer"
          type="number"
          placeholder="Enter the number"
          value={values.captchaAnswer}
          onChange={e => change('captchaAnswer', e.target.value)}
          required
          style={{maxWidth: '220px', background: '#fff'}}
        />
      </div>

      <p className="form-note">
        * Required fields. We’ll use your details to understand and respond to your enquiry.{' '}
        <Link href="/privacy">How we handle your information.</Link>
      </p>

      {error && (
        <div className="form-message" role="alert" tabIndex={-1} ref={messageRef}>
          {error}
        </div>
      )}

      <div className="form-submit">
        <Button
          className="button"
          type="submit"
          disabled={status === 'sending' || !values.captchaAnswer}
        >
          {status === 'sending' ? 'Saving your request…' : 'Request a consultation'}
          <ArrowUpRight size={20} />
        </Button>
      </div>
    </form>
  );
}
