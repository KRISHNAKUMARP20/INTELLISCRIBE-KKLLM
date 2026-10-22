import React, { useState } from 'react';
import {
  Download,
  BookOpen
} from 'lucide-react';
import { Summary } from '../../types';
import { FileExportModal } from '../../components/common/FileExportModal';

interface SummaryViewProps {
  summary?: any;
  activeDoc?: any;
  documentTitle: string;
  courseSubTab?: string;
  setCourseSubTab?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  summary,
  activeDoc,
  documentTitle,
  courseSubTab = 'summary',
  setCourseSubTab,
  setActiveTab,
}) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Extract executive summary text from summary object or uploaded document item
  const overviewText = summary?.executiveSummary || summary?.overview || activeDoc?.summaryText;
  const keyTakeaways: string[] = (summary?.keyTakeaways && summary.keyTakeaways.length > 0)
    ? summary.keyTakeaways
    : (activeDoc?.keyTakeaways || []);

  if (!overviewText) {
    return (
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Summary</h1>
          <p className="text-xs text-slate-400 mt-1">AI-synthesized summaries of your uploaded files.</p>
        </div>

        <div className="p-12 rounded-3xl bg-[#0F1424] border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Summary Generated Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload your PDF or notes in <strong>My Documents</strong> to automatically extract key concepts and executive takeaways strictly from that document.
            </p>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('documents')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              Go to Documents
            </button>
          )}
        </div>
      </div>
    );
  }

  const importantConcepts = keyTakeaways.map((t: string, idx: number) => ({
    title: `Key Point ${idx + 1}`,
    desc: t,
  }));

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{documentTitle}</h1>
      </div>

      {/* Subtabs Bar matching Screen 5 */}
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
            const isActive = tab.id === 'summary';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCourseSubTab(tab.id);
                  if (tab.id === 'overview') setActiveTab('courses');
                  else if (tab.id === 'flashcards') setActiveTab('flashcards');
                  else if (tab.id === 'quizzes') setActiveTab('quizzes');
                  else if (tab.id === 'lessons') setActiveTab('lessons');
                  else if (tab.id === 'notes') setActiveTab('revision-planner');
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

      {/* Two Column Layout matching Screen 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: AI Generated Summary & Key Takeaways */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-5">
          <h2 className="text-sm font-bold text-white">AI Generated Summary</h2>

          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {overviewText}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-indigo-400">Key Takeaways</h3>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside leading-relaxed">
              {keyTakeaways.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download Summary
            </button>
          </div>
        </div>

        {/* Right Section: Important Concepts */}
        <div className="p-6 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-xl space-y-3">
          <h2 className="text-sm font-bold text-white">Important Concepts</h2>

          <div className="space-y-2.5">
            {importantConcepts.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-white/[0.05] bg-[#0A0E1A]/60 hover:bg-[#131B32] transition-colors flex items-start gap-3"
              >
                <div className={`w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0`}>
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* File Export Modal */}
      <FileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={documentTitle}
        exportType="summary"
        summary={summary}
      />
    </div>
  );
};
