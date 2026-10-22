import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Layers, HelpCircle, FileText, ArrowRight } from 'lucide-react';
import { Course, DocumentItem, Flashcard, Quiz } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  documents: DocumentItem[];
  courses: Course[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  setSelectedDocId: (id: string) => void;
  setSelectedCourseId: (id: string) => void;
  setSelectedLessonId: (id: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  documents,
  courses,
  flashcards,
  quizzes,
  setSelectedDocId,
  setSelectedCourseId,
  setSelectedLessonId,
}) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const items: {
      type: 'document' | 'lesson' | 'flashcard' | 'quiz';
      title: string;
      subtitle: string;
      action: () => void;
    }[] = [];

    // Documents
    documents.forEach((d) => {
      if (d.title.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q))) {
        items.push({
          type: 'document',
          title: d.title,
          subtitle: `${d.fileType.toUpperCase()} • ${d.pageCount} pages`,
          action: () => {
            setSelectedDocId(d.id);
            setActiveTab('documents');
            onClose();
          },
        });
      }
    });

    // Courses & Lessons
    courses.forEach((c) => {
      c.modules.forEach((m) => {
        m.lessons.forEach((l) => {
          if (l.title.toLowerCase().includes(q) || l.keyConcepts.some((k) => k.toLowerCase().includes(q))) {
            items.push({
              type: 'lesson',
              title: l.title,
              subtitle: `Course: ${c.code} • ${l.durationMinutes} min read`,
              action: () => {
                setSelectedCourseId(c.id);
                setSelectedLessonId(l.id);
                setActiveTab('lessons');
                onClose();
              },
            });
          }
        });
      });
    });

    // Flashcards
    flashcards.forEach((f) => {
      if (f.front.toLowerCase().includes(q) || f.back.toLowerCase().includes(q) || f.tag.toLowerCase().includes(q)) {
        items.push({
          type: 'flashcard',
          title: f.front,
          subtitle: `Tag: ${f.tag} • Box ${f.box}`,
          action: () => {
            setSelectedDocId(f.documentId);
            setActiveTab('flashcards');
            onClose();
          },
        });
      }
    });

    // Quizzes
    quizzes.forEach((quiz) => {
      if (quiz.title.toLowerCase().includes(q)) {
        items.push({
          type: 'quiz',
          title: quiz.title,
          subtitle: `${quiz.difficulty} • ${quiz.questions.length} questions`,
          action: () => {
            setSelectedDocId(quiz.documentId);
            setActiveTab('quizzes');
            onClose();
          },
        });
      }
    });

    return items.slice(0, 8);
  }, [query, documents, courses, flashcards, quizzes, setSelectedDocId, setSelectedCourseId, setSelectedLessonId, setActiveTab, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, lessons, flashcards, formulas..."
            className="w-full bg-transparent border-0 text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-96 overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              Type keywords from your uploaded documents to find lessons, cards, and summaries.
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs">
              No matching knowledge items found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-800/80 flex items-center justify-between group transition-colors"
                >
                  <div className="flex items-center gap-3 truncate mr-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 border border-slate-700">
                      {item.type === 'document' && <FileText className="w-4 h-4 text-blue-400" />}
                      {item.type === 'lesson' && <BookOpen className="w-4 h-4 text-indigo-400" />}
                      {item.type === 'flashcard' && <Layers className="w-4 h-4 text-amber-400" />}
                      {item.type === 'quiz' && <HelpCircle className="w-4 h-4 text-rose-400" />}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-200 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-slate-950/80 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 px-4">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 font-mono text-[10px]">
              ESC to close
            </kbd>
          </div>
          <span>IntelliScribe Global Knowledge Index</span>
        </div>
      </div>
    </div>
  );
};
