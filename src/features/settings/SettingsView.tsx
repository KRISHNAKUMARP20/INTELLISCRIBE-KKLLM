import React, { useState, useRef } from 'react';
import {
  User,
  Clock,
  Bell,
  CheckCircle2,
  Camera,
  Upload,
  RefreshCw
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  documentCount?: number;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  setUser,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl);
  const [dailyGoal, setDailyGoal] = useState(user.dailyGoalMinutes || 30);
  const [reminders, setReminders] = useState(true);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        if (base64) {
          setAvatarUrl(base64);
          setUser((prev) => {
            const updated = { ...prev, avatarUrl: base64 };
            try {
              localStorage.setItem('intelliscribe_user', JSON.stringify(updated));
            } catch { }
            return updated;
          });
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => {
      const updated = {
        ...prev,
        name,
        email,
        avatarUrl,
        dailyGoalMinutes: dailyGoal,
      };
      try {
        localStorage.setItem('intelliscribe_user', JSON.stringify(updated));
      } catch { }
      return updated;
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 sm:p-10 max-w-2xl mx-auto space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Settings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account and preferences.</p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-semibold border border-emerald-500/30 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Profile Information</span>
            </div>
          </div>

          {/* Profile Picture Upload from Device */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#0A0E1A] border border-white/[0.06]">
            <div className="relative group shrink-0">
              <img
                src={avatarUrl}
                alt={name}
                className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/40 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                title="Upload Photo from Device"
              >
                <Camera className="w-5 h-5 text-indigo-300" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-1 flex-1">
              <div className="text-xs font-bold text-white">Profile Photo</div>
              <p className="text-[11px] text-slate-400">
                Upload a custom profile photo directly from your device.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload from Device</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0E1A] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0E1A] border border-white/[0.1] text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Study Target */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Daily Study Target</span>
          </div>

          <div className="grid grid-cols-4 gap-2.5">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setDailyGoal(mins)}
                className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${dailyGoal === mins
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                    : 'bg-[#0A0E1A] text-slate-300 border-white/[0.08] hover:bg-white/[0.06] hover:text-white'
                  }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Bell className="w-4 h-4 text-indigo-400" />
            <span>Notifications</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-semibold text-white">Study Reminders</div>
              <div className="text-[11px] text-slate-400">Receive reminders for daily study.</div>
            </div>
            <button
              type="button"
              onClick={() => setReminders(!reminders)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${reminders ? 'bg-indigo-600' : 'bg-slate-700'
                }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${reminders ? 'translate-x-5' : 'translate-x-0'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};
