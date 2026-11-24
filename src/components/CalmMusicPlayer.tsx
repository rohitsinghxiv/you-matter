import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Headphones,
  CloudRain,
  Flame,
  Sparkles,
  X,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export interface SoundOption {
  id: string;
  name: string;
  category: 'Spotify Stream' | 'Calming Generator';
  type: 'synth' | 'spotify';
  icon: any;
  spotifyEmbedUrl?: string;
  synthType?: 'rain' | 'pad' | 'fire' | 'theta';
  description: string;
}

export const SOUND_TRACKS: SoundOption[] = [
  {
    id: 'spotify-peaceful-piano',
    name: 'Peaceful Piano Sanctuary',
    category: 'Spotify Stream',
    type: 'spotify',
    icon: Music,
    spotifyEmbedUrl:
      'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    description: 'Acoustic piano melodies designed to lower heart rate and reduce stress.',
  },
  {
    id: 'spotify-lofi-beats',
    name: 'Lo-Fi Midnight Healing',
    category: 'Spotify Stream',
    type: 'spotify',
    icon: Headphones,
    spotifyEmbedUrl:
      'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    description: 'Slow-tempo soothing rhythm beats with warm vinyl crackle.',
  },
  {
    id: 'spotify-deep-focus',
    name: 'Deep Ambient Serenity',
    category: 'Spotify Stream',
    type: 'spotify',
    icon: Sparkles,
    spotifyEmbedUrl:
      'https://open.spotify.com/embed/playlist/37i9dQZF1DX3Ogo9pFvBkY?utm_source=generator&theme=0',
    description: 'Gentle, floating soundscapes for meditation and grounding.',
  },
  {
    id: 'synth-rain',
    name: 'Nocturnal Gentle Rain',
    category: 'Calming Generator',
    type: 'synth',
    synthType: 'rain',
    icon: CloudRain,
    description: 'Pink noise tailored to mimic calming rain against a window.',
  },
  {
    id: 'synth-pad',
    name: 'Warm Theta Drone',
    category: 'Calming Generator',
    type: 'synth',
    synthType: 'pad',
    icon: Sparkles,
    description: 'Harmonic sine wave oscillator tuned to grounding somatic frequencies.',
  },
  {
    id: 'synth-fire',
    name: 'Cozy Hearth & Embers',
    category: 'Calming Generator',
    type: 'synth',
    synthType: 'fire',
    icon: Flame,
    description: 'Soft, irregular crackling ember simulation for deep reassurance.',
  },
];

export const CalmMusicPlayer: React.FC = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState<number>(0.65);
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedTrack = SOUND_TRACKS[selectedTrackIndex];

  // Web Audio Synth references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const synthNodesRef = useRef<AudioNode[]>([]);

  // Broadcast state changes so the Variation 6 Sidebar Audio Sanctuary card stays in sync
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('youmatter-audio-state', {
        detail: {
          isPlaying,
          isMuted,
          volume,
          selectedTrackIndex,
          track: SOUND_TRACKS[selectedTrackIndex],
        },
      })
    );
  }, [isPlaying, isMuted, volume, selectedTrackIndex]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Initialize and handle Web Audio synthesis for ambient soundscapes
  const startSynth = (type: 'rain' | 'pad' | 'fire' | 'theta') => {
    stopSynth();

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : volume * 0.4, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      if (type === 'rain') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0,
          b1 = 0,
          b2 = 0,
          b3 = 0,
          b4 = 0,
          b5 = 0,
          b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();

        synthNodesRef.current = [whiteNoise, filter];
      } else if (type === 'pad' || type === 'theta') {
        const freqs = [108, 162, 216, 324];
        const oscs: OscillatorNode[] = [];

        freqs.forEach((f) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f + (Math.random() * 0.5 - 0.25), ctx.currentTime);

          const lfo = ctx.createOscillator();
          lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.1, ctx.currentTime);
          const lfoGain = ctx.createGain();
          lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          const oscGain = ctx.createGain();
          oscGain.gain.setValueAtTime(0.15, ctx.currentTime);
          osc.connect(oscGain);
          oscGain.connect(masterGain);
          osc.start();

          oscs.push(osc, lfo as any);
        });

        synthNodesRef.current = oscs;
      } else if (type === 'fire') {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const rand = Math.random();
          output[i] = rand > 0.985 ? (Math.random() * 2 - 1) * 0.8 : (Math.random() * 2 - 1) * 0.04;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = noiseBuffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);

        noise.connect(filter);
        filter.connect(masterGain);
        noise.start();

        synthNodesRef.current = [noise, filter];
      }
    } catch (e) {
      console.warn('Audio context init notice:', e);
    }
  };

  const stopSynth = () => {
    try {
      synthNodesRef.current.forEach((n) => {
        try {
          if ((n as any).stop) (n as any).stop();
          n.disconnect();
        } catch {}
      });
      synthNodesRef.current = [];
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
      audioCtxRef.current = null;
    } catch {}
  };

  // Sync volume & mute to synth
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetGain = isMuted ? 0 : volume * 0.4;
      gainNodeRef.current.gain.setTargetAtTime(targetGain, audioCtxRef.current.currentTime, 0.05);
    }
  }, [volume, isMuted]);

  const handleTogglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isPlaying) {
      setIsPlaying(false);
      stopSynth();
    } else {
      setIsPlaying(true);
      if (selectedTrack.type === 'synth' && selectedTrack.synthType) {
        startSynth(selectedTrack.synthType);
      } else {
        setIsOpen(true);
      }
    }
  };

  const handleSelectTrack = (index: number) => {
    setSelectedTrackIndex(index);
    const track = SOUND_TRACKS[index];
    if (track.type === 'synth' && track.synthType) {
      setIsPlaying(true);
      startSynth(track.synthType);
    } else {
      stopSynth();
      setIsPlaying(true);
    }
  };

  // Listen for commands from the Variation 6 Sidebar Audio Sanctuary Card
  useEffect(() => {
    const handleCommand = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail || {};
      if (detail.action === 'open-player') {
        setIsOpen(true);
      } else if (detail.action === 'toggle-play') {
        handleTogglePlay();
      } else if (detail.action === 'select-track' && typeof detail.index === 'number') {
        handleSelectTrack(detail.index);
      }
    };
    window.addEventListener('youmatter-audio-command', handleCommand);
    return () => {
      window.removeEventListener('youmatter-audio-command', handleCommand);
    };
  });

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopSynth();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Navbar Music Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Calm Music and Ambient Soundscape"
        title={isPlaying ? `Playing: ${selectedTrack.name}` : 'Calm Music & Soundscapes'}
        className={`relative group w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 select-none cursor-pointer ${
          isOpen
            ? 'bg-[#7b948a] text-white border-[#7b948a] shadow-xs'
            : isDark
            ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] hover:border-[#8fa99e] active:scale-95'
            : 'bg-white border-black/15 text-[#3c3a35] hover:border-[#7b948a] active:scale-95'
        }`}
      >
        {isPlaying ? (
          <Headphones
            className={`w-4 h-4 animate-pulse ${isOpen ? 'text-white' : 'text-[#7b948a]'}`}
          />
        ) : (
          <Music className="w-4 h-4" />
        )}

        {/* Small Active Playing Indicator */}
        {isPlaying && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7b948a] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#7b948a]" />
          </span>
        )}
      </button>

      {/* Popover Dropdown Panel - Preserving Permanent Spotify DOM Mounting */}
      <div
        className={`absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 p-5 border z-50 transition-all duration-200 origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto visible'
            : 'opacity-0 scale-95 pointer-events-none invisible'
        } ${
          isDark
            ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] shadow-[12px_12px_0_rgba(143,169,158,0.15)]'
            : 'bg-white border-black/15 text-[#3c3a35] shadow-[12px_12px_0_rgba(123,148,138,0.15)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div>
            <span className="sidebar-label">Audio Sanctuary</span>
            <h4 className="font-newsreader text-base italic">
              Spotify Streams & Somatic Generators
            </h4>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-1 opacity-60 hover:opacity-100 transition cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Playback Quick Bar */}
        <div
          className={`my-3 p-2.5 border flex items-center justify-between gap-2.5 ${
            isDark ? 'bg-[#141213] border-white/10' : 'bg-[#f8f3f0] border-black/10'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={handleTogglePlay}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                isPlaying
                  ? 'bg-[#7b948a] text-white'
                  : isDark
                  ? 'bg-white/10 text-[#ede5dc] hover:bg-white/20'
                  : 'bg-black/10 text-[#3c3a35] hover:bg-black/15'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5" />
              ) : (
                <Play className="w-3.5 h-3.5 ml-0.5" />
              )}
            </button>
            <div className="min-w-0">
              <div className="font-newsreader italic text-sm truncate max-w-[180px] sm:max-w-[210px]">
                {selectedTrack.name}
              </div>
              <div className="text-[10px] font-mono-clean uppercase tracking-wider opacity-70">
                {isPlaying
                  ? 'Playing • ' + selectedTrack.category
                  : 'Paused • ' + selectedTrack.category}
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 opacity-70 hover:opacity-100 transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-[#7b948a]" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Sound Selection Grid */}
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          <span className="sidebar-label mb-1">Choose Soundscape or Stream</span>
          {SOUND_TRACKS.map((track, idx) => {
            const isSelected = selectedTrackIndex === idx;
            const IconComp = track.icon;
            return (
              <button
                key={track.id}
                onClick={() => handleSelectTrack(idx)}
                className={`w-full text-left p-2 border flex items-center justify-between gap-2 transition text-xs cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-[#262123] border-[#8fa99e] text-white'
                      : 'bg-[#f8f3f0] border-[#7b948a] text-[#3c3a35] font-medium'
                    : isDark
                    ? 'bg-transparent border-white/10 text-[#ede5dc]/80 hover:border-white/25'
                    : 'bg-transparent border-black/10 text-[#3c3a35]/80 hover:border-black/25'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div
                    className={`p-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-[#7b948a] text-white'
                        : isDark
                        ? 'bg-white/10 text-[#ede5dc]'
                        : 'bg-black/5 text-[#3c3a35]'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <div className="font-newsreader text-sm truncate">{track.name}</div>
                    <div className="text-[10px] font-mono-clean uppercase tracking-wider opacity-65 truncate">
                      {track.category}
                    </div>
                  </div>
                </div>

                {isSelected && (
                  <span className="text-[9px] px-2 py-0.5 font-mono-clean uppercase tracking-wider bg-[#7b948a] text-white shrink-0">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* PERMANENT SPOTIFY IFRAME CONTAINER (Mounts permanently so Spotify never resets on menu toggle) */}
        <div
          style={{
            height: selectedTrack.type === 'spotify' ? '152px' : '0px',
            opacity: selectedTrack.type === 'spotify' ? 1 : 0,
            overflow: 'hidden',
            marginTop: selectedTrack.type === 'spotify' ? '10px' : '0px',
            transition: 'height 0.25s ease, opacity 0.25s ease, margin-top 0.25s ease',
          }}
          className="border border-black/10 bg-black/40 overflow-hidden"
        >
          {selectedTrack.spotifyEmbedUrl && (
            <iframe
              src={selectedTrack.spotifyEmbedUrl}
              width="100%"
              height="152"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Calm Spotify Player Stream"
            />
          )}
        </div>

        {/* Master Volume Bar for Generator / Ambience */}
        <div
          className={`pt-2.5 mt-2.5 border-t flex items-center justify-between gap-3 text-xs ${
            isDark ? 'border-white/10' : 'border-black/10'
          }`}
        >
          <div className="flex items-center gap-1.5 opacity-80 text-[11px] font-mono-clean uppercase">
            <Volume2 className="w-3.5 h-3.5 text-[#7b948a]" />
            <span>Volume ({Math.round(volume * 100)}%)</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-32 h-1.5 accent-[#7b948a] cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
