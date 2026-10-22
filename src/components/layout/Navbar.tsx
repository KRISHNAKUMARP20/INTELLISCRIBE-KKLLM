import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle,
  User,
  GraduationCap,
  Download
} from 'lucide-react';
import { UserProfile } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface NavbarProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  notifications: any[];
  setIsSearchOpen: (open: boolean) => void;
  setActiveTab: (tab: ActiveTab) => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  setUser,
  notifications,
  setIsSearchOpen,
  setActiveTab,
  onLogout,
  onToggleMobileMenu,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Check if running as standalone PWA
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert('To install this App:\n• Chrome/Edge: Click the install icon (⊕) in the browser address bar.\n• Safari (iOS): Tap Share → Add to Home Screen.');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0A0E1A]/90 backdrop-blur-xl border-b border-indigo-500/15 px-4 sm:px-6 h-16 flex items-center justify-between select-none shadow-lg shadow-black/20">
      {/* Left side: Mobile Menu Hamburger & Brand on Mobile */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
            title="Toggle Menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="lg:hidden flex items-center gap-2 cursor-pointer font-extrabold text-sm text-indigo-400 tracking-wider"
        >
          <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-md object-cover ring-1 ring-indigo-400/40" />
          <span>INTELLISCRIBE</span>
        </div>
      </div>

      {/* Right side: Install PWA, Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* PWA Install Button */}
        {!isInstalled && (
          <button
            onClick={handleInstallApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-indigo-500/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="Install INTELLISCRIBE on your device"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

        {/* Search Icon Trigger */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
          title="Search (Cmd+K)"
        >
          <Search className="w-4 h-4" />
        </button>

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06] transition-colors relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0A0E1A]" />
          )}
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-[#0F1424] border border-indigo-500/20 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <span className="text-xs font-bold text-white">Notifications</span>
              <span className="text-[10px] text-indigo-400 font-semibold">{unreadCount} unread</span>
            </div>
            <div className="space-y-1.5 mt-2 max-h-64 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs hover:bg-white/[0.06] transition-colors"
                >
                  <div className="font-semibold text-slate-100">{n.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{n.message}</div>
                  <div className="text-[9px] text-slate-500 mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Profile matching Priya S / Student */}
      <div className="relative pl-2 border-l border-white/[0.1]">
        <button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.06] transition-colors"
        >
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/40"
          />
          <div className="text-left hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400 capitalize leading-tight">Student</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {showUserDropdown && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-[#0F1424] border border-indigo-500/25 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-3 py-2 border-b border-white/[0.08]">
              <div className="text-xs font-bold text-white">{user.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
            </div>
            <div className="py-1 space-y-1">
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  setActiveTab('settings');
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] flex items-center gap-2 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                Account Settings
              </button>
              {onLogout && (
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="group relative w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 flex items-center justify-between transition-all duration-200 border border-rose-500/20 hover:border-transparent shadow-xs hover:shadow-md hover:shadow-rose-500/25 active:scale-95 cursor-pointer mt-1"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-rose-500/20 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                      <svg className="w-3.5 h-3.5 text-rose-400 group-hover:text-white group-hover:-translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span>Log Out</span>
                  </div>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-mono text-white/80">
                    ESC
                  </span>
                </button>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </header>
  );
};


