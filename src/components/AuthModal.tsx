import React, { useState } from 'react';
import { User } from '../types';
import { loginUser, registerUser } from '../utils/auth';
import { X, Lock, Mail, User as UserIcon, KeyRound } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { isDark } = useTheme();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [penName, setPenName] = useState('');
  const [avatarSticker, setAvatarSticker] = useState('🕯️');
  const [signature, setSignature] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const STICKERS = ['🕯️', '🌸', '🌱', '🕊️', '✨', '🌊', '🐱', '☕', '📖', '🍂'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const res = await loginUser(email, password);
        if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Failed to login. Please verify your credentials.');
        }
      } else {
        const res = await registerUser(
          email,
          password,
          penName,
          avatarSticker,
          signature || `- ${penName}`
        );
        if (res.success && res.needsConfirmation) {
          setErrorMessage('Almost there! Check your email and click the confirmation link, then sign in.');
        } else if (res.success && res.user) {
          onSuccess(res.user);
          onClose();
        } else {
          setErrorMessage(res.error || 'Failed to register.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className={`relative rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 border ${
          isDark
            ? 'bg-[#191217] border-[#3E2937] text-[#EDE2DC]'
            : 'bg-[#FCFAF7] border-[#DFD3C4] text-[#2C241F]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-4 border-b ${
            isDark ? 'border-[#2D1D27]' : 'border-[#EAE0D3]'
          }`}
        >
          <div>
            <h3
              className={`font-cormorant text-2xl font-bold ${
                isDark ? 'text-[#FAF4F0]' : 'text-[#221B18]'
              }`}
            >
              {mode === 'login' ? 'Sign In to Safe Vault' : 'Create Anonymous Account'}
            </h3>
            <p className={`text-xs ${isDark ? 'text-[#9E8C84]' : 'text-[#7A6C64]'}`}>
              {mode === 'login'
                ? 'Access your private reflections and safe vault.'
                : 'Protected, compassionate, and private reflection space.'}
            </p>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-full border transition ${
              isDark
                ? 'text-[#9E8C84] hover:text-white bg-[#251821] border-[#3D2735]'
                : 'text-[#6A5A52] hover:text-black bg-[#F2ECE3] border-[#DDD0C0]'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div
          className={`flex p-1 rounded-xl border ${
            isDark
              ? 'bg-[#22161E] border-[#382330]'
              : 'bg-[#F2ECE3] border-[#DDD0C0]'
          }`}
        >
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              mode === 'login'
                ? isDark
                  ? 'bg-[#311E2A] text-white shadow-xs'
                  : 'bg-white text-[#221B18] shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition ${
              mode === 'register'
                ? isDark
                  ? 'bg-[#311E2A] text-white shadow-xs'
                  : 'bg-white text-[#221B18] shadow-xs'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-[#FDECEC] border border-[#F4C5C5] rounded-xl text-xs text-[#B82B2B]">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="space-y-1">
                <label className="block text-xs font-medium opacity-80">
                  Pen Name / Pseudonym
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 opacity-50 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={penName}
                    onChange={(e) => {
                      setPenName(e.target.value);
                      if (!signature) setSignature(`- ${e.target.value}`);
                    }}
                    placeholder="e.g. Esther, Rowan, Meadow"
                    required
                    className={`w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl focus:outline-hidden border ${
                      isDark
                        ? 'bg-[#160E13] border-[#382330] focus:border-[#E89382] text-white'
                        : 'bg-white border-[#DDD0C0] focus:border-[#E07A5F] text-[#241D18]'
                    }`}
                  />
                </div>
              </div>

              {/* Avatar Sticker Picker */}
              <div className="space-y-1">
                <label className="block text-xs font-medium opacity-80">
                  Select Sanctuary Avatar
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {STICKERS.map((stk) => (
                    <button
                      key={stk}
                      type="button"
                      onClick={() => setAvatarSticker(stk)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition border ${
                        avatarSticker === stk
                          ? isDark
                            ? 'bg-[#3A2230] border-[#E89382] scale-110 shadow-xs'
                            : 'bg-[#FAF0E6] border-[#E07A5F] scale-110 shadow-xs'
                          : isDark
                          ? 'bg-[#20151C] border-[#382330] hover:bg-[#281A24]'
                          : 'bg-white border-[#DDD0C0] hover:bg-[#F9F5EE]'
                      }`}
                    >
                      {stk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Signature Preview */}
              <div className="space-y-1">
                <label className="block text-xs font-medium opacity-80">
                  Handwritten Signature Sign-off
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="- Esther"
                  className={`w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl font-handwriting text-lg focus:outline-hidden border ${
                    isDark
                      ? 'bg-[#160E13] border-[#382330] text-[#E89382]'
                      : 'bg-white border-[#DDD0C0] text-[#D96B50]'
                  }`}
                />
              </div>
            </>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium opacity-80">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 opacity-50 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@vault.safe"
                required
                className={`w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl focus:outline-hidden border ${
                  isDark
                    ? 'bg-[#160E13] border-[#382330] focus:border-[#E89382] text-white'
                    : 'bg-white border-[#DDD0C0] focus:border-[#E07A5F] text-[#241D18]'
                }`}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium opacity-80">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 opacity-50 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className={`w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl focus:outline-hidden border ${
                  isDark
                    ? 'bg-[#160E13] border-[#382330] focus:border-[#E89382] text-white'
                    : 'bg-white border-[#DDD0C0] focus:border-[#E07A5F] text-[#241D18]'
                }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-youmatter-primary py-2.5 text-xs flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 mt-2"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>
              {isLoading
                ? 'Securing Account...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Anonymous Account'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
