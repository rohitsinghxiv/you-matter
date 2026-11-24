import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

let admin: SupabaseClient | null = null;

/** Service-role client. SERVER ONLY: it bypasses Row Level Security. */
export function getAdmin(): SupabaseClient {
  if (admin) return admin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase server env vars missing');
  admin = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return admin;
}

/** Verify the caller's Supabase JWT. Returns the user id or null. */
export async function requireUser(req: VercelRequest): Promise<{ id: string } | null> {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return null;
  const { data, error } = await getAdmin().auth.getUser(token);
  if (error || !data.user) return null;
  const { data: profile } = await getAdmin().from('profiles').select('is_banned').eq('id', data.user.id).single();
  if (!profile || profile.is_banned) return null;
  return { id: data.user.id };
}
