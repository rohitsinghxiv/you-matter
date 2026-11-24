import React, { useState, useEffect } from 'react';
import { JournalDigest, User, ActionStepItem, CheerfulComment } from './types';
import { getCurrentUser, logoutUser, onAuthChange, deleteAccount } from './utils/auth';
import {
  fetchJournals,
  saveJournal,
  deleteJournal,
  setReaction,
  postComment,
  reportContent,
  fetchSteps,
  saveStepProgress,
  deleteCustomStep,
  DEFAULT_ACTION_STEPS,
} from './utils/data';
import { isBackendConfigured } from './lib/supabase';
import { Navbar } from './components/Navbar';
import { DigestCard } from './components/DigestCard';
import { DigestEditorModal } from './components/DigestEditorModal';
import { StepsToTakeView } from './components/StepsToTakeView';
import { AuthModal } from './components/AuthModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { PageTurnOverlay } from './components/PageTurnOverlay';
import { SOUND_TRACKS, SoundOption } from './components/CalmMusicPlayer';
import { COUNTRY_HELPLINES, CountryHelpline, detectUserCountry } from './data/countryHelplines';
import {
  Search,
  Lock,
  Globe,
  PhoneCall,
  CheckCircle2,
  Play,
  Pause,
  SkipForward,
  SlidersHorizontal,
} from 'lucide-react';

function AppContent() {
  const { isDark } = useTheme();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [journals, setJournals] = useState<JournalDigest[]>([]);
  const [actionSteps, setActionSteps] = useState<ActionStepItem[]>(DEFAULT_ACTION_STEPS);
  const [isLoading, setIsLoading] = useState(true);
  const [notice, setNotice] = useState('');

  const flash = (msg: string) => {
    setNotice(msg);
    window.setTimeout(() => setNotice(''), 5000);
  };

  const [currentTab, setCurrentTab] = useState<'community' | 'my-vault' | 'steps'>('community');
  const [vaultFilter, setVaultFilter] = useState<'all' | 'private' | 'public'>('all');
  const [moodFilter, setMoodFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Detected / selected user country for localized crisis numbers in sidebar & bottom support strip
  const [userCountry, setUserCountry] = useState<CountryHelpline>(() => detectUserCountry());

  // Synced Audio Sanctuary state from navbar CalmMusicPlayer
  const [audioState, setAudioState] = useState<{
    isPlaying: boolean;
    selectedTrackIndex: number;
    track: SoundOption;
  }>({
    isPlaying: false,
    selectedTrackIndex: 0,
    track: SOUND_TRACKS[0],
  });

  // Modals
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingDigest, setEditingDigest] = useState<JournalDigest | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Listen to navbar audio player state broadcasts
  useEffect(() => {
    const handleAudioState = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail) {
        setAudioState({
          isPlaying: customEvent.detail.isPlaying,
          selectedTrackIndex: customEvent.detail.selectedTrackIndex,
          track: customEvent.detail.track || SOUND_TRACKS[0],
        });
      }
    };
    window.addEventListener('youmatter-audio-state', handleAudioState);
    return () => {
      window.removeEventListener('youmatter-audio-state', handleAudioState);
    };
  }, []);

  // Sync state to local storage when journals or action steps change
  // Restore session and keep it in sync (login, logout, email-confirmation links)
  useEffect(() => {
    if (!isBackendConfigured) {
      setIsLoading(false);
      return;
    }
    let active = true;
    getCurrentUser()
      .then((u) => active && setCurrentUser(u))
      .catch(() => {});
    const unsub = onAuthChange((u) => active && setCurrentUser(u));
    return () => {
      active = false;
      unsub();
    };
  }, []);

  const reloadJournals = async () => {
    try {
      setJournals(await fetchJournals());
    } catch {
      flash('Could not load the community feed. Please refresh.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload feed + steps whenever the signed-in user changes (RLS decides what is visible)
  useEffect(() => {
    if (!isBackendConfigured) return;
    reloadJournals();
    fetchSteps(currentUser?.id)
      .then(setActionSteps)
      .catch(() => setActionSteps(DEFAULT_ACTION_STEPS));
  }, [currentUser?.id]);

  const requireAuth = (): boolean => {
    if (currentUser) return true;
    setIsAuthOpen(true);
    return false;
  };

  // Toggle reaction (🤍, 🫂, 🕯️, 🌱, ✨)
  const handleToggleReaction = async (
    journalId: string,
    emoji: '🤍' | '🫂' | '🕯️' | '🌱' | '✨'
  ) => {
    if (!requireAuth() || !currentUser) return;
    const current = journals.find((j) => j.id === journalId)?.userReactions?.[currentUser.id];
    try {
      await setReaction(journalId, currentUser.id, emoji, current);
      await reloadJournals();
    } catch {
      flash('Could not save your reaction. Please try again.');
    }
  };

  // Comments are moderated and stored by the server
  const handleAddComment = async (
    journalId: string,
    text: string
  ): Promise<{ success: boolean; error?: string }> => {
    if (!requireAuth()) return { success: false, error: 'Please sign in to leave advice or cheerful words.' };
    const res = await postComment(journalId, text);
    if (!res.success || !res.comment) return { success: false, error: res.error };
    setJournals((prev) =>
      prev.map((j) => (j.id === journalId ? { ...j, comments: [...(j.comments || []), res.comment!] } : j))
    );
    return { success: true };
  };

  const handleSaveDigest = async (data: Partial<JournalDigest>) => {
    if (!requireAuth() || !currentUser) return;
    try {
      await saveJournal(currentUser.id, data);
      await reloadJournals();
      setEditingDigest(null);
      setIsEditorOpen(false);
    } catch (err: any) {
      flash(err?.message?.includes('limit') ? err.message : 'Could not save your entry. Please try again.');
    }
  };

  const handleDeleteDigest = async (id: string) => {
    if (!window.confirm('Delete this entry permanently?')) return;
    try {
      await deleteJournal(id);
      setJournals((prev) => prev.filter((j) => j.id !== id));
    } catch {
      flash('Could not delete the entry. Please try again.');
    }
  };

  const handleReport = async (journalId: string) => {
    if (!requireAuth() || !currentUser) return;
    const reason = window.prompt('Why are you reporting this post? (optional)') ?? null;
    if (reason === null) return;
    try {
      await reportContent(currentUser.id, 'journal', journalId, reason);
      flash('Thank you. Our team will review this post.');
    } catch {
      flash('Could not send your report. Please try again.');
    }
  };

  // Action Steps Handlers
  const handleToggleStep = async (stepId: string) => {
    const step = actionSteps.find((s) => s.id === stepId);
    if (!step) return;
    const updated = { ...step, completed: !step.completed };
    setActionSteps((prev) => prev.map((s) => (s.id === stepId ? updated : s)));
    try {
      await saveStepProgress(currentUser?.id, updated);
    } catch {
      setActionSteps((prev) => prev.map((s) => (s.id === stepId ? step : s)));
      flash('Could not save your progress.');
    }
  };

  const handleAddCustomStep = async (title: string, subtitle: string, detail: string) => {
    const newStep: ActionStepItem = {
      id: 'custom_' + crypto.randomUUID(),
      userId: currentUser?.id,
      phase: 'action',
      title,
      subtitle,
      detail,
      timeEstimate: '3 min',
      iconName: 'Sparkles',
      completed: false,
      isCustom: true,
    };
    setActionSteps((prev) => [newStep, ...prev]);
    try {
      await saveStepProgress(currentUser?.id, newStep);
    } catch {
      setActionSteps((prev) => prev.filter((s) => s.id !== newStep.id));
      flash('Could not save your step.');
    }
  };

  const handleDeleteStep = async (stepId: string) => {
    const prevSteps = actionSteps;
    setActionSteps((prev) => prev.filter((s) => s.id !== stepId));
    try {
      await deleteCustomStep(currentUser?.id, stepId);
    } catch {
      setActionSteps(prevSteps);
      flash('Could not delete the step.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Permanently delete your account and everything you have written? This cannot be undone.')) return;
    const res = await deleteAccount();
    if (res.success) {
      setCurrentUser(null);
      flash('Your account and data have been deleted.');
    } else {
      flash(res.error || 'Could not delete your account.');
    }
  };

  // Filter Public Journals for Sanctuary Feed
  const publicJournals = journals.filter((j) => {
    if (!j.isPublic) return false;
    if (moodFilter !== 'all' && j.mood !== moodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchBody = j.reflectionBody.toLowerCase().includes(q);
      const matchStruggle = j.currentStruggle?.toLowerCase().includes(q) || false;
      const matchAdvice = j.adviceWanted?.toLowerCase().includes(q) || false;
      const matchAuthor = j.authorPenName.toLowerCase().includes(q);
      if (!matchTitle && !matchBody && !matchStruggle && !matchAdvice && !matchAuthor) {
        return false;
      }
    }
    return true;
  });

  // Filter My Vault Journals
  const myJournals = journals.filter((j) => {
    if (!currentUser) return false;
    if (j.userId !== currentUser.id) return false;
    if (vaultFilter === 'private' && j.isPublic) return false;
    if (vaultFilter === 'public' && !j.isPublic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        j.title.toLowerCase().includes(q) ||
        j.reflectionBody.toLowerCase().includes(q) ||
        (j.currentStruggle?.toLowerCase().includes(q) ?? false)
      );
    }
    return true;
  });

  const myPrivateCount = journals.filter(
    (j) => currentUser && j.userId === currentUser.id && !j.isPublic
  ).length;
  const myPublicCount = journals.filter(
    (j) => currentUser && j.userId === currentUser.id && j.isPublic
  ).length;

  // Top 3 grounding steps for the Variation 6 Right Sidebar
  const sidebarGroundingSteps = actionSteps.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col sanctuary-dot-canvas transition-colors duration-500">
      <PageTurnOverlay />

      {/* Top Navigation (Variation 6 Header) */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenCreateModal={() => {
          if (!currentUser) {
            setIsAuthOpen(true);
          } else {
            setEditingDigest(null);
            setIsEditorOpen(true);
          }
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />

      {!isBackendConfigured && (
        <div role="alert" className="mx-auto max-w-[1440px] w-full px-6 lg:px-16 pt-3 text-xs font-mono-clean">
          Setup needed: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable accounts and the community.
        </div>
      )}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-4 py-2.5 text-xs font-mono-clean bg-[#3c3a35] text-[#f8f3f0] shadow-lg max-w-[90vw]"
        >
          {notice}
        </div>
      )}

      {/* Main Two-Column Split Container (Variation 6 .container: 1fr 380px) */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 lg:px-16 pt-4 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
        {/* ================= LEFT MAIN COLUMN (.scroll-area) ================= */}
        <div className="min-w-0">
          {/* 1. SANCTUARY FEED TAB */}
          {currentTab === 'community' && (
            <div>
              <div className="meta-tag mb-4">Section 01: The Haven</div>

              <h1 className="font-newsreader italic font-normal text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.08] mb-5">
                Your voice is heard here.
              </h1>

              <p
                className="font-newsreader text-xl sm:text-[1.35rem] leading-relaxed max-w-[650px] mb-10"
                style={{ color: 'var(--ink-muted)' }}
              >
                A safe haven where you can pour out why you are feeling low, the burdens weighing
                on you, and what advice you need. Our community is here to hold space.
              </p>

              {/* Editorial Filter & Search Bar */}
              <div
                className="mb-12 pb-5 border-b flex flex-wrap items-center justify-between gap-4"
                style={{ borderColor: 'var(--ink-faint)' }}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Reflections' },
                    { id: 'holding-on', label: '🕯️ Holding On' },
                    { id: 'heavy-hearted', label: '🌧️ Heavy-Hearted' },
                    { id: 'grieving', label: '🍂 Grieving' },
                    { id: 'overwhelmed', label: '🌪️ Overwhelmed' },
                    { id: 'seeking-light', label: '✨ Seeking Light' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMoodFilter(m.id)}
                      className={`px-3 py-1 text-[10px] font-mono-clean uppercase tracking-wider border transition cursor-pointer ${
                        moodFilter === m.id
                          ? 'bg-[#7b948a] text-white border-[#7b948a]'
                          : isDark
                          ? 'bg-transparent border-white/15 text-[#ede5dc]/75 hover:border-[#8fa99e]'
                          : 'bg-transparent border-black/15 text-[#3c3a35]/75 hover:border-[#7b948a]'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Search Box */}
                <div className="relative min-w-[230px] flex-1 sm:flex-initial">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reflections or advice..."
                    className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono-clean focus:outline-hidden border ${
                      isDark
                        ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] placeholder-[#ede5dc]/40 focus:border-[#8fa99e]'
                        : 'bg-white/80 border-black/15 text-[#3c3a35] placeholder-[#3c3a35]/45 focus:border-[#7b948a]'
                    }`}
                  />
                </div>
              </div>

              {/* Journal Entries (.entry-box) */}
              <div>
                {publicJournals.length === 0 ? (
                  <div className="sanctuary-card text-center py-14 space-y-4">
                    <span className="sidebar-label">Quiet Sanctuary</span>
                    <h3 className="font-newsreader italic text-2xl">
                      No reflections matched your filter.
                    </h3>
                    <p
                      className="font-newsreader text-base max-w-md mx-auto"
                      style={{ color: 'var(--ink-muted)' }}
                    >
                      {searchQuery
                        ? 'Try searching for a different keyword or clearing the mood filter.'
                        : 'Be the first to pour out your thoughts and let the community hold space for you.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        if (!currentUser) setIsAuthOpen(true);
                        else {
                          setEditingDigest(null);
                          setIsEditorOpen(true);
                        }
                      }}
                      className="btn-pill text-xl px-6 py-2"
                    >
                      Pour Out Thoughts
                    </button>
                  </div>
                ) : (
                  publicJournals.map((digest) => (
                    <DigestCard
                      key={digest.id}
                      digest={digest}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      onToggleReaction={handleToggleReaction}
                      onEdit={(d) => {
                        setEditingDigest(d);
                        setIsEditorOpen(true);
                      }}
                      onDelete={handleDeleteDigest}
                      onReport={handleReport}
                      onRequireAuth={() => setIsAuthOpen(true)}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* 2. MY SAFE VAULT TAB */}
          {currentTab === 'my-vault' && (
            <div>
              <div className="meta-tag mb-4">Section 02: Personal Vault</div>

              <h1 className="font-newsreader italic font-normal text-[clamp(2.5rem,5vw,4.25rem)] leading-[1.08] mb-5">
                Your private emotional sanctuary.
              </h1>

              <p
                className="font-newsreader text-xl sm:text-[1.25rem] leading-relaxed max-w-[650px] mb-10"
                style={{ color: 'var(--ink-muted)' }}
              >
                Keep your rawest thoughts safely locked in your private vault, or share them with
                the community when you feel ready for support and advice.
              </p>

              {/* Privacy Filter & Search */}
              <div
                className="mb-10 pb-5 border-b flex flex-wrap items-center justify-between gap-4"
                style={{ borderColor: 'var(--ink-faint)' }}
              >
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVaultFilter('all')}
                    className={`px-3.5 py-1.5 text-[10px] font-mono-clean uppercase tracking-wider border transition cursor-pointer ${
                      vaultFilter === 'all'
                        ? 'bg-[#7b948a] text-white border-[#7b948a]'
                        : 'border-current/20 opacity-75 hover:opacity-100'
                    }`}
                  >
                    All ({myJournals.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultFilter('private')}
                    className={`px-3.5 py-1.5 text-[10px] font-mono-clean uppercase tracking-wider border flex items-center gap-1.5 transition cursor-pointer ${
                      vaultFilter === 'private'
                        ? 'bg-[#7b948a] text-white border-[#7b948a]'
                        : 'border-current/20 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    <span>Private Vault ({myPrivateCount})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVaultFilter('public')}
                    className={`px-3.5 py-1.5 text-[10px] font-mono-clean uppercase tracking-wider border flex items-center gap-1.5 transition cursor-pointer ${
                      vaultFilter === 'public'
                        ? 'bg-[#7b948a] text-white border-[#7b948a]'
                        : 'border-current/20 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>Public Sanctuary ({myPublicCount})</span>
                  </button>
                </div>

                <div className="relative min-w-[220px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search my vault..."
                    className={`w-full pl-8 pr-3 py-1.5 text-xs font-mono-clean focus:outline-hidden border ${
                      isDark
                        ? 'bg-[#1c1719] border-white/15 text-[#ede5dc]'
                        : 'bg-white/80 border-black/15 text-[#3c3a35]'
                    }`}
                  />
                </div>
              </div>

              {!currentUser ? (
                <div className="sanctuary-card text-center py-14 space-y-4">
                  <Lock className="w-8 h-8 mx-auto" style={{ color: 'var(--accent)' }} />
                  <h3 className="font-newsreader italic text-2xl">
                    Sign in to unlock your private vault.
                  </h3>
                  <p
                    className="font-newsreader text-base max-w-md mx-auto"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    Your personal reflections and private notes are protected behind your pseudonym
                    account.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsAuthOpen(true)}
                    className="btn-pill text-xl px-7 py-2"
                  >
                    Sign In / Create Pseudonym
                  </button>
                </div>
              ) : myJournals.length === 0 ? (
                <div className="sanctuary-card text-center py-14 space-y-4">
                  <span className="sidebar-label">Empty Vault</span>
                  <h3 className="font-newsreader italic text-2xl">
                    Your personal vault is quiet.
                  </h3>
                  <p
                    className="font-newsreader text-base max-w-md mx-auto"
                    style={{ color: 'var(--ink-muted)' }}
                  >
                    Start writing your first reflection on why you are feeling low and how you are
                    coping.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDigest(null);
                      setIsEditorOpen(true);
                    }}
                    className="btn-pill text-xl px-7 py-2"
                  >
                    Write First Entry
                  </button>
                </div>
              ) : (
                <div>
                  {myJournals.map((digest) => (
                    <DigestCard
                      key={digest.id}
                      digest={digest}
                      currentUser={currentUser}
                      onAddComment={handleAddComment}
                      onToggleReaction={handleToggleReaction}
                      onEdit={(d) => {
                        setEditingDigest(d);
                        setIsEditorOpen(true);
                      }}
                      onDelete={handleDeleteDigest}
                      onReport={handleReport}
                      onRequireAuth={() => setIsAuthOpen(true)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. STEPS TO HOLD ON TAB */}
          {currentTab === 'steps' && (
            <div>
              <div className="meta-tag mb-4">Section 03: Grounding & Support</div>
              <StepsToTakeView
                steps={actionSteps}
                currentUser={currentUser}
                onToggleStep={handleToggleStep}
                onAddCustomStep={handleAddCustomStep}
                onDeleteStep={handleDeleteStep}
                onRequireAuth={() => setIsAuthOpen(true)}
              />
            </div>
          )}
        </div>

        {/* ================= RIGHT SIDEBAR (.sidebar-grid: 380px) ================= */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-8">
          {/* Card 1: Audio Sanctuary (Variation 6 .sanctuary-card) */}
          <div className="sanctuary-card">
            <span className="sidebar-label mb-3">Audio Sanctuary</span>
            <p className="font-newsreader italic text-[1.05rem] mb-1">
              ◌ {audioState.track.name}
            </p>
            <p
              className="font-mono-clean text-[10px] uppercase tracking-wider mb-4"
              style={{ color: 'var(--ink-muted)' }}
            >
              {audioState.isPlaying ? 'Now Playing' : 'Ready'} • {audioState.track.category}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('youmatter-audio-command', {
                      detail: { action: 'toggle-play' },
                    })
                  )
                }
                className="btn-outline flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3"
              >
                {audioState.isPlaying ? (
                  <>
                    <Pause className="w-3 h-3" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3" />
                    <span>Listen</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  const nextIdx = (audioState.selectedTrackIndex + 1) % SOUND_TRACKS.length;
                  window.dispatchEvent(
                    new CustomEvent('youmatter-audio-command', {
                      detail: { action: 'select-track', index: nextIdx },
                    })
                  );
                }}
                className="btn-outline py-2.5 px-3 flex items-center justify-center"
                title="Next Soundscape"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent('youmatter-audio-command', {
                      detail: { action: 'open-player' },
                    })
                  )
                }
                className="btn-outline py-2.5 px-3 flex items-center justify-center"
                title="Open Audio Sanctuary Menu in Navbar"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Grounding Steps & Crisis Helpline (Variation 6 .sanctuary-card) */}
          <div className="sanctuary-card">
            <span className="sidebar-label mb-3">Grounding Steps</span>

            <div>
              {sidebarGroundingSteps.map((step, idx) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleToggleStep(step.id)}
                  className="grounding-item w-full text-left bg-transparent border-x-0 border-t-0 cursor-pointer group"
                >
                  <span
                    className={`font-newsreader text-[0.95rem] transition ${
                      step.completed ? 'line-through opacity-55' : 'group-hover:text-[#7b948a]'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="font-mono-clean text-xs flex items-center gap-1.5 shrink-0 ml-2">
                    {step.completed ? (
                      <CheckCircle2 className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    ) : null}
                    <span style={{ color: 'var(--accent)' }}>
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={() => setCurrentTab('steps')}
                className="bg-transparent border-0 p-0 font-mono-clean text-[0.65rem] uppercase tracking-wider cursor-pointer hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                Full grounding guide & country search →
              </button>
            </div>

            {/* Crisis Helpline Section inside Card 2 */}
            <div
              className="mt-8 pt-5 border-t"
              style={{ borderColor: 'var(--ink-faint)' }}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="sidebar-label mb-0">Crisis Helpline</span>
                <select
                  value={userCountry.id}
                  onChange={(e) => {
                    const found = COUNTRY_HELPLINES.find((c) => c.id === e.target.value);
                    if (found) setUserCountry(found);
                  }}
                  aria-label="Select Country for Crisis Helpline"
                  className={`text-[10px] font-mono-clean py-0.5 px-1.5 border cursor-pointer focus:outline-hidden ${
                    isDark
                      ? 'bg-[#141213] border-white/15 text-[#ede5dc]'
                      : 'bg-[#f8f3f0] border-black/15 text-[#3c3a35]'
                  }`}
                >
                  {COUNTRY_HELPLINES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="font-mono-clean text-[1.8rem] font-medium leading-tight my-1">
                {userCountry.primaryNumber !== 'Visit Website' ? (
                  <a
                    href={`tel:${userCountry.primaryNumber.replace(/[^0-9+]/g, '')}`}
                    className="hover:underline flex items-center gap-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    <span>{userCountry.primaryNumber}</span>
                    <PhoneCall className="w-4 h-4 opacity-60" style={{ color: 'var(--accent)' }} />
                  </a>
                ) : (
                  <span>{userCountry.primaryNumber}</span>
                )}
              </div>

              <p
                className="font-newsreader text-[0.82rem] leading-snug"
                style={{ color: 'var(--ink-muted)' }}
              >
                {userCountry.primaryName} ({userCountry.country}) — 24/7 Free Support
              </p>
            </div>
          </div>
        </aside>
      </main>

      {/* Bottom Support Strip (Variation 6 .support-strip) */}
      <footer className="support-strip px-6 lg:px-16 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-mono-clean text-[0.65rem] uppercase tracking-wider text-center sm:text-left">
          © {new Date().getFullYear()} YOU MATTER SANCTUARY — YOU ARE IRREPLACEABLE
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono-clean text-[0.65rem] uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span>
              {userCountry.flag} {userCountry.country.toUpperCase()}:
            </span>
            <strong className="underline">{userCountry.primaryNumber}</strong>
          </span>
          <span>US: 988</span>
          <span>IN: 14416</span>
          <span>UK: 111</span>
          <button
            type="button"
            onClick={() => setCurrentTab('steps')}
            className="underline opacity-85 hover:opacity-100 cursor-pointer bg-transparent border-0 text-inherit font-mono-clean text-[0.65rem] uppercase"
          >
            All Countries →
          </button>
        </div>
      </footer>

      {/* Editor Modal */}
      {currentUser && (
        <DigestEditorModal
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingDigest(null);
          }}
          onSave={handleSaveDigest}
          currentUser={currentUser}
          initialData={editingDigest}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
