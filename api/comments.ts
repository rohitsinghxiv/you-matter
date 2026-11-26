import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getAdmin, requireUser } from '../lib/supabaseAdmin.js';
import { clean } from '../lib/gemini.js';
import { moderateComment } from '../lib/moderation.js';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

  try {
    const user = await requireUser(req);
    if (!user) return res.status(401).json({ success: false, error: 'Please sign in to leave a comment.' });

    const body = typeof req.body === 'object' && req.body ? req.body : {};
    const journalId = String(body.journalId || '');
    const content = clean(body.content, 1500);
    if (!UUID.test(journalId)) return res.status(400).json({ success: false, error: 'Invalid post.' });
    if (!content) return res.status(400).json({ success: false, error: 'Comment cannot be empty.' });

    const db = getAdmin();

    // Rate limits stored in the DB so they hold across serverless instances.
    const since = (ms: number) => new Date(Date.now() - ms).toISOString();
    const [{ count: lastMinute }, { count: lastDay }] = await Promise.all([
      db.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', since(60_000)),
      db.from('comments').select('id', { count: 'exact', head: true }).eq('user_id', user.id).gte('created_at', since(86_400_000)),
    ]);
    if ((lastMinute ?? 0) >= 4 || (lastDay ?? 0) >= 60) {
      return res.status(429).json({ success: false, error: 'You are commenting very quickly. Please take a breath and try again in a bit.' });
    }

    const { data: journal } = await db
      .from('journals')
      .select('id, title, current_struggle, reflection_body, is_public, is_hidden, profiles!user_id(pen_name)')
      .eq('id', journalId).single();
    if (!journal || !journal.is_public || journal.is_hidden) {
      return res.status(404).json({ success: false, error: 'This post is not available.' });
    }
    const authorName = (journal as any).profiles?.pen_name || 'Friend';

    const verdict = await moderateComment({
      commentText: content,
      journalTitle: clean(journal.title, 200),
      journalContent: clean(journal.current_struggle || journal.reflection_body, 400),
      authorName: clean(authorName, 60),
    });
    if (!verdict.isApproved) {
      return res.status(verdict.unavailable ? 503 : 200).json({ success: false, error: verdict.rejectionReason });
    }

    const ai_moderation = {
      isApproved: true, warmthScore: verdict.warmthScore, cheerfulReason: verdict.cheerfulReason, tag: verdict.tag,
    };
    const { data: row, error } = await db
      .from('comments')
      .insert({ journal_id: journalId, user_id: user.id, content, ai_moderation })
      .select('id, journal_id, user_id, content, ai_moderation, created_at, profiles!user_id(pen_name, avatar_sticker, signature)')
      .single();
    if (error || !row) throw error || new Error('insert failed');

    return res.json({ success: true, comment: row });
  } catch (err) {
    console.error('POST /api/comments failed:', (err as Error)?.message);
    return res.status(500).json({ success: false, error: 'Something went wrong. Please try again.' });
  }
}
