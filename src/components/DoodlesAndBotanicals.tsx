import React from 'react';

/**
 * Hand-drawn doodle SVGs matching the digital scrapbook aesthetic from the user's reference image.
 */

// Sketched Cats Group (like at top of "The january digest")
export const SketchedCatsGroup: React.FC<{ className?: string }> = ({ className = 'w-48 h-16' }) => (
  <svg
    viewBox="0 0 280 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} text-[#38312B]`}
  >
    {/* Sparkle 1 */}
    <path
      d="M20 25 Q20 35 10 35 Q20 35 20 45 Q20 35 30 35 Q20 35 20 25 Z"
      fill="currentColor"
      opacity="0.75"
    />
    <circle cx="36" cy="18" r="1.5" fill="currentColor" opacity="0.6" />

    {/* Cat 1: Walking Left/Looking back */}
    <g transform="translate(45, 12)">
      {/* Cat body & legs outline */}
      <path
        d="M25 45 Q20 30 35 25 Q45 22 55 30 Q60 38 58 52 Q55 58 48 58 Q40 58 35 52 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="#FAF7F2"
      />
      {/* Head */}
      <circle cx="26" cy="22" r="9" stroke="currentColor" strokeWidth="1.5" fill="#FAF7F2" />
      {/* Ears */}
      <path d="M19 18 L21 10 L25 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M27 15 L31 10 L33 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Tail */}
      <path
        d="M58 40 Q68 28 64 15 Q60 8 55 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Front legs */}
      <path d="M28 48 L27 65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M33 50 L34 65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Back legs */}
      <path d="M50 52 L50 65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M55 50 L56 64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Whiskers */}
      <path d="M18 23 L11 21 M18 25 L12 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M34 23 L41 21 M34 25 L40 27" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="23" cy="21" r="0.8" fill="currentColor" />
      <circle cx="29" cy="21" r="0.8" fill="currentColor" />
    </g>

    {/* Tiny doodle star */}
    <path
      d="M135 15 L137 20 L142 21 L138 24 L139 29 L135 26 L131 29 L132 24 L128 21 L133 20 Z"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
      opacity="0.8"
    />

    {/* Cat 2: Sitting Proud / Looking Forward */}
    <g transform="translate(145, 10)">
      {/* Body */}
      <path
        d="M20 58 Q12 40 22 28 Q30 25 38 28 Q48 40 40 58 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="#FAF7F2"
      />
      {/* Head */}
      <circle cx="30" cy="18" r="9.5" stroke="currentColor" strokeWidth="1.5" fill="#FAF7F2" />
      {/* Ears */}
      <path d="M22 14 L24 6 L29 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="#FAF7F2" />
      <path d="M31 11 L36 6 L38 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="#FAF7F2" />
      {/* Eyes & Nose */}
      <circle cx="27" cy="18" r="0.9" fill="currentColor" />
      <circle cx="33" cy="18" r="0.9" fill="currentColor" />
      <path d="M30 21 L29 23 L31 23 Z" fill="currentColor" />
      {/* Whiskers */}
      <path d="M24 20 L16 19 M24 22 L17 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M36 20 L44 19 M36 22 L43 24" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      {/* Tail wrapping around paws */}
      <path
        d="M40 52 Q48 55 45 42 Q42 32 46 22"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M25 58 Q30 60 35 58" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </g>

    {/* Sparkle 2 */}
    <path
      d="M210 20 Q210 26 205 26 Q210 26 210 32 Q210 26 215 26 Q210 26 210 20 Z"
      fill="currentColor"
      opacity="0.75"
    />

    {/* Cat 3: Lounging / Playful Stretch */}
    <g transform="translate(215, 14)">
      <path
        d="M15 48 Q10 35 25 32 Q40 30 50 45 Q55 54 45 56 Q30 58 15 48 Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="#FAF7F2"
      />
      {/* Head tucked */}
      <circle cx="15" cy="32" r="8" stroke="currentColor" strokeWidth="1.5" fill="#FAF7F2" />
      {/* Ears */}
      <path d="M10 27 L9 20 L14 24" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 25 L20 20 L21 27" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Eyes sleeping curves */}
      <path d="M12 32 Q14 34 16 32" stroke="currentColor" strokeWidth="1.2" fill="none" />
      {/* Tail up in air */}
      <path
        d="M50 42 Q58 25 54 15 Q50 6 46 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Back paws */}
      <path d="M42 55 L42 62" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M47 54 L48 61" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </g>

    {/* Star at end */}
    <path
      d="M272 38 L273 42 L277 43 L274 46 L275 50 L272 47 L269 50 L270 46 L267 43 L271 42 Z"
      stroke="currentColor"
      strokeWidth="1"
      fill="none"
      opacity="0.8"
    />
  </svg>
);

// Pressed Pink Rose / Flower Petal (Like on the quotes & TBR in reference image)
export const PressedFlowerSticker: React.FC<{
  className?: string;
  variant?: 'rose' | 'sakura' | 'trio';
  opacity?: number;
}> = ({ className = 'w-16 h-16', variant = 'rose', opacity = 0.9 }) => {
  if (variant === 'sakura') {
    return (
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={{ opacity }}
      >
        <g transform="translate(50,50)">
          {[0, 72, 144, 216, 288].map((angle, i) => (
            <path
              key={i}
              d="M0 0 C-12 -25 -15 -42 0 -45 C15 -42 12 -25 0 0"
              fill="#F7CCD2"
              stroke="#E8AAB3"
              strokeWidth="0.8"
              transform={`rotate(${angle})`}
            />
          ))}
          <circle cx="0" cy="0" r="5" fill="#EFA4AF" />
          <circle cx="0" cy="0" r="2.5" fill="#D87888" />
        </g>
      </svg>
    );
  }

  if (variant === 'trio') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`} style={{ opacity }}>
        <PressedFlowerSticker className="w-8 h-8" variant="rose" />
        <PressedFlowerSticker className="w-10 h-10" variant="sakura" />
        <PressedFlowerSticker className="w-8 h-8" variant="rose" />
      </div>
    );
  }

  // Default: Pressed Botanical Rose Bloom
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
    >
      <defs>
        <radialGradient id="roseGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F9D4DC" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#F2B7C4" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#E498A9" stopOpacity="0.75" />
        </radialGradient>
      </defs>
      {/* Outer Petals */}
      <path
        d="M60 15 C40 15 25 35 25 60 C25 85 45 105 60 105 C75 105 95 85 95 60 C95 35 80 15 60 15 Z"
        fill="url(#roseGrad)"
        stroke="#D88A9C"
        strokeWidth="0.7"
      />
      <path
        d="M30 40 C15 55 20 80 45 92 C70 104 90 85 90 60 C90 35 60 25 30 40 Z"
        fill="url(#roseGrad)"
        opacity="0.85"
      />
      {/* Inner Petal Layers */}
      <path
        d="M45 42 C35 55 40 75 60 80 C80 75 85 55 75 42 C65 30 55 30 45 42 Z"
        fill="#FCE5EB"
        stroke="#D88A9C"
        strokeWidth="0.6"
        opacity="0.9"
      />
      <path
        d="M52 50 C48 58 52 68 62 70 C72 68 76 58 72 50 C68 44 56 44 52 50 Z"
        fill="#EDB3C1"
        stroke="#C97587"
        strokeWidth="0.6"
      />
      {/* Center Core */}
      <circle cx="60" cy="58" r="4" fill="#C97587" />
      <circle cx="58" cy="56" r="1.5" fill="#FFE2E8" />
    </svg>
  );
};

// Sparkle Star cluster (✦ ✨ ⋆)
export const SparkleDoodle: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M20 5 Q20 20 5 20 Q20 20 20 35 Q20 20 35 20 Q20 20 20 5 Z"
      fill="#3D352E"
      opacity="0.8"
    />
    <circle cx="32" cy="10" r="1.5" fill="#3D352E" opacity="0.6" />
    <circle cx="8" cy="30" r="1.2" fill="#3D352E" opacity="0.5" />
  </svg>
);

// Washi Tape header component
export const WashiTape: React.FC<{
  variant?: 'rose' | 'kraft' | 'sage' | 'butter';
  className?: string;
  style?: React.CSSProperties;
}> = ({ variant = 'kraft', className = '', style }) => {
  const colors = {
    kraft: 'bg-[#E5D7C5]/85 border-y border-[#D6C4AD]/60',
    rose: 'bg-[#F2D7DC]/85 border-y border-[#E2BCC4]/60',
    sage: 'bg-[#D6E3D8]/85 border-y border-[#BFCFBF]/60',
    butter: 'bg-[#F6EDCE]/85 border-y border-[#E4D8A8]/60',
  };

  return (
    <div
      className={`h-5 w-24 shadow-sm backdrop-blur-[1px] transform -rotate-1 rounded-xs ${colors[variant]} ${className}`}
      style={{
        clipPath: 'polygon(3% 0%, 97% 0%, 100% 100%, 0% 100%)',
        ...style,
      }}
    />
  );
};

// Single Pressed Leaf / Botanical Fern
export const BotanicalLeaf: React.FC<{ className?: string }> = ({ className = 'w-8 h-12' }) => (
  <svg viewBox="0 0 50 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 75 Q25 40 25 5" stroke="#7A8B78" strokeWidth="1.2" strokeLinecap="round" />
    {/* Leaves */}
    <path d="M25 20 Q12 15 15 8 Q23 12 25 20" fill="#98AB96" opacity="0.85" />
    <path d="M25 22 Q38 17 35 10 Q27 14 25 22" fill="#98AB96" opacity="0.85" />
    <path d="M25 35 Q10 30 12 22 Q22 26 25 35" fill="#8EA28C" opacity="0.85" />
    <path d="M25 38 Q40 33 38 25 Q28 29 25 38" fill="#8EA28C" opacity="0.85" />
    <path d="M25 52 Q8 46 10 38 Q21 42 25 52" fill="#859A83" opacity="0.85" />
    <path d="M25 55 Q42 49 40 41 Q29 45 25 55" fill="#859A83" opacity="0.85" />
  </svg>
);

// Realistic Corner Washi Tape pasted across photo corner
export const CornerWashiTape: React.FC<{
  corner?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  rotationDeg?: number;
  variant?: 'kraft' | 'rose' | 'sage' | 'butter' | 'parchment';
  className?: string;
  style?: React.CSSProperties;
}> = ({
  corner,
  rotationDeg,
  variant = 'kraft',
  className = '',
  style,
}) => {
  // If corner is not explicitly passed, determine from rotation angle:
  // When a photo tilts counter-clockwise / to the left (rotation < 0), it hangs/pivots from the Top-Right corner.
  // When a photo tilts clockwise / to the right (rotation >= 0), it hangs/pivots from the Top-Left corner.
  const effectiveCorner =
    corner ||
    (rotationDeg !== undefined
      ? rotationDeg < 0
        ? 'top-right'
        : 'top-left'
      : 'top-left');

  const cornerStyles: Record<string, string> = {
    'top-left': '-top-2.5 -left-3.5 -rotate-[35deg]',
    'top-right': '-top-2.5 -right-3.5 rotate-[35deg]',
    'bottom-left': '-bottom-2.5 -left-3.5 rotate-[35deg]',
    'bottom-right': '-bottom-2.5 -right-3.5 -rotate-[35deg]',
  };

  const variantColors: Record<string, string> = {
    kraft:
      'bg-[#EADDCB]/90 border-y border-[#D4C3AC] shadow-[0_2px_6px_rgba(60,45,35,0.2)]',
    rose:
      'bg-[#F5D8DD]/90 border-y border-[#E5BDC5] shadow-[0_2px_6px_rgba(232,147,130,0.22)]',
    sage:
      'bg-[#D8E6DA]/90 border-y border-[#BED0C0] shadow-[0_2px_6px_rgba(140,165,145,0.22)]',
    butter:
      'bg-[#F8EFCF]/90 border-y border-[#E6DBA6] shadow-[0_2px_6px_rgba(224,185,95,0.22)]',
    parchment:
      'bg-[#F2ECE1]/90 border-y border-[#DFD3C2] shadow-[0_2px_6px_rgba(50,40,30,0.18)]',
  };

  return (
    <div
      aria-hidden="true"
      className={`absolute z-20 pointer-events-none w-14 sm:w-16 h-4 sm:h-4.5 backdrop-blur-[1.5px] transition-transform duration-300 ${
        cornerStyles[effectiveCorner] || cornerStyles['top-left']
      } ${variantColors[variant] || variantColors.kraft} ${className}`}
      style={{
        clipPath:
          'polygon(0% 15%, 4% 0%, 96% 0%, 100% 15%, 97% 85%, 100% 100%, 4% 100%, 0% 85%)',
        ...style,
      }}
    >
      {/* Subtle realistic inner translucent fiber sheen */}
      <div className="w-full h-full opacity-40 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.5)_50%,transparent_100%)]" />
    </div>
  );
};
