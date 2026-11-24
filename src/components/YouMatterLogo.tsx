import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface YouMatterLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showIcon?: boolean;
}

export const YouMatterLogo: React.FC<YouMatterLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  showIcon = false,
}) => {
  const { isDark } = useTheme();

  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-11 h-11',
  }[size];

  const textSize = {
    sm: 'text-2xl',
    md: 'text-3xl sm:text-[2.5rem]',
    lg: 'text-4xl sm:text-[3rem]',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {showIcon && (
        <div className={`relative ${iconDimensions} flex items-center justify-center shrink-0`}>
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full relative z-10"
          >
            <circle
              cx="24"
              cy="24"
              r="21"
              stroke={isDark ? '#8fa99e' : '#7b948a'}
              strokeWidth="1.5"
              strokeDasharray="2 3"
              className="opacity-70"
            />
            <path
              d="M24 38C24 38 11 30 11 19.5C11 14.8 14.8 11 19.5 11C22.1 11 23.4 12.4 24 13.5C24.6 12.4 25.9 11 28.5 11C33.2 11 37 14.8 37 19.5C37 30 24 38 24 38Z"
              fill={isDark ? 'rgba(143, 169, 158, 0.18)' : 'rgba(123, 148, 138, 0.15)'}
              stroke={isDark ? '#8fa99e' : '#7b948a'}
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="24" cy="23.5" r="2.2" fill={isDark ? '#ede5dc' : '#7b948a'} />
          </svg>
        </div>
      )}

      {showText && (
        <span
          className={`logo-v6 font-gaegu font-bold tracking-tight transition-colors ${textSize}`}
          style={{ color: 'var(--accent)' }}
        >
          You Matter.
        </span>
      )}
    </div>
  );
};
