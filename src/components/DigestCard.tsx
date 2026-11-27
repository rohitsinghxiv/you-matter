import React, { useState } from 'react';
import { JournalDigest, User } from '../types';
import {
  MessageCircle,
  Share2,
  Sparkles,
  Send,
  Lock,
  Globe,
  Quote,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Anchor,
  Compass,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CornerWashiTape } from './DoodlesAndBotanicals';

interface DigestCardProps {
  digest: JournalDigest;
  currentUser: User | null;
  onAddComment: (journalId: string, text: string) => Promise<{ success: boolean; error?: string }>;
  onToggleReaction: (journalId: string, emoji: '🤍' | '🫂' | '🕯️' | '🌱' | '✨') => void;
  onEdit?: (digest: JournalDigest) => void;
  onDelete?: (journalId: string) => void;
  onReport?: (journalId: string) => void;
  onRequireAuth: () => void;
}

export const DigestCard: React.FC<DigestCardProps> = ({
  digest,
  currentUser,
  onAddComment,
  onToggleReaction,
  onEdit,
  onDelete,
  onReport,
  onRequireAuth,
}) => {
  const { isDark } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const MOOD_LABELS: Record<string, { label: string; icon: string }> = {
    'holding-on': { label: 'Holding On', icon: '🕯️' },
    'heavy-hearted': { label: 'Heavy-Hearted', icon: '🌧️' },
    overwhelmed: { label: 'Overwhelmed', icon: '🌪️' },
    numb: { label: 'Feeling Numb', icon: '🌫️' },
    tender: { label: 'Tender & Vulnerable', icon: '🌸' },
    'seeking-light': { label: 'Seeking Light', icon: '✨' },
    grieving: { label: 'Navigating Grief', icon: '🍂' },
    hopeful: { label: 'Glimmer of Hope', icon: '🌱' },
  };

  const currentMood = MOOD_LABELS[digest.mood] || {
    label: digest.mood,
    icon: '🕯️',
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setIsSubmittingComment(true);
    setCommentError('');

    try {
      const res = await onAddComment(digest.id, commentText);
      if (res.success) {
        setCommentText('');
      } else {
        setCommentError(
          res.error || 'Comment could not be posted. Please ensure your words are supportive.'
        );
      }
    } catch (err: any) {
      setCommentError(err.message || 'Failed to submit comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const isOwner = currentUser && currentUser.id === digest.userId;

  const formatCommentTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div data-nosnippet>
    <article id={`journal-${digest.id}`} className="entry-box mb-14 space-y-5">
      {/* Top Meta Line: Variation 6 .sidebar-label + Mood + Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="sidebar-label mb-0">
            Reflection: {digest.authorPenName} / {digest.date}
          </span>

          <span
            className={`text-[10px] font-mono-clean uppercase tracking-wider px-2 py-0.5 border ${
              isDark
                ? 'border-white/15 bg-white/5 text-[#ede5dc]/80'
                : 'border-black/15 bg-black/5 text-[#3c3a35]/80'
            }`}
          >
            {currentMood.icon} {currentMood.label}
          </span>

          <span className="text-[10px] font-mono-clean uppercase tracking-wider flex items-center gap-1 opacity-70">
            {digest.isPublic ? (
              <>
                <Globe className="w-3 h-3" style={{ color: 'var(--accent)' }} />
                <span>Sanctuary</span>
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 text-[#d69677]" />
                <span>Private Vault</span>
              </>
            )}
          </span>
        </div>

        {/* Owner Edit/Delete & Share Controls */}
        <div className="flex items-center gap-2">
          {isOwner && (
            <>
              {onEdit && (
                <button
                  type="button"
                  onClick={() => onEdit(digest)}
                  className="text-[10px] font-mono-clean uppercase tracking-wider px-2.5 py-1 border border-current/25 hover:border-[#7b948a] transition cursor-pointer"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(digest.id)}
                  className="text-[10px] font-mono-clean uppercase tracking-wider px-2.5 py-1 border border-[#c95742]/40 text-[#c95742] hover:bg-[#c95742]/10 transition cursor-pointer"
                >
                  Delete
                </button>
              )}
            </>
          )}

          {!isOwner && onReport && (
            <button
              type="button"
              onClick={() => onReport(digest.id)}
              className="text-[10px] font-mono-clean uppercase tracking-wider px-2.5 py-1 border border-current/25 hover:border-[#c95742] transition cursor-pointer"
            >
              Report
            </button>
          )}

          <button
            type="button"
            onClick={handleShare}
            className="p-1.5 border border-current/15 hover:border-[#7b948a] transition relative cursor-pointer"
            title="Copy link to reflection"
          >
            <Share2 className="w-3.5 h-3.5 opacity-75" />
            {copiedLink && (
              <span
                className={`absolute -bottom-7 right-0 text-[9px] font-mono-clean uppercase px-2 py-0.5 whitespace-nowrap border ${
                  isDark
                    ? 'bg-[#1c1719] text-[#8fa99e] border-[#8fa99e]/40'
                    : 'bg-white text-[#7b948a] border-[#7b948a]/40'
                }`}
              >
                Copied
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Entry Title (Variation 6 h2: 2rem Newsreader regular) */}
      <h2 className="font-newsreader text-2xl sm:text-[2rem] font-normal leading-snug tracking-tight">
        {digest.title}
      </h2>

      {/* Primary Narrative Quote / Current Struggle */}
      {digest.reflectionBody && (
        <p
          className="font-newsreader text-[1.12rem] leading-[1.65]"
          style={{ color: 'var(--ink-muted)' }}
        >
          "{digest.reflectionBody}"
        </p>
      )}

      {/* Expanded Details Section */}
      {isExpanded && (
        <div className="space-y-5 pt-1">
          {/* 1. Why I'm Feeling Low / The Current Weight */}
          {digest.currentStruggle && (
            <div
              className={`p-4 sm:p-5 border ${
                isDark
                  ? 'bg-[#1c1719]/90 border-white/10'
                  : 'bg-white/75 border-black/10'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldAlert className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                <span className="sidebar-label mb-0">
                  Why I'm Feeling Low • Current Scenario
                </span>
              </div>
              <p className="font-newsreader text-base leading-relaxed whitespace-pre-line">
                {digest.currentStruggle}
              </p>
            </div>
          )}

          {/* 2. How I'm Coping & Advice I'm Seeking */}
          {(digest.copingMechanism || digest.adviceWanted) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {digest.copingMechanism && (
                <div
                  className={`p-4 border ${
                    isDark
                      ? 'bg-[#1c1719]/70 border-white/10'
                      : 'bg-white/65 border-black/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Anchor className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span className="sidebar-label mb-0">How I'm Coping Right Now</span>
                  </div>
                  <p className="font-newsreader text-sm sm:text-base leading-relaxed">
                    {digest.copingMechanism}
                  </p>
                </div>
              )}

              {digest.adviceWanted && (
                <div
                  className={`p-4 border ${
                    isDark
                      ? 'bg-[#1c1719]/70 border-white/10'
                      : 'bg-white/65 border-black/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span className="sidebar-label mb-0">Advice & Words I'm Asking For</span>
                  </div>
                  <p className="font-newsreader text-sm sm:text-base leading-relaxed">
                    {digest.adviceWanted}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 3. Small Steps I'm Taking */}
          {digest.stepsTaking && digest.stepsTaking.length > 0 && (
            <div
              className={`p-4 border ${
                isDark
                  ? 'bg-[#1c1719]/60 border-white/10'
                  : 'bg-white/60 border-black/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                  <span className="sidebar-label mb-0">
                    Small Gentle Steps I'm Taking To Improve
                  </span>
                </div>
                <span className="text-[10px] font-mono-clean uppercase opacity-60">
                  One step at a time
                </span>
              </div>
              <ul className="space-y-1.5">
                {digest.stepsTaking.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 font-newsreader text-sm sm:text-base py-1 border-b border-dashed last:border-b-0"
                    style={{ borderColor: 'var(--ink-faint)' }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: 'var(--accent)' }}
                    />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 4. Featured Quote */}
          {digest.featuredQuote && (
            <div
              className={`p-5 border text-center ${
                isDark
                  ? 'bg-[#1c1719]/50 border-white/10'
                  : 'bg-white/50 border-black/10'
              }`}
            >
              <Quote
                className="w-6 h-6 mx-auto mb-1.5 opacity-40"
                style={{ color: 'var(--accent)' }}
              />
              <p className="font-newsreader text-lg italic max-w-xl mx-auto">
                "{digest.featuredQuote.text}"
              </p>
              {digest.featuredQuote.author && (
                <p
                  className="text-[11px] font-mono-clean uppercase tracking-widest mt-1.5"
                  style={{ color: 'var(--accent)' }}
                >
                  — {digest.featuredQuote.author}
                </p>
              )}
            </div>
          )}

          {/* 5. Snapshots / Polaroids with corner tape pasted on the tilting origin corner */}
          {digest.snapshots && digest.snapshots.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center sm:justify-start pt-2">
              {digest.snapshots.map((snap, idx) => {
                const rotation = snap.rotationDeg ?? 0;
                // Negative rotation (tilts counter-clockwise / left) -> taped at Top-Right corner
                // Positive rotation (tilts clockwise / right) -> taped at Top-Left corner
                const tapeCorner = rotation < 0 ? 'top-right' : 'top-left';
                const tapeVariants = ['sage', 'kraft', 'parchment', 'butter', 'rose'] as const;
                const tapeVariant = tapeVariants[idx % tapeVariants.length];

                return (
                  <div
                    key={snap.id}
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="a4-polaroid-card max-w-[230px] relative group"
                  >
                    <CornerWashiTape
                      corner={tapeCorner}
                      rotationDeg={rotation}
                      variant={tapeVariant}
                    />

                    <img
                      src={snap.imageUrl}
                      alt={snap.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover mb-2"
                      loading="lazy"
                    />
                    <p className="font-handwriting text-base text-center">{snap.caption}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Handwritten Signature & Empathy Reactions */}
          <div
            className="pt-3 pb-2 flex flex-wrap items-center justify-between gap-3 border-t border-dashed"
            style={{ borderColor: 'var(--ink-faint)' }}
          >
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  { emoji: '🤍', label: 'You Matter' },
                  { emoji: '🫂', label: 'Warm Hug' },
                  { emoji: '🕯️', label: 'Holding Space' },
                  { emoji: '🌱', label: 'Strength' },
                  { emoji: '✨', label: 'Gentle Light' },
                ] as const
              ).map(({ emoji, label }) => {
                const count = digest.reactions?.[emoji] || 0;
                const hasReacted = digest.userReactions?.[currentUser?.id || ''] === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onToggleReaction(digest.id, emoji)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono-clean border transition cursor-pointer ${
                      hasReacted
                        ? 'bg-[#7b948a] text-white border-[#7b948a]'
                        : isDark
                        ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] hover:border-[#8fa99e]'
                        : 'bg-white/80 border-black/15 text-[#3c3a35] hover:border-[#7b948a]'
                    }`}
                    title={label}
                  >
                    <span>{emoji}</span>
                    <span>{count}</span>
                    <span className="hidden xl:inline text-[10px] opacity-80">{label}</span>
                  </button>
                );
              })}
            </div>

            <span
              className="font-handwriting text-xl font-semibold"
              style={{ color: 'var(--accent)' }}
            >
              {digest.authorSignature || `- ${digest.authorPenName}`}
            </span>
          </div>
        </div>
      )}

      {/* Variation 6 Comment Thread Box (.comment-thread) */}
      {digest.comments && digest.comments.length > 0 && (
        <div className="space-y-3">
          {(isExpanded ? digest.comments : digest.comments.slice(0, 1)).map((comment) => (
            <div key={comment.id} className="comment-thread">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <span className="sidebar-label mb-0">
                  {comment.authorPenName} @ {formatCommentTime(comment.createdAt)}
                </span>
                {comment.aiModeration?.tag && (
                  <span className="text-[10px] font-mono-clean uppercase tracking-wider opacity-75 flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" style={{ color: 'var(--accent)' }} />
                    <span>{comment.aiModeration.tag}</span>
                  </span>
                )}
              </div>
              <p className="font-newsreader text-base leading-relaxed">"{comment.content}"</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Cheerful Advice / Comment Form when expanded */}
      {isExpanded && (
        <form onSubmit={handleCommentSubmit} className="space-y-2 pt-1">
          <div className="relative">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder={
                currentUser
                  ? `Leave compassionate advice, kind words, or remind ${digest.authorPenName} why they matter...`
                  : 'Sign in to leave cheerful encouragement and advice...'
              }
              rows={2}
              className={`w-full p-3.5 pr-32 font-newsreader text-sm sm:text-base focus:outline-hidden transition resize-none border ${
                isDark
                  ? 'bg-[#1c1719] border-white/15 focus:border-[#8fa99e] text-[#ede5dc] placeholder-[#ede5dc]/45'
                  : 'bg-white/90 border-black/15 focus:border-[#7b948a] text-[#3c3a35] placeholder-[#3c3a35]/45'
              }`}
            />
            <button
              type="submit"
              disabled={isSubmittingComment || !commentText.trim()}
              className="absolute right-2.5 bottom-2.5 px-3.5 py-1.5 bg-[#7b948a] hover:bg-[#698278] text-white font-mono-clean uppercase tracking-wider text-[10px] flex items-center gap-1.5 transition disabled:opacity-40 cursor-pointer"
            >
              <Send className="w-3 h-3" />
              <span>{isSubmittingComment ? 'Sending...' : 'Send Support'}</span>
            </button>
          </div>

          {commentError && (
            <p className="text-xs font-mono-clean p-2.5 border border-[#c95742] text-[#c95742] bg-[#c95742]/10">
              {commentError}
            </p>
          )}
        </form>
      )}

      {/* Variation 6 Outline Action Button (.btn-outline) */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="btn-outline w-full flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
        <span>
          {isExpanded
            ? `Collapse Reflection Details (${digest.comments?.length || 0} Support Notes)`
            : `Read Full Reflection & Join Support (${digest.comments?.length || 0} Notes)`}
        </span>
      </button>
    </article>
    </div>
  );
};
