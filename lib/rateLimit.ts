import type { VercelRequest } from '@vercel/node';

/**
 * Best-effort in-memory limiter. On serverless this is per-instance only,
 * so treat it as a speed bump. For real protection use Upstash Redis
 * (@upstash/ratelimit) or Vercel WAF rate-limit rules.
 */
const hits = new Map<string, number[]>();

export function clientIp(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  return (raw?.split(',')[0] || req.socket?.remoteAddress || 'unknown').trim();
}

export function rateLimited(req: VercelRequest, bucket: string, limit: number, windowMs: number): boolean {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  }
  return recent.length > limit;
}
