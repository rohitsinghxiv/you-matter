import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const PageTurnOverlay: React.FC = () => {
  const { isPageTurning, pageTurnDirection } = useTheme();

  if (!isPageTurning) return null;

  const isGoingToDark = pageTurnDirection === 'to-dark';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-center">
      {/* Radial Fade-From-Center Canvas Layer */}
      <div
        className={`absolute inset-0 w-full h-full flex items-center justify-center animate-fade-from-center ${
          isGoingToDark
            ? 'bg-[#141213] text-[#ede5dc]'
            : 'bg-[#f8f3f0] text-[#3c3a35]'
        }`}
        style={{
          backgroundImage: isGoingToDark
            ? 'radial-gradient(circle at 50% 50%, rgba(143, 169, 158, 0.16) 0%, rgba(20, 18, 19, 0.98) 70%)'
            : 'radial-gradient(circle at 50% 50%, rgba(123, 148, 138, 0.16) 0%, rgba(248, 243, 240, 0.98) 70%)',
        }}
      >
        {/* Center Indicator Badge */}
        <div
          className={`relative z-10 flex flex-col items-center gap-3 px-8 py-6 border animate-fade-center-badge ${
            isGoingToDark
              ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] shadow-[12px_12px_0_rgba(143,169,158,0.15)]'
              : 'bg-white border-black/15 text-[#3c3a35] shadow-[12px_12px_0_rgba(123,148,138,0.15)]'
          }`}
        >
          {isGoingToDark ? (
            <>
              <div className="w-12 h-12 rounded-full bg-[#141213] text-[#e4b074] flex items-center justify-center text-2xl border border-white/15">
                🕯️
              </div>
              <div className="text-center space-y-1">
                <span className="font-newsreader italic text-2xl block">
                  Lighting Candles...
                </span>
                <p className="text-[11px] font-mono-clean uppercase tracking-widest opacity-70">
                  Candlelit Sanctuary Mode
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-[#f8f3f0] text-[#7b948a] flex items-center justify-center text-2xl border border-black/15">
                ☀️
              </div>
              <div className="text-center space-y-1">
                <span className="font-newsreader italic text-2xl block">
                  Opening Daylight Page...
                </span>
                <p className="text-[11px] font-mono-clean uppercase tracking-widest opacity-70">
                  Warm Paper Sanctuary Mode
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
