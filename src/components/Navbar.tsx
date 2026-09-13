import { useState, useRef, useEffect } from 'react';
import { BarChart3, Clock, Settings, Zap, ChevronDown, LogOut, Moon, Sun } from 'lucide-react';
import { StoreSwitcher } from '@/components/StoreSwitcher';
import type { StoreProfile } from '@/types';

interface NavbarProps {
  credits: number;
  maxCredits: number;
  onUpgradeClick: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  userEmail: string;
  onLogout: () => void;
  unreadCount: number;
  onHistoryRead: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
  stores: StoreProfile[];
  activeStoreId: string | null;
  onSelectStore: (id: string) => void;
  onAddStore: () => void;
}

function getInitials(email: string): string {
  const name = email.split('@')[0] ?? 'U';
  const parts = name.split(/[.\-_]/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function formatBadge(count: number): string {
  return count >= 9 ? '9+' : String(count);
}

export function Navbar({
  credits, maxCredits, onUpgradeClick, onHistoryClick, onSettingsClick,
  userEmail, onLogout, unreadCount, onHistoryRead, theme, onThemeToggle,
  stores, activeStoreId, onSelectStore, onAddStore,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [badgeVisible, setBadgeVisible] = useState(false);
  const [badgeFading, setBadgeFading] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (unreadCount > 0) {
      setBadgeFading(false);
      setBadgeVisible(true);
    }
  }, [unreadCount]);

  const handleHistoryClick = () => {
    if (badgeVisible) {
      setBadgeFading(true);
      setTimeout(() => {
        setBadgeVisible(false);
        setBadgeFading(false);
      }, 300);
    }
    onHistoryRead();
    onHistoryClick();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white dark:border-[#343740] dark:bg-[#25272C]/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo + Store Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5B3DF5]">
              <BarChart3 className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="leading-none">
              <h1 className="text-sm font-bold text-slate-900 dark:text-white">CommerceSEO</h1>
              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">Studio</p>
            </div>
          </div>

          {/* Store Switcher */}
          <StoreSwitcher
            stores={stores}
            activeStoreId={activeStoreId}
            onSelectStore={onSelectStore}
            onAddStore={onAddStore}
          />
        </div>

        {/* Actions */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {/* History with numeric unread badge */}
          <button
            onClick={handleHistoryClick}
            className="relative inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:px-3"
          >
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">History</span>
            {badgeVisible && unreadCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#5B3DF5] px-1 text-[10px] font-bold text-white ${badgeFading ? 'animate-fade-out' : 'animate-fade-in'}`}>
                {formatBadge(unreadCount)}
              </span>
            )}
          </button>

          {/* Theme toggle - the ONLY toggle */}
          <button
            onClick={onThemeToggle}
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={onSettingsClick}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:px-3"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          <div className="mx-1 h-6 w-px bg-slate-200 dark:bg-slate-700" />

          {/* Credits */}
          <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {credits}<span className="text-slate-400 dark:text-slate-500">/{maxCredits}</span>
            </span>
            <span className="hidden text-xs text-slate-400 dark:text-slate-500 sm:inline">credits</span>
          </div>

          <button
            onClick={onUpgradeClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#5B3DF5] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#4a2de0] active:scale-95"
          >
            Upgrade Plan
          </button>

          {/* User Avatar Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#5B3DF5] to-[#7c5ff7] text-xs font-bold text-white">
                {getInitials(userEmail)}
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-56 animate-fade-in rounded-lg border border-slate-200 bg-white shadow-xl dark:border-[#343740] dark:bg-[#25272C]">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-[#343740]">
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-400">Signed in as</p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-slate-900 dark:text-slate-200">{userEmail}</p>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => { setMenuOpen(false); onSettingsClick(); }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); onLogout(); }}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-rose-500 transition-colors hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
