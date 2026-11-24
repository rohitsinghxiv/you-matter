/**
 * Web Audio API Calming Bell & Sound Synthesizer
 * Uses pure harmonic oscillators for gentle mindfulness chimes and breathing pacing
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtxClass) {
      audioCtx = new AudioCtxClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a gentle singing bowl / mindfulness chime tone
 * @param frequency Base frequency in Hz (e.g. 432Hz, 528Hz, or 396Hz)
 * @param duration Duration in seconds
 */
export function playChime(frequency: number = 432, duration: number = 2.5) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Master gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    masterGain.connect(ctx.destination);

    // Fundamental oscillator (sine)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);
    osc1.connect(masterGain);

    // Subtle warm overtone (5th above)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(frequency * 1.5, now);
    const overtoneGain = ctx.createGain();
    overtoneGain.gain.setValueAtTime(0.05, now);
    overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration * 0.7));
    osc2.connect(overtoneGain);
    overtoneGain.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.warn('Audio chime playback omitted (browser policy):', e);
  }
}

/**
 * Bilateral tap sound for gentle left/right rhythmic auditory stimulation
 */
export function playBilateralTap(isLeft: boolean) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    if (panner) {
      panner.pan.setValueAtTime(isLeft ? -0.85 : 0.85, now);
    }

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isLeft ? 260 : 310, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    if (panner) {
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);
    } else {
      osc.connect(gain);
      gain.connect(ctx.destination);
    }

    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {
    // Graceful fallback
  }
}
