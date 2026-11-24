import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  isPageTurning: boolean;
  pageTurnDirection: 'to-dark' | 'to-light';
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('you_matter_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light'; // Default to pristine A4 book page as requested
  });

  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageTurnDirection, setPageTurnDirection] = useState<'to-dark' | 'to-light'>('to-dark');

  useEffect(() => {
    localStorage.setItem('you_matter_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
      document.body.style.backgroundColor = '#141213';
      document.body.style.color = '#ede5dc';
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#f8f3f0';
      document.body.style.color = '#3c3a35';
    }
  }, [theme]);

  // Gentle acoustic paper rustle audio synthesis
  const playPageTurnSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.35; // 350ms
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Filtered noise simulating paper friction
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Lowpass paper sweep
        lastVal = lastVal * 0.9 + white * 0.1;
        const envelope = Math.sin((i / bufferSize) * Math.PI);
        data[i] = lastVal * envelope * 0.12;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      setTimeout(() => {
        try {
          ctx.close();
        } catch {}
      }, 500);
    } catch {}
  };

  const toggleTheme = () => {
    if (isPageTurning) return;
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setPageTurnDirection(theme === 'light' ? 'to-dark' : 'to-light');
    setIsPageTurning(true);
    playPageTurnSound();

    // Flip theme at the midpoint of page turn rotation
    setTimeout(() => {
      setThemeState(nextTheme);
    }, 320);

    setTimeout(() => {
      setIsPageTurning(false);
    }, 750);
  };

  const setTheme = (newTheme: ThemeMode) => {
    if (newTheme === theme || isPageTurning) return;
    setPageTurnDirection(newTheme === 'dark' ? 'to-dark' : 'to-light');
    setIsPageTurning(true);
    playPageTurnSound();

    setTimeout(() => {
      setThemeState(newTheme);
    }, 320);

    setTimeout(() => {
      setIsPageTurning(false);
    }, 750);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        isDark: theme === 'dark',
        isPageTurning,
        pageTurnDirection,
        toggleTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
