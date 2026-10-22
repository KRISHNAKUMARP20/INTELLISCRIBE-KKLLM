import React, { useState } from 'react';
import {
  Code,
  Laptop,
  CheckCircle2,
  Circle,
  BookOpen,
  Layers,
  HelpCircle,
  FileCode,
  ArrowRight,
  Download
} from 'lucide-react';
import { Course } from '../../types';
import { ActiveTab } from '../../store/useAppStore';
import { FileExportModal } from '../../components/common/FileExportModal';

interface CoursesViewProps {
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  courseSubTab: 'overview' | 'summary' | 'flashcards' | 'quizzes' | 'notes' | 'lessons';
  setCourseSubTab: (subTab: 'overview' | 'summary' | 'flashcards' | 'quizzes' | 'notes' | 'lessons') => void;
}

export const CoursesView: React.FC<CoursesViewProps> = ({
  courses,
  selectedCourseId,
  setSelectedLessonId,
  setActiveTab,
  courseSubTab,
  setCourseSubTab,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const activeCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  if (!activeCourse) {
    return (
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">My Courses</h1>
          <p className="text-xs text-slate-400 mt-1">AI-generated structured courses based on your uploaded documents.</p>
        </div>

        <div className="p-12 rounded-3xl bg-[#0F1424] border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Courses Generated Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload your document in <strong>My Documents</strong> and click <strong>Process Full Course</strong> to generate custom chapters, lessons, and revision flashcards for that specific file.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('documents')}
            className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Go to Documents
          </button>
        </div>
      </div>
    );
  }

  const keyTopics = activeCourse.modules?.flatMap(m => m.lessons.map(l => l.title)).slice(0, 9) || [];
  const chapters = activeCourse.modules?.flatMap((m, mIdx) => 
    m.lessons.map((l, lIdx) => ({
      id: l.id,
      num: mIdx * 10 + lIdx + 1,
      title: l.title,
      completed: l.isCompleted || false
    }))
  ) || [];

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Course Title Header with Export Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-white">
          {activeCourse?.title || 'Course Syllabus'}
        </h1>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-[#0F1424] hover:bg-[#131B32] border border-white/[0.1] hover:border-indigo-500/40 text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span>Export Course Notes</span>
        </button>
      </div>

      {/* Course Subtabs matching Screen 4, 5, 6, 7, 9 */}
      <div className="flex items-center gap-6 border-b border-white/[0.08] text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'summary', label: 'Summary' },
          { id: 'flashcards', label: 'Flashcards' },
          { id: 'quizzes', label: 'Quizzes' },
          { id: 'notes', label: 'Notes' },
          { id: 'lessons', label: 'Lessons' },
        ].map((tab) => {
          const isActive = courseSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setCourseSubTab(tab.id as any);
                if (tab.id === 'summary') setActiveTab('summaries');
                else if (tab.id === 'flashcards') setActiveTab('flashcards');
                else if (tab.id === 'quizzes') setActiveTab('quizzes');
                else if (tab.id === 'lessons') setActiveTab('lessons');
                else if (tab.id === 'notes') setActiveTab('revision-planner');
                else setActiveTab('courses');
              }}
              className={`pb-3 transition-colors relative cursor-pointer ${
                isActive
                  ? 'text-indigo-400 font-bold border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Generated Course Overview Card Matching Screen 4 */}
      <div className="p-6 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-md space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
          Generated Course Overview
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Laptop Code Icon Box */}
          <div className="w-24 h-20 rounded-xl bg-[#070A13] border border-white/[0.08] flex flex-col items-center justify-center text-white shrink-0 shadow-md">
            <Laptop className="w-6 h-6 text-indigo-400" />
            <span className="font-mono text-xs font-bold text-indigo-400 mt-1">&lt;/&gt;</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white">
              {activeCourse?.title}
            </h3>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              A comprehensive course generated from your document covering fundamental and advanced concepts with AI-powered explanations.
            </p>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 text-xs font-semibold">
                <BookOpen className="w-3.5 h-3.5" />
                12 Lessons
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/15 text-orange-300 border border-orange-500/30 text-xs font-semibold">
                <Layers className="w-3.5 h-3.5" />
                85 Flashcards
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-semibold">
                <HelpCircle className="w-3.5 h-3.5" />
                10 Quizzes
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-500/15 text-pink-300 border border-pink-500/30 text-xs font-semibold">
                <FileCode className="w-3.5 h-3.5" />
                Revision Notes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters / Lessons & Key Topics Layout Matching Screen 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Chapters / Lessons */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-md space-y-3">
          <h2 className="text-sm font-bold text-white">Chapters / Lessons</h2>

          <div className="space-y-2">
            {chapters.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  setSelectedLessonId(ch.id);
                  setCourseSubTab('lessons');
                  setActiveTab('lessons');
                }}
                className="p-3 rounded-xl border border-white/[0.05] bg-[#0A0E1A]/60 hover:bg-[#131B32] hover:border-indigo-500/30 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-white/[0.08] text-slate-200 flex items-center justify-center font-bold text-xs">
                    {ch.num}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{ch.title}</span>
                </div>

                {ch.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Topics */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-md space-y-3">
          <h2 className="text-sm font-bold text-white">Key Topics</h2>

          <div className="grid grid-cols-3 gap-2">
            {keyTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCourseSubTab('flashcards');
                  setActiveTab('flashcards');
                }}
                className="p-2 rounded-xl bg-[#0A0E1A]/60 hover:bg-indigo-950/40 border border-white/[0.06] hover:border-indigo-500/40 text-center text-xs font-medium text-slate-300 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* File Export Modal */}
      <FileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={activeCourse?.title || 'Course Notes'}
        exportType="course"
        course={activeCourse}
      />
    </div>
  );
};
