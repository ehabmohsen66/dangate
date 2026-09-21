import {env} from 'cloudflare:workers';
export function consultationDb(){if(!env.DB)throw new Error('Consultation database unavailable');return env.DB;}
