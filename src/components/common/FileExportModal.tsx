import React, { useState } from 'react';
import {
  X,
  FileText,
  FileCode,
  Download,
  CheckCircle2,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Course, Summary } from '../../types';
import {
  exportSummaryPdf,
  exportCourseNotesPdf,
  generateSummaryMarkdown,
  generateCourseNotesMarkdown,
  downloadFile
} from '../../services/exportService';

export interface FileExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  exportType: 'summary' | 'course' | 'notes';
  summary?: Summary;
  course?: Course;
  onSuccess?: (format: 'pdf' | 'markdown') => void;
}

export const FileExportModal: React.FC<FileExportModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  exportType,
  summary,
  course,
  onSuccess,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'markdown'>('pdf');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState('');
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const handleStartExport = () => {
    setIsExporting(true);
    setIsDone(false);
    setExportStep('Parsing structure & formatting content...');

    setTimeout(() => {
      setExportStep(
        selectedFormat === 'pdf'
          ? 'Rendering typography, badges & PDF vector pages...'
          : 'Compiling structured Markdown syntax...'
      );

      setTimeout(() => {
        setExportStep('Finalizing download...');

        // Execute download
        if (selectedFormat === 'pdf') {
          if (exportType === 'course' && course) {
            exportCourseNotesPdf(course, documentTitle);
          } else if (summary) {
            exportSummaryPdf(summary, documentTitle);
          } else if (course) {
            exportCourseNotesPdf(course, documentTitle);
          }
        } else {
          // Markdown export
          let md = '';
          let filename = '';
          if (exportType === 'course' && course) {
            md = generateCourseNotesMarkdown(course, documentTitle);
            filename = `${course.code || 'Course'}_Notes.md`;
          } else if (summary) {
            md = generateSummaryMarkdown(summary, documentTitle);
            filename = `${documentTitle.replace(/\s+/g, '_')}_Summary.md`;
          } else if (course) {
            md = generateCourseNotesMarkdown(course, documentTitle);
            filename = `${course.code || 'Course'}_Notes.md`;
          } else {
            md = `# ${documentTitle}\n\nExported from IntelliScribe.`;
            filename = `${documentTitle.replace(/\s+/g, '_')}.md`;
          }
          downloadFile(md, filename, 'text/markdown');
        }

        setIsExporting(false);
        setIsDone(true);
        if (onSuccess) onSuccess(selectedFormat);

        setTimeout(() => {
          setIsDone(false);
          onClose();
        }, 1200);
      }, 700);
    }, 600);
  };

  const handleClose = () => {
    if (isExporting) return;
    setIsDone(false);
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0F1424] border border-white/[0.1] rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6 text-slate-100">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Export Document</h2>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 font-bold border border-indigo-500/30">
                {exportType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 line-clamp-1">
              Source: <strong className="text-white">{documentTitle}</strong>
            </p>
          </div>

          <button
            onClick={handleClose}
            disabled={isExporting}
            className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selection Cards */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Choose Export Format
          </label>

          <div className="grid grid-cols-2 gap-3">
            {/* Option 1: PDF */}
            <div
              onClick={() => !isExporting && setSelectedFormat('pdf')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedFormat === 'pdf'
                  ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                  : 'border-white/[0.08] hover:border-indigo-500/30 bg-[#0A0E1A]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                {selectedFormat === 'pdf' && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-white">PDF Document</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Styled, formatted & printable (.pdf)
                </div>
              </div>
            </div>

            {/* Option 2: Markdown */}
            <div
              onClick={() => !isExporting && setSelectedFormat('markdown')}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                selectedFormat === 'markdown'
                  ? 'border-indigo-500 bg-indigo-500/15 shadow-md shadow-indigo-500/10'
                  : 'border-white/[0.08] hover:border-indigo-500/30 bg-[#0A0E1A]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <FileCode className="w-5 h-5" />
                </div>
                {selectedFormat === 'markdown' && (
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                )}
              </div>

              <div>
                <div className="text-xs font-bold text-white">Markdown File</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Obsidian & Notion ready (.md)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Spinner State */}
        {isExporting && (
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-3 animate-in fade-in">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin shrink-0" />
            <div className="text-xs">
              <div className="font-bold text-white">Generating {selectedFormat.toUpperCase()}</div>
              <div className="text-[11px] text-slate-400">{exportStep}</div>
            </div>
          </div>
        )}

        {/* Success Banner */}
        {isDone && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300 font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Download initiated! File saved successfully.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartExport}
            disabled={isExporting || isDone}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Exporting...</span>
              </>
            ) : isDone ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completed</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export {selectedFormat.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
