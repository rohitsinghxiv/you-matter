import React, { useState, useEffect } from 'react';
import { ActionStepItem, User } from '../types';
import {
  Wind,
  Eye,
  Droplets,
  PenTool,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Sparkles,
  PhoneCall,
  Compass,
  Anchor,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

import { CountryServicesSearch } from './CountryServicesSearch';

interface StepsToTakeViewProps {
  steps: ActionStepItem[];
  currentUser: User | null;
  onToggleStep: (stepId: string) => void;
  onAddCustomStep: (title: string, subtitle: string, detail: string) => void;
  onDeleteStep: (stepId: string) => void;
  onRequireAuth: () => void;
}

export const StepsToTakeView: React.FC<StepsToTakeViewProps> = ({
  steps,
  currentUser,
  onToggleStep,
  onAddCustomStep,
  onDeleteStep,
  onRequireAuth,
}) => {
  const { isDark } = useTheme();

  // 1. Interactive 4-7-8 Breathing Pacer State
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [breathCountdown, setBreathCountdown] = useState(4);
  const [breathCyclesCompleted, setBreathCyclesCompleted] = useState(0);

  // 2. Interactive 5-4-3-2-1 Grounding State
  const [groundingIndex, setGroundingIndex] = useState(0);
  const [groundingInputs, setGroundingInputs] = useState<Record<number, string[]>>({
    0: ['', '', '', '', ''], // 5 things you see
    1: ['', '', '', ''],     // 4 things you touch
    2: ['', '', ''],         // 3 things you hear
    3: ['', ''],             // 2 things you smell
    4: [''],                 // 1 truth about yourself
  });

  // Custom step modal
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDetail, setNewDetail] = useState('');

  // 4-7-8 Breathing timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCountdown((prev) => {
          if (prev > 1) return prev - 1;

          // Transition phases
          if (breathPhase === 'Inhale') {
            setBreathPhase('Hold');
            return 7;
          } else if (breathPhase === 'Hold') {
            setBreathPhase('Exhale');
            return 8;
          } else {
            setBreathPhase('Inhale');
            setBreathCyclesCompleted((c) => c + 1);
            return 4;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase]);

  const GROUNDING_STEPS = [
    {
      count: 5,
      title: '5 Things You Can See',
      description: 'Look around your room right now. Notice 5 distinct objects, patterns, or colors.',
      placeholder: 'e.g. Lamp glow, wood grain, curtain fold, shadow, coffee mug...',
    },
    {
      count: 4,
      title: '4 Things You Can Touch',
      description: 'Physically feel the textures around you. Notice physical sensation in your body.',
      placeholder: 'e.g. Cold tabletop, soft blanket, feet on the floor, phone metal...',
    },
    {
      count: 3,
      title: '3 Things You Can Hear',
      description: 'Listen intently to distant sounds or the quiet hum of your room.',
      placeholder: 'e.g. Distant traffic, clock ticking, wind outside, your own breath...',
    },
    {
      count: 2,
      title: '2 Things You Can Smell',
      description: 'Notice scents in the air or breathe into your sleeve/tea.',
      placeholder: 'e.g. Chamomile tea, fresh air, candle wax, blanket...',
    },
    {
      count: 1,
      title: '1 Truth: You Matter & You Are Safe',
      description: 'Name 1 undeniable truth about your resilience or someone who cares.',
      placeholder: 'e.g. I am still here. My heart is beating. I do not have to give up tonight...',
    },
  ];

  const handleGroundingInputChange = (stepIdx: number, itemIdx: number, val: string) => {
    setGroundingInputs((prev) => {
      const currentArr = [...(prev[stepIdx] || [])];
      currentArr[itemIdx] = val;
      return { ...prev, [stepIdx]: currentArr };
    });
  };

  const completedCount = steps.filter((s) => s.completed).length;

  const handleCreateStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCustomStep(newTitle.trim(), newSubtitle.trim() || 'Personal step', newDetail.trim());
    setNewTitle('');
    setNewSubtitle('');
    setNewDetail('');
    setIsAddingStep(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Header Banner */}
      <div
        className={`a4-sheet-card relative p-6 sm:p-9 space-y-4 ${
          isDark
            ? 'bg-[#1A1218] border-[#3A2633] text-[#EDE3DE]'
            : 'bg-[#FFFFFF] border-[#E8DDD0] text-[#2C241E]'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                isDark ? 'text-[#E89382]' : 'text-[#C95742]'
              }`}
            >
              <Anchor className="w-4 h-4" />
              <span>Interactive Calming Roadmap</span>
            </div>
            <h1
              className={`font-cormorant text-3xl sm:text-4xl font-bold tracking-tight ${
                isDark ? 'text-[#FFF5EE]' : 'text-[#221B18]'
              }`}
            >
              Steps to Hold On & Breathe
            </h1>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-[#C8B8B0]' : 'text-[#5A4D45]'}`}>
              When everything feels suffocating or heavy, do not try to fix your whole life at once.
              Use these interactive tools and micro-steps to survive this exact hour with gentleness.
            </p>
          </div>

          {/* Quick Helpline Badge */}
          <div
            className={`p-4 rounded-2xl space-y-2 text-xs border ${
              isDark
                ? 'bg-[#261821] border-[#482837] text-[#E5D5CD]'
                : 'bg-[#FDF3F0] border-[#F4C5BA] text-[#4A322C]'
            }`}
          >
            <span
              className={`font-semibold flex items-center gap-1.5 font-mono-clean ${
                isDark ? 'text-[#F5A898]' : 'text-[#B8422E]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>24/7 Free Confidential Support</span>
            </span>
            <div className={`text-[11px] space-y-1 ${isDark ? 'text-[#C4B2A8]' : 'text-[#645049]'}`}>
              <div>
                <strong className={isDark ? 'text-white' : 'text-[#201815]'}>Call/Text 988</strong>{' '}
                (Suicide & Crisis Lifeline)
              </div>
              <div>
                <strong className={isDark ? 'text-white' : 'text-[#201815]'}>Text HOME to 741741</strong>{' '}
                (Crisis Text Line)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Interactive 4-7-8 Breathing Pacer */}
      <div
        className={`a4-sheet-card p-6 sm:p-8 space-y-6 text-center ${
          isDark
            ? 'bg-[#1C141B] border-[#3B2533]'
            : 'bg-[#FFFFFF] border-[#E8DDD0]'
        }`}
      >
        <div className="flex flex-col items-center max-w-lg mx-auto space-y-1">
          <span
            className={`text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
              isDark ? 'text-[#A8D4BC]' : 'text-[#2E7A4C]'
            }`}
          >
            <Wind className="w-4 h-4" />
            <span>Interactive 4-7-8 Somatic Breathing Pacer</span>
          </span>
          <h2
            className={`font-cormorant text-2xl font-bold ${
              isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
            }`}
          >
            Downregulate Your Nervous System
          </h2>
          <p className={`text-xs ${isDark ? 'text-[#B5A49D]' : 'text-[#6A5D55]'}`}>
            Follow the expanding circle. Inhale (4s) → Hold gently (7s) → Exhale slowly (8s).
          </p>
        </div>

        {/* Dynamic Animated Circle */}
        <div className="flex flex-col items-center justify-center py-6">
          <div
            className={`relative flex items-center justify-center rounded-full transition-all duration-1000 select-none ${
              breathPhase === 'Inhale'
                ? 'w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tr from-[#E89382]/30 to-[#9BBDA8]/40 border-4 border-[#9BBDA8] scale-110 shadow-[0_0_40px_rgba(155,189,168,0.35)]'
                : breathPhase === 'Hold'
                ? 'w-48 h-48 sm:w-56 sm:h-56 bg-gradient-to-tr from-[#E4B074]/30 to-[#E89382]/40 border-4 border-[#E4B074] scale-110 shadow-[0_0_40px_rgba(228,176,116,0.35)]'
                : 'w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-tr from-[#312028] to-[#251720] border-4 border-[#E89382] scale-95 shadow-[0_0_20px_rgba(232,147,130,0.2)]'
            }`}
          >
            <div className="flex flex-col items-center text-white">
              <span className="text-sm font-mono-clean uppercase tracking-widest text-[#FCD2C7]">
                {isBreathingActive ? breathPhase : 'Ready'}
              </span>
              <span className="font-cormorant text-4xl sm:text-5xl font-bold text-white drop-shadow-md">
                {isBreathingActive ? breathCountdown : '4-7-8'}
              </span>
              <span className="text-[10px] text-[#CBB9B1]">
                {isBreathingActive
                  ? `${breathCyclesCompleted} cycles finished`
                  : 'Press start below'}
              </span>
            </div>
          </div>

          {/* Controller Buttons */}
          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-6 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition shadow-md ${
                isBreathingActive
                  ? isDark
                    ? 'bg-[#3E232F] text-[#F9C3B5] border border-[#E89382]'
                    : 'bg-[#FDF0EC] text-[#B84833] border border-[#E89382]'
                  : 'btn-youmatter-primary'
              }`}
            >
              {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isBreathingActive ? 'Pause Pacer' : 'Begin Breathing Cycle'}</span>
            </button>

            {breathCyclesCompleted > 0 && (
              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase('Inhale');
                  setBreathCountdown(4);
                  setBreathCyclesCompleted(0);
                }}
                className={`p-2.5 rounded-full border transition ${
                  isDark
                    ? 'bg-[#261A22] border-[#3E2736] text-[#A6948C] hover:text-white'
                    : 'bg-[#F4EDE4] border-[#DDD1C3] text-[#6A5A52] hover:text-black'
                }`}
                title="Reset counter"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Interactive 5-4-3-2-1 Somatic Grounding Tool */}
      <div
        className={`a4-sheet-card p-6 sm:p-8 space-y-6 ${
          isDark
            ? 'bg-[#191217] border-[#34222D]'
            : 'bg-[#FFFFFF] border-[#E8DDD0]'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${
            isDark ? 'border-[#2C1C26]' : 'border-[#EAE1D5]'
          }`}
        >
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-wider font-mono-clean flex items-center gap-1.5 ${
                isDark ? 'text-[#F2C4A2]' : 'text-[#A06425]'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>Interactive Grounding Anchor</span>
            </span>
            <h3
              className={`font-cormorant text-2xl font-bold ${
                isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
              }`}
            >
              5-4-3-2-1 Sensory Grounding Tool
            </h3>
          </div>
          <span className={`text-xs ${isDark ? 'text-[#A89890]' : 'text-[#7D6E66]'}`}>
            Step {groundingIndex + 1} of 5
          </span>
        </div>

        {/* Step Tabs */}
        <div className="flex flex-wrap gap-2">
          {GROUNDING_STEPS.map((g, idx) => (
            <button
              key={idx}
              onClick={() => setGroundingIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                groundingIndex === idx
                  ? isDark
                    ? 'bg-[#E89382]/20 border-[#E89382] text-[#F9C3B5]'
                    : 'bg-[#FDF0EC] border-[#E89382] text-[#B84E39] font-bold shadow-xs'
                  : isDark
                  ? 'bg-[#20151C] border-[#372430] text-[#9E8C84] hover:bg-[#2A1C26]'
                  : 'bg-[#FAF5EE] border-[#E5DCD2] text-[#6A5C54] hover:bg-[#F2ECE3]'
              }`}
            >
              {g.count} • {g.title.split(' ')[1] || g.title}
            </button>
          ))}
        </div>

        {/* Active Grounding Card */}
        <div
          className={`rounded-2xl p-5 sm:p-6 space-y-4 border ${
            isDark
              ? 'bg-[#22161E] border-[#442A39]'
              : 'bg-[#FAF4ED] border-[#EBDCCB]'
          }`}
        >
          <div>
            <h4
              className={`font-cormorant text-xl font-bold ${
                isDark ? 'text-[#FFF5EE]' : 'text-[#28201C]'
              }`}
            >
              {GROUNDING_STEPS[groundingIndex].title}
            </h4>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-[#C8B8B0]' : 'text-[#5C4D44]'}`}>
              {GROUNDING_STEPS[groundingIndex].description}
            </p>
          </div>

          <div className="space-y-2">
            {groundingInputs[groundingIndex]?.map((val, itemIdx) => (
              <div key={itemIdx} className="flex items-center gap-2">
                <span className="text-xs font-mono-clean text-[#E89382] w-5">
                  #{itemIdx + 1}
                </span>
                <input
                  type="text"
                  value={val}
                  onChange={(e) =>
                    handleGroundingInputChange(groundingIndex, itemIdx, e.target.value)
                  }
                  placeholder={GROUNDING_STEPS[groundingIndex].placeholder}
                  className={`flex-1 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-hidden transition border ${
                    isDark
                      ? 'bg-[#170E13] border-[#3A2532] text-[#EDE2DC] focus:border-[#E89382]'
                      : 'bg-[#FFFFFF] border-[#DDD1C3] text-[#2C231E] focus:border-[#E07A5F]'
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              disabled={groundingIndex === 0}
              onClick={() => setGroundingIndex((i) => Math.max(0, i - 1))}
              className={`px-4 py-1.5 rounded-full text-xs border disabled:opacity-30 transition ${
                isDark
                  ? 'bg-[#2B1B24] border-[#442A39] text-[#CBB8B0]'
                  : 'bg-[#F2ECE3] border-[#DFD3C4] text-[#4A3D35]'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() =>
                setGroundingIndex((i) => Math.min(GROUNDING_STEPS.length - 1, i + 1))
              }
              className="px-4 py-1.5 btn-youmatter-primary text-xs"
            >
              {groundingIndex === 4 ? 'Grounding Complete ✨' : 'Next Sense →'}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Clickable Steps Checklist */}
      <div
        className={`a4-sheet-card p-6 sm:p-8 space-y-6 ${
          isDark
            ? 'bg-[#191217] border-[#34222D]'
            : 'bg-[#FFFFFF] border-[#E8DDD0]'
        }`}
      >
        <div
          className={`flex flex-wrap items-center justify-between gap-4 pb-4 border-b ${
            isDark ? 'border-[#2C1C26]' : 'border-[#EAE1D5]'
          }`}
        >
          <div>
            <div
              className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider font-mono-clean ${
                isDark ? 'text-[#A8D4BC]' : 'text-[#2E7A4C]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Clickable Recovery Steps ({completedCount}/{steps.length} Complete)</span>
            </div>
            <h3
              className={`font-cormorant text-2xl font-bold ${
                isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
              }`}
            >
              Survive the Next Hour: Low-Energy Action List
            </h3>
          </div>

          <button
            onClick={() => setIsAddingStep(true)}
            className={`px-3.5 py-1.5 rounded-full text-xs flex items-center gap-1.5 border transition ${
              isDark
                ? 'bg-[#251821] hover:bg-[#34212D] border-[#442A39] text-[#E89382]'
                : 'bg-[#FAF4ED] hover:bg-[#F2E8DC] border-[#DFD3C4] text-[#C95742]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Step</span>
          </button>
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => {
            return (
              <div
                key={step.id}
                onClick={() => onToggleStep(step.id)}
                className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex items-start gap-3.5 select-none ${
                  step.completed
                    ? isDark
                      ? 'bg-[#181C19] border-[#2E4837] opacity-80'
                      : 'bg-[#F4F9F5] border-[#B9DEC3] opacity-80'
                    : isDark
                    ? 'bg-[#20151C] border-[#382431] hover:border-[#E89382]/50 hover:bg-[#251821]'
                    : 'bg-[#FAF6F0] border-[#E8DFD4] hover:border-[#DF846E] hover:bg-[#FFFDF9]'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 shrink-0 text-[#9BBDA8]"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStep(step.id);
                  }}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#9BBDA8]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#634E5B] hover:text-[#E89382]" />
                  )}
                </button>

                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4
                      className={`text-sm font-semibold ${
                        step.completed
                          ? 'line-through text-[#8E9E94]'
                          : isDark
                          ? 'text-[#FAF4F0]'
                          : 'text-[#28201C]'
                      }`}
                    >
                      {step.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full border font-mono-clean shrink-0 ${
                        isDark
                          ? 'text-[#A6948C] bg-[#160E13] border-white/5'
                          : 'text-[#6D5E56] bg-[#F2ECE3] border-black/5'
                      }`}
                    >
                      {step.timeEstimate}
                    </span>
                  </div>

                  <p className={`text-xs ${isDark ? 'text-[#C4B2A8]' : 'text-[#64564E]'}`}>
                    {step.subtitle}
                  </p>

                  <p className={`text-[11px] leading-relaxed pt-1 ${isDark ? 'text-[#8C7A72]' : 'text-[#8A7970]'}`}>
                    {step.detail}
                  </p>

                  {step.isCustom && (
                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStep(step.id);
                        }}
                        className="text-[10px] text-[#F39CA5] hover:underline flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Searchable Country-Wise Mental Health & Crisis Support Directory */}
      <CountryServicesSearch />

      {/* Add Custom Step Modal */}
      {isAddingStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div
            className={`rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border ${
              isDark
                ? 'bg-[#1C141A] border-[#3E2937] text-[#EDE2DC]'
                : 'bg-[#FCFAF7] border-[#DFD3C4] text-[#2C241F]'
            }`}
          >
            <h3
              className={`font-cormorant text-2xl font-bold ${
                isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
              }`}
            >
              Add a Personal Calming Step
            </h3>
            <form onSubmit={handleCreateStepSubmit} className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Step title (e.g. Call my sister, sit in the garden)"
                className={`w-full rounded-xl p-3 text-xs border ${
                  isDark
                    ? 'bg-[#160E13] border-[#382330] text-white'
                    : 'bg-white border-[#DDD1C3] text-[#2C241F]'
                }`}
                required
              />
              <input
                type="text"
                value={newSubtitle}
                onChange={(e) => setNewSubtitle(e.target.value)}
                placeholder="Brief reason or intention"
                className={`w-full rounded-xl p-3 text-xs border ${
                  isDark
                    ? 'bg-[#160E13] border-[#382330] text-white'
                    : 'bg-white border-[#DDD1C3] text-[#2C241F]'
                }`}
              />
              <textarea
                value={newDetail}
                onChange={(e) => setNewDetail(e.target.value)}
                rows={2}
                placeholder="Helpful details or instructions to yourself..."
                className={`w-full rounded-xl p-3 text-xs resize-none border ${
                  isDark
                    ? 'bg-[#160E13] border-[#382330] text-white'
                    : 'bg-white border-[#DDD1C3] text-[#2C241F]'
                }`}
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingStep(false)}
                  className={`px-4 py-2 text-xs rounded-full border ${
                    isDark
                      ? 'bg-[#251821] text-[#C4B2A8] border-[#3A2633]'
                      : 'bg-[#F2ECE3] text-[#4A3D36] border-[#DDD0C0]'
                  }`}
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 btn-youmatter-primary text-xs">
                  Save Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
