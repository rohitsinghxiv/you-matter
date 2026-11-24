import React, { useState } from 'react';
import { JournalDigest, User } from '../types';
import {
  X,
  Lock,
  Globe,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Compass,
  Plus,
  Trash2,
  Image as ImageIcon,
  Quote,
  Anchor,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { CornerWashiTape } from './DoodlesAndBotanicals';

interface DigestEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (digest: Partial<JournalDigest>) => void;
  currentUser: User;
  initialData?: JournalDigest | null;
}

export const DigestEditorModal: React.FC<DigestEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  currentUser,
  initialData,
}) => {
  if (!isOpen) return null;

  const { isDark } = useTheme();

  const [title, setTitle] = useState(
    initialData?.title || 'Why everything feels heavy right now'
  );
  const [mood, setMood] = useState<JournalDigest['mood']>(
    initialData?.mood || 'holding-on'
  );
  const [currentStruggle, setCurrentStruggle] = useState(
    initialData?.currentStruggle || ''
  );
  const [copingMechanism, setCopingMechanism] = useState(
    initialData?.copingMechanism || ''
  );
  const [adviceWanted, setAdviceWanted] = useState(
    initialData?.adviceWanted || ''
  );
  const [reflectionBody, setReflectionBody] = useState(
    initialData?.reflectionBody || ''
  );
  const [stepsTaking, setStepsTaking] = useState<string[]>(
    initialData?.stepsTaking || [
      'Taking slow breaths and not forcing myself to fix everything today',
      'Drinking water and resting my body',
    ]
  );
  const [newStepInput, setNewStepInput] = useState('');
  const [isPublic, setIsPublic] = useState(
    initialData ? initialData.isPublic : true
  );

  // Quote
  const [quoteText, setQuoteText] = useState(
    initialData?.featuredQuote?.text ||
      'You do not have to be good. You only have to let the soft animal of your body love what it loves.'
  );
  const [quoteAuthor, setQuoteAuthor] = useState(
    initialData?.featuredQuote?.author || 'Mary Oliver'
  );

  // Snapshots
  const [snapshots, setSnapshots] = useState(initialData?.snapshots || []);
  const [newSnapshotCaption, setNewSnapshotCaption] = useState('');
  const [newSnapshotUrl, setNewSnapshotUrl] = useState('');

  const MOOD_OPTIONS: { id: JournalDigest['mood']; label: string; icon: string }[] = [
    { id: 'holding-on', label: 'Holding On', icon: '🕯️' },
    { id: 'heavy-hearted', label: 'Heavy-Hearted', icon: '🌧️' },
    { id: 'overwhelmed', label: 'Overwhelmed', icon: '🌪️' },
    { id: 'numb', label: 'Feeling Numb', icon: '🌫️' },
    { id: 'tender', label: 'Tender & Vulnerable', icon: '🌸' },
    { id: 'seeking-light', label: 'Seeking Light', icon: '✨' },
    { id: 'grieving', label: 'Navigating Grief', icon: '🍂' },
    { id: 'hopeful', label: 'Glimmer of Hope', icon: '🌱' },
  ];

  const handleAddStep = () => {
    if (!newStepInput.trim()) return;
    setStepsTaking([...stepsTaking, newStepInput.trim()]);
    setNewStepInput('');
  };

  const handleRemoveStep = (index: number) => {
    setStepsTaking(stepsTaking.filter((_, i) => i !== index));
  };

  const handleAddSnapshot = () => {
    if (!newSnapshotUrl.trim() && !newSnapshotCaption.trim()) return;
    setSnapshots([
      ...snapshots,
      {
        id: 'snap_' + Date.now(),
        caption: newSnapshotCaption.trim() || 'A quiet moment',
        imageUrl:
          newSnapshotUrl.trim() ||
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
        rotationDeg: (Math.random() - 0.5) * 4,
      },
    ]);
    setNewSnapshotCaption('');
    setNewSnapshotUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id,
      title: title.trim() || 'Untitled Reflection',
      mood,
      currentStruggle: currentStruggle.trim(),
      copingMechanism: copingMechanism.trim(),
      adviceWanted: adviceWanted.trim(),
      reflectionBody: reflectionBody.trim(),
      stepsTaking: stepsTaking.filter((s) => s.trim().length > 0),
      isPublic,
      featuredQuote: quoteText.trim()
        ? { text: quoteText.trim(), author: quoteAuthor.trim() }
        : undefined,
      snapshots: snapshots.length > 0 ? snapshots : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div
        className={`relative rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border ${
          isDark
            ? 'bg-[#191217] border-[#3E2936] text-[#EBE0DA]'
            : 'bg-[#FCFAF7] border-[#DFD3C4] text-[#2C241F]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-5 sm:p-6 border-b ${
            isDark ? 'border-[#2C1C26]' : 'border-[#EBE1D4]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl border ${
                isDark
                  ? 'bg-[#291A23] border-[#4B2F3E] text-[#E89382]'
                  : 'bg-[#FAF2E8] border-[#E8D9C8] text-[#D96B50]'
              }`}
            >
              🕯️
            </div>
            <div>
              <h3
                className={`font-cormorant text-2xl font-bold ${
                  isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
                }`}
              >
                {initialData ? 'Edit Your Reflection' : 'Pour Out Your Heart • You Matter'}
              </h3>
              <p className={`text-xs ${isDark ? 'text-[#9E8C84]' : 'text-[#7A6C64]'}`}>
                A safe, judgment-free space to speak your truth and ask for support.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full border transition ${
              isDark
                ? 'text-[#9E8C84] hover:text-white bg-[#241720] border-[#3E2836]'
                : 'text-[#6A5A52] hover:text-black bg-[#F2ECE3] border-[#DFD3C4]'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-7 space-y-6 overflow-y-auto flex-1">
          {/* Privacy & Mood Selector */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#21161D] border-[#3B2532]'
                : 'bg-[#F6EFE6] border-[#DFD2C2]'
            }`}
          >
            {/* Privacy Toggle */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                  isDark ? 'text-[#D4C3BB]' : 'text-[#5C4C42]'
                }`}
              >
                Privacy Setting
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex-1 p-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 transition ${
                    isPublic
                      ? 'bg-[#E89382]/20 border-[#E89382] text-[#B84E39] font-bold shadow-xs'
                      : isDark
                      ? 'bg-[#1A1116] border-[#372330] text-[#9E8C84]'
                      : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#6A5A52]'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 text-[#9BBDA8]" />
                  <span>Community Sanctuary</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex-1 p-2.5 rounded-xl border text-xs flex items-center justify-center gap-2 transition ${
                    !isPublic
                      ? 'bg-[#E89382]/20 border-[#E89382] text-[#B84E39] font-bold shadow-xs'
                      : isDark
                      ? 'bg-[#1A1116] border-[#372330] text-[#9E8C84]'
                      : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#6A5A52]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-[#E4B074]" />
                  <span>Private Vault</span>
                </button>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-[#8C7A72]' : 'text-[#7D6F66]'}`}>
                {isPublic
                  ? 'Shared with community members who can leave kind advice & cheers.'
                  : 'Encrypted and locked in your personal vault only.'}
              </p>
            </div>

            {/* Mood selector */}
            <div className="space-y-1.5">
              <label
                className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                  isDark ? 'text-[#D4C3BB]' : 'text-[#5C4C42]'
                }`}
              >
                Current Emotional State
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value as any)}
                className={`w-full rounded-xl p-2.5 text-xs focus:outline-hidden border ${
                  isDark
                    ? 'bg-[#181015] border-[#3D2836] text-[#EDE2DC] focus:border-[#E89382]'
                    : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#2C241F] focus:border-[#E07A5F]'
                }`}
              >
                {MOOD_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id} className={isDark ? 'bg-[#1C1218]' : 'bg-white'}>
                    {m.icon} {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                isDark ? 'text-[#D4C3BB]' : 'text-[#5C4C42]'
              }`}
            >
              Reflection Headline
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Why everything feels heavy tonight: Searching for a reason to stay patient"
              className={`w-full rounded-2xl p-3 text-sm focus:outline-hidden font-medium border ${
                isDark
                  ? 'bg-[#1F141A] border-[#3E2937] focus:border-[#E89382] text-[#FFF4ED]'
                  : 'bg-[#FFFFFF] border-[#DDD0C0] focus:border-[#E07A5F] text-[#241D18]'
              }`}
              required
            />
          </div>

          {/* 1. What scenario / why feeling low */}
          <div
            className={`space-y-1.5 p-4 sm:p-5 rounded-2xl border ${
              isDark
                ? 'bg-[#24171E] border-[#482837]'
                : 'bg-[#FDF4F2] border-[#F5C7BD]'
            }`}
          >
            <label
              className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                isDark ? 'text-[#F0A898]' : 'text-[#C44E38]'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-[#E89382]" />
              <span>Why are you feeling low? What current scenario is weighing on you?</span>
            </label>
            <textarea
              value={currentStruggle}
              onChange={(e) => setCurrentStruggle(e.target.value)}
              rows={3}
              placeholder="Describe the burden, loneliness, burnout, grief, or situation that is making you feel low or exhausted..."
              className={`w-full rounded-xl p-3 text-xs sm:text-sm placeholder-[#7F6D65] focus:outline-hidden resize-none border ${
                isDark
                  ? 'bg-[#180F15] border-[#3E2431] focus:border-[#E89382] text-[#E7D6CE]'
                  : 'bg-[#FFFFFF] border-[#E8BFB5] focus:border-[#E07A5F] text-[#2C241F]'
              }`}
            />
          </div>

          {/* 2. How are you coping right now */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                isDark ? 'text-[#A8D4BC]' : 'text-[#2D734B]'
              }`}
            >
              <Anchor className="w-3.5 h-3.5 text-[#9BBDA8]" />
              <span>How are you coping with it right now?</span>
            </label>
            <textarea
              value={copingMechanism}
              onChange={(e) => setCopingMechanism(e.target.value)}
              rows={2}
              placeholder="e.g. Listening to rain sounds, wrapping in a blanket, taking a slow walk, drinking tea..."
              className={`w-full rounded-xl p-3 text-xs sm:text-sm placeholder-[#7F6D65] focus:outline-hidden resize-none border ${
                isDark
                  ? 'bg-[#1C141A] border-[#3A2632] focus:border-[#9BBDA8] text-[#E2D2CA]'
                  : 'bg-[#FFFFFF] border-[#CDE5D5] focus:border-[#2D734B] text-[#2C241F]'
              }`}
            />
          </div>

          {/* 3. Advice and Cheering sought from community */}
          <div
            className={`space-y-1.5 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#251A22] border-[#4B3041]'
                : 'bg-[#FEF8ED] border-[#F5DCAC]'
            }`}
          >
            <label
              className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                isDark ? 'text-[#F2C4A2]' : 'text-[#96631E]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#E4B074]" />
              <span>What advice, support, or cheering are you asking for from the community?</span>
            </label>
            <textarea
              value={adviceWanted}
              onChange={(e) => setAdviceWanted(e.target.value)}
              rows={2}
              placeholder="e.g. How did you get through feeling like a failure? I need practical advice and reminders that I still matter..."
              className={`w-full rounded-xl p-3 text-xs sm:text-sm placeholder-[#7F6D65] focus:outline-hidden resize-none font-medium border ${
                isDark
                  ? 'bg-[#191116] border-[#3E2634] focus:border-[#E4B074] text-[#E7D6CE]'
                  : 'bg-[#FFFFFF] border-[#EAD09D] focus:border-[#D67C63] text-[#2C241F]'
              }`}
            />
          </div>

          {/* 4. Small steps taking to improve */}
          <div
            className={`space-y-2 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#1E151B] border-[#372430]'
                : 'bg-[#F7F1E9] border-[#DFD3C4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                  isDark ? 'text-[#D4C4BC]' : 'text-[#5C4D44]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#E89382]" />
                <span>Small Gentle Steps You Are Taking To Improve</span>
              </label>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newStepInput}
                onChange={(e) => setNewStepInput(e.target.value)}
                placeholder="e.g. Drink a glass of water, step outside for 5 minutes..."
                className={`flex-1 rounded-xl px-3 py-2 text-xs focus:outline-hidden border ${
                  isDark
                    ? 'bg-[#180F14] border-[#382330] text-[#EDE2DC]'
                    : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#2C241F]'
                }`}
              />
              <button
                type="button"
                onClick={handleAddStep}
                className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1 border transition ${
                  isDark
                    ? 'bg-[#2B1B24] hover:bg-[#3D2734] border-[#482D3D] text-[#E89382]'
                    : 'bg-[#FFFFFF] hover:bg-[#EFE8DD] border-[#DDD0C0] text-[#C95742]'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>

            {stepsTaking.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {stepsTaking.map((step, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2 px-3 rounded-xl text-xs border ${
                      isDark
                        ? 'bg-[#261A22] border-[#3E2736] text-[#E2D2CA]'
                        : 'bg-[#FFFFFF] border-[#E2D7CB] text-[#3D322B]'
                    }`}
                  >
                    <span>• {step}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStep(idx)}
                      className="text-[#9E8C84] hover:text-[#F39CA5] p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 5. Fuller narrative / Reflections */}
          <div className="space-y-1.5">
            <label
              className={`block text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                isDark ? 'text-[#D4C3BB]' : 'text-[#5C4C42]'
              }`}
            >
              Deeper Reflections & Personal Story
            </label>
            <textarea
              value={reflectionBody}
              onChange={(e) => setReflectionBody(e.target.value)}
              rows={4}
              placeholder="Pour out the full stream of thoughts without filtering yourself..."
              className={`w-full rounded-2xl p-3.5 text-xs sm:text-sm focus:outline-hidden font-newsreader italic resize-none border ${
                isDark
                  ? 'bg-[#1C141A] border-[#3B2633] focus:border-[#E89382] text-[#EDE2DC] placeholder-[#7F6D65]'
                  : 'bg-[#FFFFFF] border-[#DDD0C0] focus:border-[#E07A5F] text-[#2C241F] placeholder-[#9E9086]'
              }`}
            />
          </div>

          {/* 6. Quote / Comfort Anchor */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#20151C] border-[#392431]'
                : 'bg-[#FAF4ED] border-[#EBDCCB]'
            }`}
          >
            <div
              className={`sm:col-span-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                isDark ? 'text-[#E89382]' : 'text-[#C95742]'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>An Anchor Quote or Thought Bringing a Sliver of Light</span>
            </div>
            <input
              type="text"
              value={quoteText}
              onChange={(e) => setQuoteText(e.target.value)}
              placeholder="Quote text..."
              className={`sm:col-span-2 rounded-xl p-2.5 text-xs focus:outline-hidden italic border ${
                isDark
                  ? 'bg-[#180F14] border-[#382330] text-[#EDE2DC]'
                  : 'bg-[#FFFFFF] border-[#DFD3C4] text-[#2C241F]'
              }`}
            />
            <input
              type="text"
              value={quoteAuthor}
              onChange={(e) => setQuoteAuthor(e.target.value)}
              placeholder="Author or source (e.g. Mary Oliver, A Friend)"
              className={`sm:col-span-2 rounded-xl p-2.5 text-xs focus:outline-hidden border ${
                isDark
                  ? 'bg-[#180F14] border-[#382330] text-[#EDE2DC]'
                  : 'bg-[#FFFFFF] border-[#DFD3C4] text-[#2C241F]'
              }`}
            />
          </div>

          {/* 7. Snapshots / Photos */}
          <div
            className={`space-y-3 p-4 rounded-2xl border ${
              isDark
                ? 'bg-[#1F141A] border-[#382330]'
                : 'bg-[#F7F2EA] border-[#DFD3C4]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                  isDark ? 'text-[#D4C3BB]' : 'text-[#5C4C42]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-[#E89382]" />
                <span>Calming Snapshot or Desk Photo ({snapshots.length})</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                value={newSnapshotCaption}
                onChange={(e) => setNewSnapshotCaption(e.target.value)}
                placeholder="Caption (e.g. Candle on my desk)"
                className={`sm:col-span-5 px-3 py-2 text-xs rounded-xl border ${
                  isDark
                    ? 'bg-[#180F14] border-[#382330] text-[#EDE2DC]'
                    : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#2C241F]'
                }`}
              />
              <input
                type="text"
                value={newSnapshotUrl}
                onChange={(e) => setNewSnapshotUrl(e.target.value)}
                placeholder="Photo URL (or upload below)"
                className={`sm:col-span-4 px-3 py-2 text-xs rounded-xl border ${
                  isDark
                    ? 'bg-[#180F14] border-[#382330] text-[#EDE2DC]'
                    : 'bg-[#FFFFFF] border-[#DDD0C0] text-[#2C241F]'
                }`}
              />
              <label
                className={`sm:col-span-2 px-2 py-2 text-xs rounded-xl cursor-pointer flex items-center justify-center transition border ${
                  isDark
                    ? 'bg-[#291A23] hover:bg-[#382431] border-[#482D3D] text-[#E89382]'
                    : 'bg-[#FFFFFF] hover:bg-[#EFE8DC] border-[#DDD0C0] text-[#C95742]'
                }`}
              >
                <span>Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          setNewSnapshotUrl(reader.result);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              <button
                type="button"
                onClick={handleAddSnapshot}
                className="sm:col-span-1 btn-youmatter-primary rounded-xl flex items-center justify-center p-2 font-semibold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {snapshots.length > 0 && (
              <div className="flex flex-wrap gap-3 pt-3">
                {snapshots.map((item, idx) => {
                  const rotation = item.rotationDeg ?? 0;
                  const corner = rotation < 0 ? 'top-right' : 'top-left';
                  return (
                    <div
                      key={item.id}
                      className={`relative p-2 rounded-xl border flex items-center gap-2 overflow-visible ${
                        isDark
                          ? 'bg-[#261A22] border-[#3E2736] text-[#D8C7BF]'
                          : 'bg-[#FFFFFF] border-[#E0D5C7] text-[#3D322B]'
                      }`}
                    >
                      <CornerWashiTape
                        corner={corner}
                        rotationDeg={rotation}
                        className="!w-8 !h-2.5 scale-90"
                      />
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg shrink-0"
                      />
                      <div className="text-xs max-w-[130px] truncate font-medium">
                        {item.caption}
                      </div>
                      <button
                        type="button"
                        onClick={() => setSnapshots(snapshots.filter((_, i) => i !== idx))}
                        className="text-[#9E8C84] hover:text-[#F39CA5] p-1 ml-auto"
                        title="Remove snapshot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div
            className={`pt-3 border-t flex items-center justify-end gap-3 ${
              isDark ? 'border-[#2A1C25]' : 'border-[#EAE0D3]'
            }`}
          >
            <button
              type="button"
              onClick={onClose}
              className={`px-5 py-2.5 rounded-full text-xs font-medium border transition ${
                isDark
                  ? 'bg-[#241720] hover:bg-[#31202B] text-[#D4C3BB] border-[#3D2735]'
                  : 'bg-[#F2ECE3] hover:bg-[#EAE2D7] text-[#4A3D36] border-[#DDD0C0]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 btn-youmatter-primary text-xs flex items-center gap-2 shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{initialData ? 'Save Changes' : 'Publish Reflection & Seek Advice'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
