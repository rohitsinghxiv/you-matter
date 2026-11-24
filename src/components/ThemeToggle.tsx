import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isDark, toggleTheme, isPageTurning } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      disabled={isPageTurning}
      aria-label={
        isDark
          ? 'Switch to Daylight Book Page (Light Mode)'
          : 'Switch to Candlelit Parchment (Dark Mode)'
      }
      title={
        isDark
          ? 'Turn page to Daylight Sanctuary Page (Light Theme)'
          : 'Turn page to Candlelit Night & Warm Parchment (Dark Theme)'
      }
      className={`relative group w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-300 select-none cursor-pointer ${
        isDark
          ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] hover:border-[#8fa99e] active:scale-95'
          : 'bg-white border-black/15 text-[#3c3a35] hover:border-[#7b948a] active:scale-95'
      } ${isPageTurning ? 'scale-90 opacity-70' : ''} ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#e4b074] transition-transform duration-300 group-hover:rotate-12" />
      ) : (
        <Moon className="w-4 h-4 text-[#7b948a] transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
};
