import React, { useState } from 'react';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download
} from 'lucide-react';
import { Flashcard } from '../../types';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  documentTitle: string;
  reviewFlashcard: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  awardXp: (amount: number, reason: string) => void;
  courseSubTab?: string;
  setCourseSubTab?: (tab: any) => void;
  setActiveTab?: (tab: any) => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  flashcards,
  documentTitle,
  reviewFlashcard,
  awardXp,
  setCourseSubTab,
  setActiveTab,
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string>('All Cards');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Compute actual dynamic topics from uploaded flashcards
  const tagsMap: Record<string, number> = {};
  flashcards.forEach((fc) => {
    const t = fc.tag || 'General';
    tagsMap[t] = (tagsMap[t] || 0) + 1;
  });

  const topics = [
    { name: 'All Cards', count: flashcards.length },
    ...Object.entries(tagsMap).map(([name, count]) => ({ name, count })),
  ];

  const filteredCards = selectedTopic === 'All Cards'
    ? flashcards
    : flashcards.filter((f) => (f.tag || 'General') === selectedTopic);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  };

  const handleRate = (rating: 'again' | 'easy') => {
    if (currentCard) {
      reviewFlashcard(currentCard.id, rating === 'again' ? 'again' : 'easy');
    }
    handleNext();
  };

  if (flashcards.length === 0) {
    return (
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Flashcards</h1>
          <p className="text-xs text-slate-400 mt-1">Review your flashcards using spaced repetition.</p>
        </div>

        <div className="p-12 rounded-3xl bg-[#0F1424] border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Flashcards Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload your document in <strong>My Documents</strong> to automatically generate flashcards for your syllabus.
            </p>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('documents')}
              className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer"
            >
              Upload Document
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-6xl mx-auto text-slate-100">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">{documentTitle || 'My Flashcards'}</h1>
      </div>

      {/* Subtabs Bar matching Screen 6 */}
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
            const isActive = tab.id === 'flashcards';
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCourseSubTab(tab.id);
                  if (tab.id === 'overview') setActiveTab('courses');
                  else if (tab.id === 'summary') setActiveTab('summaries');
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

      {/* Main Flashcard & Topics Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section: Flashcard Viewer */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-white">Flashcards ({filteredCards.length} cards)</h2>

          {/* Card Container with Left/Right Arrows */}
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-[#0F1424] border border-white/[0.1] hover:bg-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white shrink-0 shadow-xs cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Flashcard Box */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="flex-1 min-h-[260px] p-8 rounded-2xl bg-[#0F1424] border border-white/[0.08] hover:border-indigo-500/30 shadow-xl flex flex-col items-center justify-between cursor-pointer select-none relative transition-all"
            >
              <div className="w-full text-right text-xs text-slate-500 font-mono">
                {currentIndex + 1} / {filteredCards.length}
              </div>

              <div className="text-center px-4 my-auto">
                <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                  {isFlipped ? currentCard?.back : currentCard?.front}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlipped(!isFlipped);
                }}
                className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
              >
                Flip Card
              </button>
            </div>

            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-[#0F1424] border border-white/[0.1] hover:bg-white/[0.08] flex items-center justify-center text-slate-300 hover:text-white shrink-0 shadow-xs cursor-pointer transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Rating Buttons */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <button
              onClick={() => handleRate('again')}
              className="px-6 py-2 rounded-xl border border-rose-500/30 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Difficult</span>
            </button>

            <button
              onClick={() => handleRate('easy')}
              className="px-6 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Easy</span>
            </button>
          </div>
        </div>

        {/* Right Section: Topics Sidebar */}
        <div className="p-5 rounded-2xl bg-[#0F1424] border border-white/[0.08] shadow-md space-y-3">
          <h2 className="text-sm font-bold text-white">Topics</h2>

          <div className="space-y-1">
            {topics.map((t) => {
              const isSelected = selectedTopic === t.name;
              return (
                <button
                  key={t.name}
                  onClick={() => {
                    setSelectedTopic(t.name);
                    setCurrentIndex(0);
                    setIsFlipped(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-300 hover:bg-[#131B32] hover:text-white'
                  }`}
                >
                  <span>{t.name}</span>
                  <span className={`text-[11px] ${isSelected ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
