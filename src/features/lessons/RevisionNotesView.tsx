import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  BookOpen,
  FileText
} from 'lucide-react';
import { Course, Summary } from '../../types';
import { FileExportModal } from '../../components/common/FileExportModal';

interface RevisionNotesViewProps {
  course?: Course;
  summary?: Summary;
  documentTitle?: string;
  courseSubTab?: string;
  setCourseSubTab?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
}

export const RevisionNotesView: React.FC<RevisionNotesViewProps> = ({
  course,
  summary,
  documentTitle,
  setCourseSubTab,
  setActiveTab,
}) => {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Derive dynamic sections strictly from course lessons or summary
  const lessons = course?.modules?.flatMap(m => m.lessons) || [];

  const sections = lessons.length > 0
    ? lessons.map((l, idx) => ({
        num: idx + 1,
        title: l.title,
        notes: l.keyConcepts && l.keyConcepts.length > 0 
          ? l.keyConcepts 
          : [l.contentMarkdown.slice(0, 160) || 'Key lesson takeaway from uploaded document.'],
        deepDive: l.deepDiveNotes || l.contentMarkdown || '',
      }))
    : (summary?.keyTakeaways && summary.keyTakeaways.length > 0
        ? summary.keyTakeaways.map((takeaway, idx) => ({
            num: idx + 1,
            title: `Key Takeaway ${idx + 1}`,
            notes: [takeaway],
            deepDive: summary.executiveSummary,
          }))
        : []);

  const currentSection = sections[activeSection] || sections[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const docTitle = documentTitle || course?.title || summary?.title || 'Course Revision Notes';

  if (sections.length === 0) {
    return (
      <div className="p-6 sm:p-8 space-y-6 max-w-5xl mx-auto text-slate-100">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Revision Notes</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Concise notes generated for quick revision.
            </p>
          </div>
        </div>

        <div className="p-12 rounded-3xl bg-[#0F1424] border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Notes Generated Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload your document in <strong>My Documents</strong> to automatically extract study notes, core formulas, and key revision concepts.
            </p>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('documents')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              Go to Documents
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Title & Download Notes Button */}
      <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{docTitle}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Concise notes generated from your uploaded document for quick revision.
          </p>
        </div>

        <button
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Download Notes
        </button>
      </div>

      {/* Subtabs Bar matching Screen 9 */}
      {setCourseSubTab && setActiveTab && (
        <div className="flex items-center gap-6 border-b border-white/[0.08] text-xs font-semibold">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'summary', label: 'Summary' },
            { id: 'flashcards', label: 'Flashcards' },
            { id: 'quizzes', label: 'Quizzes' },
            { id: 'notes', label: 'Notes' },
            { id: 'lessons', label: 'Lessons' },
          ].map((tab) => {
            const isActive = tab.id === 'notes';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCourseSubTab(tab.id);
                  if (tab.id === 'overview') setActiveTab('courses');
                  else if (tab.id === 'summary') setActiveTab('summaries');
                  else if (tab.id === 'flashcards') setActiveTab('flashcards');
                  else if (tab.id === 'quizzes') setActiveTab('quizzes');
                  else if (tab.id === 'lessons') setActiveTab('lessons');
                }}
                className={`pb-3 transition-colors cursor-pointer ${
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
      )}

      {/* Two Columns Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Dynamic Table of Contents */}
        <div className="p-4 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 px-2 py-1">
            Table of Contents
          </h2>
          <div className="space-y-1">
            {sections.map((s, idx) => {
              const isSelected = activeSection === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveSection(idx)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <span className={`font-mono text-[11px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>{s.num}</span>
                  <span className="truncate">{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Note Content */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              {currentSection.num}. {currentSection.title}
            </h2>
          </div>

          {/* Quick Notes Bullet points from dynamic document */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Quick Notes
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
              {currentSection.notes.map((bullet, bIdx) => (
                <li key={bIdx}>{bullet}</li>
              ))}
            </ul>
          </div>

          {/* Detailed Document Insights / Key Concepts */}
          {currentSection.deepDive && (
            <div className="space-y-3 pt-4 border-t border-white/[0.08]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Detailed Notes &amp; Concept Reference
                </h3>
                <button
                  onClick={() => handleCopy(currentSection.deepDive)}
                  className="px-2.5 py-1 rounded-lg bg-[#070A13] hover:bg-white/[0.08] border border-white/[0.1] text-slate-300 text-[10px] font-sans flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Notes'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#070A13] border border-white/[0.08] text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {currentSection.deepDive}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Export Modal */}
      <FileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={docTitle}
        exportType="notes"
      />
    </div>
  );
};
