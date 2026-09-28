export function consultationDb() {
  try {
    // Dynamic access to avoid build-time errors when not on Cloudflare
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const cf = typeof process !== 'undefined' ? (globalThis as unknown as { env?: { DB?: unknown } }) : undefined;
    if (cf?.env?.DB) return cf.env.DB;
  } catch {
    // ignore
  }
  return null;
}
