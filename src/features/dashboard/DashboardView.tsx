import React from 'react';
import {
  FileText,
  GraduationCap,
  HelpCircle,
  TrendingUp,
  Upload,
  BookOpen,
  Bot,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { Course, DocumentItem, Flashcard, Lesson, Quiz, UserProfile, WeakTopic } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface DashboardViewProps {
  user: UserProfile;
  activeCourse: Course;
  activeLesson?: Lesson;
  activeDoc: DocumentItem;
  documents: DocumentItem[];
  dueFlashcards: Flashcard[];
  weakTopics: WeakTopic[];
  quizzes: Quiz[];
  setActiveTab: (tab: ActiveTab) => void;
  setSelectedDocId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  documents,
  quizzes,
  setActiveTab,
  setSelectedDocId,
  setSelectedCourseId,
}) => {
  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-7xl mx-auto text-slate-100">
      {/* Welcome Heading & Live Database Connected Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome back, {user.name}!</h1>
          <p className="text-xs text-slate-400 mt-1">
            Continue your learning journey with AI-powered insights &amp; active documents.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-semibold self-start sm:self-auto shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>Database: Connected</span>
        </div>
      </div>

      {/* 4 Stat Overview Cards Matching Screen 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Documents */}
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-indigo-500/20 shadow-lg shadow-black/20 flex items-center gap-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">{documents.length}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Documents</div>
          </div>
        </div>

        {/* Card 2: Courses */}
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-indigo-500/20 shadow-lg shadow-black/20 flex items-center gap-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">{documents.length > 0 ? 1 : 0}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Courses</div>
          </div>
        </div>

        {/* Card 3: Quizzes */}
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-indigo-500/20 shadow-lg shadow-black/20 flex items-center gap-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">{quizzes.length}</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Quizzes Taken</div>
          </div>
        </div>

        {/* Card 4: Average Score */}
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-indigo-500/20 shadow-lg shadow-black/20 flex items-center gap-3 hover:border-indigo-500/40 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-white leading-none">94%</div>
            <div className="text-xs text-slate-400 mt-1 font-medium">Mastery Score</div>
          </div>
        </div>
      </div>

      {/* Recent Documents Section */}
      <div className="p-5 rounded-2xl bg-[#0F1424] border border-indigo-500/20 shadow-lg shadow-black/20 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-400" />
            Recent Documents
          </h2>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            Upload New +
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="p-8 text-center space-y-2 border border-dashed border-white/[0.08] rounded-xl">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] text-slate-400 mx-auto flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-xs font-semibold text-slate-200">No documents uploaded yet</div>
            <p className="text-[11px] text-slate-400">Upload your PDF or notes to generate summaries, courses, and quizzes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDocId(doc.id);
                  if (doc.courseId) setSelectedCourseId(doc.courseId);
                  setActiveTab('documents');
                }}
                className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-indigo-500/40 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100">{doc.fileName}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{doc.uploadedAt}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>


      {/* Bottom: Quick Actions matching Screen 2 */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-white">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveTab('documents')}
            className="p-3.5 rounded-xl bg-[#0F1424] border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-white/[0.04] flex items-center gap-2.5 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30 group-hover:scale-105 transition-transform">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Upload Document</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className="p-3.5 rounded-xl bg-[#0F1424] border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-white/[0.04] flex items-center gap-2.5 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 border border-orange-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Generate Course</span>
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className="p-3.5 rounded-xl bg-[#0F1424] border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-white/[0.04] flex items-center gap-2.5 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Take a Quiz</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-tutor')}
            className="p-3.5 rounded-xl bg-[#0F1424] border border-indigo-500/20 hover:border-indigo-400/50 hover:bg-white/[0.04] flex items-center gap-2.5 text-left transition-all cursor-pointer group shadow-sm"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30 group-hover:scale-105 transition-transform">
              <Bot className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">Chat with AI Tutor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
