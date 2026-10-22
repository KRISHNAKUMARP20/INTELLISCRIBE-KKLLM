import React from 'react';
import {
  LayoutDashboard,
  FileText,
  GraduationCap,
  Layers,
  HelpCircle,
  Bot,
  Calendar,
  Settings,
  BookOpen,
  BookMarked
} from 'lucide-react';
import { ActiveTab } from '../../store/useAppStore';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  setCourseSubTab?: (subTab: 'overview' | 'summary' | 'flashcards' | 'quizzes' | 'notes' | 'lessons') => void;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  setCourseSubTab,
  onLogout,
}) => {
  const coreNavItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'notebook' as ActiveTab,
      label: 'AI Notebook',
      icon: BookMarked,
    },
    {
      id: 'documents' as ActiveTab,
      label: 'My Documents',
      icon: FileText,
    },
    {
      id: 'courses' as ActiveTab,
      label: 'My Courses',
      icon: GraduationCap,
      onSelect: () => {
        if (setCourseSubTab) setCourseSubTab('overview');
      },
    },
    {
      id: 'flashcards' as ActiveTab,
      label: 'Flashcards',
      icon: Layers,
      onSelect: () => {
        if (setCourseSubTab) setCourseSubTab('flashcards');
      },
    },
    {
      id: 'quizzes' as ActiveTab,
      label: 'Quizzes',
      icon: HelpCircle,
      onSelect: () => {
        if (setCourseSubTab) setCourseSubTab('quizzes');
      },
    },
    {
      id: 'ai-tutor' as ActiveTab,
      label: 'AI Tutor',
      icon: Bot,
    },
    {
      id: 'revision-planner' as ActiveTab,
      label: 'Study Planner',
      icon: Calendar,
      onSelect: () => {
        if (setCourseSubTab) setCourseSubTab('notes');
      },
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-60 bg-[#0A0E1A] border-r border-indigo-500/15 flex flex-col shrink-0 select-none min-h-screen">
      {/* Brand Header */}
      <div
        onClick={() => setActiveTab('landing')}
        className="h-16 flex items-center gap-2.5 px-6 border-b border-white/[0.08] cursor-pointer group shrink-0"
      >
        <img
          src="/logo.jpg"
          alt="IntelliScribe Logo"
          className="w-8 h-8 rounded-lg object-cover shadow-md shadow-indigo-600/40 group-hover:scale-105 transition-transform ring-1 ring-indigo-400/40"
        />
        <span className="font-extrabold text-base text-white tracking-wider group-hover:text-indigo-300 transition-colors">
          INTELLISCRIBE
        </span>
      </div>

      {/* Nav List */}
      <div className="p-3 space-y-1.5 flex-1">
        {coreNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === 'courses' && (activeTab === 'lessons' || activeTab === 'summaries' || activeTab === 'exports'));

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.onSelect) item.onSelect();
                setActiveTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Logout Action Area */}
      {onLogout && (
        <div className="p-3 border-t border-white/[0.08] mt-auto">
          <button
            onClick={onLogout}
            className="group relative w-full flex items-center justify-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-600 border border-rose-500/25 hover:border-transparent text-xs font-bold text-rose-400 hover:text-white shadow-xs hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 active:scale-95 cursor-pointer overflow-hidden"
          >
            <div className="w-5 h-5 rounded-lg bg-rose-500/20 group-hover:bg-white/20 flex items-center justify-center text-rose-400 group-hover:text-white transition-colors duration-300">
              <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <span>Log Out</span>
            <span className="absolute right-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2 transition-all duration-300 text-xs font-bold">
              →
            </span>
          </button>
        </div>
      )}
    </aside>
  );
};
