import React, { useState } from 'react';
import {
  Download,
  FileText,
  FileCode,
  Sparkles,
  BookOpen,
  Layers,
  Check,
  Copy,
  Printer,
  Share2,
  ExternalLink,
  Award,
  Clock,
  ChevronRight,
  Eye
} from 'lucide-react';
import { Course, DocumentItem, Flashcard, Summary } from '../../types';
import {
  downloadFile,
  generateSummaryMarkdown,
  generateCourseNotesMarkdown,
  generateFlashcardsMarkdown,
  exportSummaryPdf,
  exportCourseNotesPdf
} from '../../services/exportService';

interface ExportsViewProps {
  documents: DocumentItem[];
  courses: Course[];
  summaries: Summary[];
  flashcards: Flashcard[];
  selectedDocId: string;
  setSelectedDocId: (id: string) => void;
  awardXp: (amount: number, reason: string) => void;
}

export const ExportsView: React.FC<ExportsViewProps> = ({
  documents,
  courses,
  summaries,
  flashcards,
  selectedDocId,
  setSelectedDocId,
  awardXp,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'summary' | 'course' | 'flashcards'>('summary');

  const activeDoc = documents.find((d) => d.id === selectedDocId) || documents[0];
  const activeCourse = courses.find((c) => c.documentId === activeDoc?.id) || courses[0];
  const activeSummary = summaries.find((s) => s.documentId === activeDoc?.id) || summaries[0];
  const activeCards = flashcards.filter((f) => f.documentId === activeDoc?.id);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportSummaryPdf = () => {
    if (!activeSummary) return;
    exportSummaryPdf(activeSummary, activeDoc?.title || 'Document');
    awardXp(25, 'Exported Executive Summary PDF');
  };

  const handleExportSummaryMd = () => {
    if (!activeSummary) return;
    const md = generateSummaryMarkdown(activeSummary, activeDoc?.title || 'Document');
    downloadFile(md, `${activeDoc?.title.replace(/\s+/g, '_')}_summary.md`, 'text/markdown');
    awardXp(20, 'Exported Executive Summary Markdown');
  };

  const handleExportCoursePdf = () => {
    if (!activeCourse) return;
    exportCourseNotesPdf(activeCourse, activeDoc?.title || 'Course');
    awardXp(35, 'Exported Complete Course Notes PDF');
  };

  const handleExportCourseMd = () => {
    if (!activeCourse) return;
    const md = generateCourseNotesMarkdown(activeCourse, activeDoc?.title || 'Course');
    downloadFile(md, `${activeCourse.code}_${activeCourse.title.replace(/\s+/g, '_')}_notes.md`, 'text/markdown');
    awardXp(25, 'Exported Complete Course Notes Markdown');
  };

  const handleExportFlashcardsMd = () => {
    const md = generateFlashcardsMarkdown(activeCards, activeDoc?.title || 'Deck');
    downloadFile(md, `${activeDoc?.title.replace(/\s+/g, '_')}_flashcards.md`, 'text/markdown');
    awardXp(20, 'Exported Flashcards Markdown');
  };

  const handleExportFlashcardsAnki = () => {
    const lines = activeCards.map((f) => `"${f.front.replace(/"/g, '""')}"\t"${f.back.replace(/"/g, '""')}"\t"${f.tag}"`);
    const text = lines.join('\n');
    downloadFile(text, `${activeDoc?.title.replace(/\s+/g, '_')}_anki_deck.tsv`, 'text/tab-separated-values');
    awardXp(25, 'Exported Anki Deck');
  };

  const summaryMarkdownPreview = activeSummary
    ? generateSummaryMarkdown(activeSummary, activeDoc?.title || 'Document')
    : '';
  const courseMarkdownPreview = activeCourse
    ? generateCourseNotesMarkdown(activeCourse, activeDoc?.title || 'Course')
    : '';

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header and Document Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            EXPORT SUITE & PUBLISHING
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5">Document & Study Notes Exporter</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Download publication-grade PDFs and clean Markdown files for offline studying, printing, or external note apps.
          </p>
        </div>

        {/* Source Document Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400">Target Document:</label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
          >
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3 Main Export Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Executive Summary */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-indigo-500/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Summary Module
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
              Executive Summary & Invariants
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Formatted overview featuring executive synthesis, high-yield takeaways, core theorems with formulas, and mindmap outline.
            </p>

            <div className="text-[11px] text-slate-500">
              Includes {activeSummary?.keyTakeaways.length || 0} takeaways & {activeSummary?.coreTheorems.length || 0} theorems.
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleExportSummaryPdf}
              className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF Report
            </button>
            <button
              onClick={handleExportSummaryMd}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-indigo-400" />
              Download Markdown (.md)
            </button>
          </div>
        </div>

        {/* Card 2: Complete Course Study Notes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-purple-500/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Course Syllabus
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
              Comprehensive Course Notes
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Complete academic study guide covering all synthesized modules, lessons, deep-dive notes, and audio transcripts.
            </p>

            <div className="text-[11px] text-slate-500">
              {activeCourse?.modules.length || 0} modules •{' '}
              {activeCourse?.modules.reduce((a, m) => a + m.lessons.length, 0) || 0} lessons total.
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleExportCoursePdf}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-purple-600/30 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Download Full Course PDF
            </button>
            <button
              onClick={handleExportCourseMd}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-purple-400" />
              Download Markdown (.md)
            </button>
          </div>
        </div>

        {/* Card 3: Spaced Repetition Flashcards */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between hover:border-amber-500/40 transition-colors group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Flashcard Deck
              </span>
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              Spaced Repetition Decks
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Export high-yield flashcard decks with questions, answers, and hints for Anki or your favorite spaced repetition tool.
            </p>

            <div className="text-[11px] text-slate-500">
              {activeCards.length} flashcards in current document queue.
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={handleExportFlashcardsAnki}
              className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-amber-600/30 transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              Export to Anki (.tsv)
            </button>
            <button
              onClick={handleExportFlashcardsMd}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <FileCode className="w-3.5 h-3.5 text-amber-400" />
              Download Markdown (.md)
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-400" />
              <span>Live Export Document Preview</span>
            </h3>
            <p className="text-xs text-slate-400">
              Inspect the exact formatted text and structure generated before initiating download.
            </p>
          </div>

          {/* Preview Mode Selector */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setPreviewMode('summary')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                previewMode === 'summary'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Summary Preview
            </button>
            <button
              onClick={() => setPreviewMode('course')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                previewMode === 'course'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Course Notes Preview
            </button>
            <button
              onClick={() => setPreviewMode('flashcards')}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                previewMode === 'flashcards'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flashcards Preview
            </button>
          </div>
        </div>

        {/* Preview Container */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-96 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-text">
          {previewMode === 'summary' && summaryMarkdownPreview}
          {previewMode === 'course' && courseMarkdownPreview}
          {previewMode === 'flashcards' && generateFlashcardsMarkdown(activeCards, activeDoc?.title || 'Deck')}
        </div>

        {/* Copy shortcut */}
        <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
          <span>Ready to copy into Obsidian, Notion, Logseq, or Typora</span>
          <button
            onClick={() =>
              handleCopy(
                previewMode === 'summary'
                  ? summaryMarkdownPreview
                  : previewMode === 'course'
                  ? courseMarkdownPreview
                  : generateFlashcardsMarkdown(activeCards, activeDoc?.title || 'Deck'),
                previewMode
              )
            }
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedKey === previewMode ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Raw Markdown</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
