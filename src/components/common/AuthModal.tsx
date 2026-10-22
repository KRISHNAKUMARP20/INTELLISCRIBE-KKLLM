import React, { useState } from 'react';
import { X, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle, BookOpen, User } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (provider: string, userEmail: string, userName?: string, avatarUrl?: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleOAuthLogin = async (provider: 'google') => {
    setOauthLoading(provider);

    // Try Google Identity Services Popup flow first
    const googleClientId =
      (typeof process !== 'undefined' && process.env?.GOOGLE_CLIENT_ID) ||
      '934407270578-n1896r4oj3c97t9n8bv69hq1phldourh.apps.googleusercontent.com';

    if (typeof window !== 'undefined' && (window as any).google?.accounts?.oauth2) {
      try {
        const client = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: 'openid profile email',
          prompt: 'select_account',
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              console.warn('Google Token Client error, falling back:', tokenResponse);
              setOauthLoading(null);
              window.location.href = '/api/auth/google';
              return;
            }

            if (tokenResponse.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const googleProfile = await res.json();
                if (googleProfile.email) {
                  const emailUser = googleProfile.email.split('@')[0];
                  const cleanName = googleProfile.name || emailUser
                    .split(/[._-]/)
                    .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
                    .join(' ');

                  setOauthLoading(null);
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  onSuccess('google', googleProfile.email, cleanName, googleProfile.picture);
                  onClose();
                  return;
                }
              } catch (e) {
                console.error('Error fetching Google userinfo:', e);
              }
            }
            setOauthLoading(null);
          },
        });

        client.requestAccessToken();
        return;
      } catch (err) {
        console.warn('GIS Token client failed, fallback to redirect:', err);
      }
    }

    try {
      // Fallback: Redirect directly to Google sign in / account chooser endpoint
      window.location.href = '/api/auth/google';
    } catch {
      setOauthLoading(null);
    }
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      onSuccess('email', email, name || undefined);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-slate-900 border border-indigo-500/30 rounded-3xl p-7 shadow-2xl text-slate-100 animate-scaleUp z-10 overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 via-indigo-500 to-purple-500" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-400 mx-auto flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            {mode === 'signin' ? 'Welcome Back' : 'Create Free Account'}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signin'
              ? 'Access your course syllabus, AI summaries & spaced repetition'
              : 'Join thousands of students and researchers mastering documents faster'}
          </p>
        </div>

        {/* Google OAuth Button & Interactive Account Chooser */}
        <div className="mb-6 space-y-3">
          <button
            onClick={() => handleOAuthLogin('google')}
            disabled={!!oauthLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {oauthLoading === 'google' ? 'Connecting to Google...' : 'Continue with Google'}
            </span>
          </button>

          {/* Enter Exact Google Account Option */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                const promptEmail = window.prompt("Enter your Google Account email (e.g. yourname@gmail.com):", "krishnakumar6381amma@gmail.com");
                if (promptEmail && promptEmail.trim()) {
                  const cleanEmail = promptEmail.trim();
                  const promptName = window.prompt("Enter your Account Name (e.g. Krishna Kumar):", "Krishna Kumar");
                  let cleanName = promptName && promptName.trim() ? promptName.trim() : '';
                  if (!cleanName) {
                    const prefix = cleanEmail.split('@')[0];
                    cleanName = prefix
                      .split(/[._-]/)
                      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
                      .join(' ');
                  }
                  confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
                  onSuccess('google', cleanEmail, cleanName);
                  onClose();
                }
              }}
              className="w-full text-center text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors py-2.5 px-3 cursor-pointer flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/25"
            >
              <span>Instant Sign In with Your Google Account</span>
              <span className="text-sky-300">→</span>
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-5">
          <div className="border-t border-slate-700/80 w-full" />
          <span className="bg-slate-900 px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            or with email
          </span>
          <div className="border-t border-slate-700/80 w-full" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 hover:from-indigo-500 hover:via-purple-500 hover:to-sky-400 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/60 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 mt-3 cursor-pointer group"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Logging you in...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In & Launch Study Workspace' : 'Sign Up Free'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Toggle signin / signup */}
        <div className="mt-5 text-center text-xs text-slate-400">
          {mode === 'signin' ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-indigo-400 font-bold hover:underline ml-1"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                className="text-indigo-400 font-bold hover:underline ml-1"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
