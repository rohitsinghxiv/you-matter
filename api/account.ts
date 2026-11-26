import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdmin, requireUser } from '../lib/supabaseAdmin.js';

/** DELETE /api/account : permanently deletes the caller's account and all their data (cascade). */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const user = await requireUser(req);
    if (!user) return res.status(401).json({ error: 'Sign in required.' });
    const { error } = await getAdmin().auth.admin.deleteUser(user.id);
    if (error) throw error;
    return res.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/account failed:', (err as Error)?.message);
    return res.status(500).json({ error: 'Could not delete account. Please try again.' });
  }
}
