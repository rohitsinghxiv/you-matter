import React, { useState } from 'react';
import { User } from '../types';
import { Lock, LogOut, ChevronDown } from 'lucide-react';
import { YouMatterLogo } from './YouMatterLogo';
import { ThemeToggle } from './ThemeToggle';
import { CalmMusicPlayer } from './CalmMusicPlayer';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: 'community' | 'my-vault' | 'steps';
  onSelectTab: (tab: 'community' | 'my-vault' | 'steps') => void;
  onOpenCreateModal: () => void;
  currentUser: User | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onDeleteAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenCreateModal,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onDeleteAccount,
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const { isDark } = useTheme();

  return (
    <header className="w-full z-40 transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-6 flex items-center justify-between gap-4">
        {/* Brand Logo: Gaegu 2.5rem in --accent */}
        <div
          onClick={() => onSelectTab('community')}
          className="cursor-pointer group flex items-center shrink-0"
        >
          <YouMatterLogo size="md" />
        </div>

        {/* Center Navigation Cluster (Variation 6 .nav-cluster) */}
        <nav className="hidden md:flex items-center gap-10">
          <button
            type="button"
            onClick={() => onSelectTab('community')}
            className={`nav-cluster-link bg-transparent border-0 ${
              currentTab === 'community' ? 'active font-medium' : ''
            }`}
          >
            Sanctuary Feed
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('my-vault')}
            className={`nav-cluster-link bg-transparent border-0 ${
              currentTab === 'my-vault' ? 'active font-medium' : ''
            }`}
          >
            My Safe Vault
          </button>

          <button
            type="button"
            onClick={() => onSelectTab('steps')}
            className={`nav-cluster-link bg-transparent border-0 ${
              currentTab === 'steps' ? 'active font-medium' : ''
            }`}
          >
            Steps to Hold On
          </button>
        </nav>

        {/* Right Controls: Icon-Only Theme Switcher + Icon-Only Music Player + Gaegu Pill CTA + User */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          {/* Light/Dark Book Page Turn Switcher (Icon Only) */}
          <ThemeToggle />

          {/* Calm Music Player (Icon Only in Navbar with Persistent Spotify Stream) */}
          <CalmMusicPlayer />

          {/* Primary Pill Button in Gaegu Cursive */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="btn-pill text-lg sm:text-[1.35rem] px-5 sm:px-7 py-2 sm:py-2.5"
          >
            Pour Out Thoughts
          </button>

          {/* User Account / Auth Control */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className={`flex items-center gap-2 py-1.5 px-3 border transition text-xs font-mono-clean uppercase tracking-wider cursor-pointer ${
                  isDark
                    ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] hover:border-[#8fa99e]'
                    : 'bg-white border-black/15 text-[#3c3a35] hover:border-[#7b948a]'
                }`}
              >
                <span>{currentUser.avatarSticker}</span>
                <span className="hidden sm:inline max-w-[90px] truncate">
                  {currentUser.penName}
                </span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              {showUserDropdown && (
                <div
                  className={`absolute right-0 mt-2 w-56 p-3 z-50 border ${
                    isDark
                      ? 'bg-[#1c1719] border-white/15 text-[#ede5dc] shadow-[10px_10px_0_rgba(143,169,158,0.15)]'
                      : 'bg-white border-black/15 text-[#3c3a35] shadow-[10px_10px_0_rgba(123,148,138,0.15)]'
                  }`}
                >
                  <div
                    className={`pb-2.5 mb-2 border-b ${
                      isDark ? 'border-white/10' : 'border-black/10'
                    }`}
                  >
                    <div className="font-newsreader font-medium text-sm">{currentUser.penName}</div>
                    <div className="text-[11px] font-mono-clean opacity-65 truncate">
                      {currentUser.email}
                    </div>
                    <div
                      className="text-sm font-handwriting mt-1"
                      style={{ color: 'var(--accent)' }}
                    >
                      {currentUser.signature}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTab('my-vault');
                      setShowUserDropdown(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 text-xs font-mono-clean uppercase tracking-wider flex items-center gap-2 transition cursor-pointer ${
                      isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                    <span>My Safe Vault</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onLogout();
                      setShowUserDropdown(false);
                    }}
                    className="w-full text-left px-2.5 py-2 text-xs font-mono-clean uppercase tracking-wider text-[#c95742] hover:bg-[#c95742]/10 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>

                  {onDeleteAccount && (
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteAccount();
                        setShowUserDropdown(false);
                      }}
                      className="w-full text-left px-2.5 py-2 text-[10px] font-mono-clean uppercase tracking-wider opacity-70 hover:opacity-100 hover:bg-[#c95742]/10 flex items-center gap-2 transition cursor-pointer"
                    >
                      <span>Delete my account &amp; data</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="btn-youmatter-secondary hidden sm:inline-block cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Bar */}
      <div
        className={`md:hidden flex items-center justify-around border-t border-b py-2.5 px-4 ${
          isDark ? 'border-white/10 bg-[#141213]/90' : 'border-black/10 bg-[#f8f3f0]/90'
        }`}
      >
        <button
          type="button"
          onClick={() => onSelectTab('community')}
          className={`nav-cluster-link bg-transparent border-0 ${
            currentTab === 'community' ? 'active font-semibold' : ''
          }`}
        >
          Sanctuary Feed
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('my-vault')}
          className={`nav-cluster-link bg-transparent border-0 ${
            currentTab === 'my-vault' ? 'active font-semibold' : ''
          }`}
        >
          My Safe Vault
        </button>

        <button
          type="button"
          onClick={() => onSelectTab('steps')}
          className={`nav-cluster-link bg-transparent border-0 ${
            currentTab === 'steps' ? 'active font-semibold' : ''
          }`}
        >
          Steps to Hold On
        </button>

        {!currentUser && (
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="nav-cluster-link bg-transparent border-0"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};
