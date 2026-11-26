import { JournalDigest, ActionStepItem, CheerfulComment } from '../types';
import { supabase, authHeader } from '../lib/supabase';

const EMOJIS = ['🤍', '🫂', '🕯️', '🌱', '✨'] as const;
type Emoji = (typeof EMOJIS)[number];

export const DEFAULT_ACTION_STEPS: ActionStepItem[] = [
  {
    id: 'step_breath_478',
    phase: 'breathe',
    title: 'Emergency 60-Second 4-7-8 Breathing Pacer',
    subtitle: 'Downregulate your nervous system immediately',
    detail:
      'Inhale softly through your nose for 4 seconds, hold gently for 7 seconds, exhale with a warm whoosh for 8 seconds. Repeat 4 cycles to signal to your amygdala that you are safe in this exact moment.',
    timeEstimate: '60 sec',
    iconName: 'Wind',
    completed: false,
  },
  {
    id: 'step_ground_senses',
    phase: 'ground',
    title: '5-4-3-2-1 Somatic Sensation Anchoring',
    subtitle: 'Pull yourself out of the panic spiral',
    detail:
      'Find 5 things you can see right now, 4 things you can physically touch (fabric, cold surface), 3 sounds you can hear, 2 scents, and 1 kind truth about yourself.',
    timeEstimate: '3 min',
    iconName: 'Eye',
    completed: false,
  },
  {
    id: 'step_water_temp',
    phase: 'emergency',
    title: 'Splash Cold Water & Drink a Tall Glass',
    subtitle: 'Activate the mammalian dive reflex to drop high anxiety',
    detail:
      'Go to the sink, run cold water over your wrists, and splash your face. Then sip a cool glass of water slowly without looking at your screen.',
    timeEstimate: '2 min',
    iconName: 'Droplets',
    completed: false,
  },
  {
    id: 'step_unburden_write',
    phase: 'gentle',
    title: 'Pour Out the Heaviest Thought',
    subtitle: 'Externalize what hurts so it stops echoing inside',
    detail:
      'Write down why you are feeling low on paper or in this You Matter journal. Getting words outside your chest reduces their crushing weight.',
    timeEstimate: '5 min',
    iconName: 'PenTool',
    completed: false,
  },
  {
    id: 'step_hourly_contract',
    phase: 'anchor',
    title: 'Hourly Self-Compassion Contract',
    subtitle: 'Survive just this next hour',
    detail:
      'Tell yourself: "I do not have to solve my entire future today. I only need to get through the next 60 minutes with gentleness toward myself."',
    timeEstimate: '1 min',
    iconName: 'ShieldCheck',
    completed: false,
  },
  {
    id: 'step_one_safe_person',
    phase: 'action',
    title: 'Signal to 1 Safe Person or Free Helpline',
    subtitle: 'Break isolation with a low-friction message',
    detail:
      'Send a simple text: "Having a hard time tonight, could use a gentle word." Or text HOME to 741741 (free 24/7 crisis text line) or call 988.',
    timeEstimate: '2 min',
    iconName: 'HeartHandshake',
    completed: false,
  },
];

const JOURNAL_SELECT = `
  *,
  profiles!user_id(pen_name, avatar_sticker, signature),
  reactions(user_id, emoji),
  comments(id, journal_id, user_id, content, ai_moderation, created_at, profiles!user_id(pen_name, avatar_sticker, signature))
`;

function mapComment(c: any): CheerfulComment {
  return {
    id: c.id,
    journalId: c.journal_id,
    userId: c.user_id,
    authorPenName: c.profiles?.pen_name ?? 'Friend',
    authorAvatar: c.profiles?.avatar_sticker ?? '🌸',
    authorSignature: c.profiles?.signature ?? '',
    content: c.content,
    createdAt: c.created_at,
    aiModeration: {
      isApproved: true,
      warmthScore: c.ai_moderation?.warmthScore ?? 0,
      cheerfulReason: c.ai_moderation?.cheerfulReason ?? '',
      tag: c.ai_moderation?.tag ?? 'Kind Words',
    },
    likes: 0,
  };
}

function mapJournal(r: any): JournalDigest {
  const reactions: JournalDigest['reactions'] = { '🤍': 0, '🫂': 0, '🕯️': 0, '🌱': 0, '✨': 0 };
  const userReactions: Record<string, string> = {};
  for (const x of r.reactions ?? []) {
    if (x.emoji in reactions) reactions[x.emoji as Emoji] += 1;
    userReactions[x.user_id] = x.emoji;
  }
  return {
    id: r.id,
    userId: r.user_id,
    authorPenName: r.profiles?.pen_name ?? 'Friend',
    authorAvatar: r.profiles?.avatar_sticker ?? '🌸',
    authorSignature: r.profiles?.signature ?? '',
    title: r.title,
    monthLabel: r.month_label,
    date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    isPublic: r.is_public,
    mood: r.mood,
    reflectionBody: r.reflection_body,
    currentStruggle: r.current_struggle,
    copingMechanism: r.coping_mechanism,
    adviceWanted: r.advice_wanted,
    stepsTaking: r.steps_taking ?? [],
    smallWins: r.small_wins ?? [],
    featuredQuote: r.featured_quote ?? undefined,
    snapshots: r.snapshots ?? undefined,
    watchedMedia: r.watched_media ?? undefined,
    readingItems: r.reading_items ?? undefined,
    listeningTo: r.listening_to ?? undefined,
    reactions,
    userReactions,
    comments: (r.comments ?? []).map(mapComment).sort((a: CheerfulComment, b: CheerfulComment) => a.createdAt.localeCompare(b.createdAt)),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export async function fetchJournals(): Promise<JournalDigest[]> {
  const { data, error } = await supabase
    .from('journals')
    .select(JOURNAL_SELECT)
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []).map(mapJournal);
}

function journalRow(d: Partial<JournalDigest>) {
  return {
    title: (d.title || 'Untitled reflection').slice(0, 200),
    is_public: d.isPublic ?? true,
    mood: d.mood ?? 'holding-on',
    reflection_body: d.reflectionBody ?? '',
    current_struggle: d.currentStruggle ?? '',
    coping_mechanism: d.copingMechanism ?? '',
    advice_wanted: d.adviceWanted ?? '',
    steps_taking: (d.stepsTaking ?? []).slice(0, 20),
    small_wins: (d.smallWins ?? []).slice(0, 20),
    featured_quote: d.featuredQuote ?? null,
    snapshots: d.snapshots ?? null,
    watched_media: d.watchedMedia ?? null,
    reading_items: d.readingItems ?? null,
    listening_to: d.listeningTo ?? null,
  };
}

export async function saveJournal(userId: string, d: Partial<JournalDigest>): Promise<JournalDigest> {
  const q = d.id
    ? supabase.from('journals').update(journalRow(d)).eq('id', d.id)
    : supabase.from('journals').insert({ ...journalRow(d), user_id: userId });
  const { data, error } = await q.select(JOURNAL_SELECT).single();
  if (error) throw error;
  return mapJournal(data);
}

export async function deleteJournal(id: string) {
  const { error } = await supabase.from('journals').delete().eq('id', id);
  if (error) throw error;
}

/** Sets, switches, or clears (when same emoji is chosen again) the user's single reaction. */
export async function setReaction(journalId: string, userId: string, emoji: Emoji, current?: string) {
  if (current === emoji) {
    const { error } = await supabase.from('reactions').delete().eq('journal_id', journalId).eq('user_id', userId);
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('reactions')
      .upsert({ journal_id: journalId, user_id: userId, emoji }, { onConflict: 'journal_id,user_id' });
    if (error) throw error;
  }
}

/** Comments go through the server so every one is moderated before it is stored. */
export async function postComment(
  journalId: string,
  content: string
): Promise<{ success: boolean; comment?: CheerfulComment; error?: string }> {
  try {
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
      body: JSON.stringify({ journalId, content }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || 'We could not post your comment. Please try again.' };
    }
    return { success: true, comment: mapComment(data.comment) };
  } catch {
    return { success: false, error: 'We could not reach the server. Please try again.' };
  }
}

export async function reportContent(userId: string, targetType: 'journal' | 'comment', targetId: string, reason: string) {
  const { error } = await supabase
    .from('reports')
    .upsert({ reporter_id: userId, target_type: targetType, target_id: targetId, reason: reason.slice(0, 500) },
      { onConflict: 'reporter_id,target_type,target_id', ignoreDuplicates: true });
  if (error) throw error;
}

// ---------- coping steps ----------
const LOCAL_KEY = 'you_matter_steps_guest_v1'; // guests only; contains no personal data

export async function fetchSteps(userId?: string): Promise<ActionStepItem[]> {
  if (!userId) {
    try {
      const saved: Record<string, boolean> = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
      return DEFAULT_ACTION_STEPS.map((s) => ({ ...s, completed: !!saved[s.id] }));
    } catch {
      return DEFAULT_ACTION_STEPS;
    }
  }
  const { data, error } = await supabase.from('user_steps').select('*').eq('user_id', userId);
  if (error) throw error;
  const rows = data ?? [];
  const progress = new Map(rows.filter((r) => !r.is_custom).map((r) => [r.step_id, r]));
  const defaults = DEFAULT_ACTION_STEPS.map((s) => {
    const p = progress.get(s.id);
    return p ? { ...s, completed: p.completed, completedAt: p.completed_at ?? undefined, reflectionNote: p.reflection_note ?? undefined } : s;
  });
  const custom: ActionStepItem[] = rows
    .filter((r) => r.is_custom)
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .map((r) => ({
      id: r.step_id, userId, phase: r.phase ?? 'action', title: r.title ?? '', subtitle: r.subtitle ?? '',
      detail: r.detail ?? '', timeEstimate: r.time_estimate ?? '3 min', iconName: r.icon_name ?? 'Sparkles',
      completed: r.completed, completedAt: r.completed_at ?? undefined, isCustom: true, reflectionNote: r.reflection_note ?? undefined,
    }));
  return [...custom, ...defaults];
}

export async function saveStepProgress(userId: string | undefined, step: ActionStepItem) {
  if (!userId) {
    try {
      const saved = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}');
      saved[step.id] = step.completed;
      localStorage.setItem(LOCAL_KEY, JSON.stringify(saved));
    } catch { /* ignore */ }
    return;
  }
  const base = {
    user_id: userId, step_id: step.id, completed: step.completed,
    completed_at: step.completed ? new Date().toISOString() : null,
    reflection_note: step.reflectionNote ?? null,
  };
  const row = step.isCustom
    ? { ...base, is_custom: true, phase: step.phase, title: step.title.slice(0, 200), subtitle: step.subtitle.slice(0, 200),
        detail: step.detail.slice(0, 1500), time_estimate: step.timeEstimate, icon_name: step.iconName }
    : base;
  const { error } = await supabase.from('user_steps').upsert(row, { onConflict: 'user_id,step_id' });
  if (error) throw error;
}

export async function deleteCustomStep(userId: string | undefined, stepId: string) {
  if (!userId) return;
  const { error } = await supabase.from('user_steps').delete().eq('user_id', userId).eq('step_id', stepId);
  if (error) throw error;
}
