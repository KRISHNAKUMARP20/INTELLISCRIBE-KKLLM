import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  AlertTriangle,
  Award,
  Zap,
  Flame,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { Quiz } from '../../types';
import confetti from 'canvas-confetti';

interface QuizViewProps {
  quizzes: Quiz[];
  selectedQuizId: string;
  setSelectedQuizId: (id: string) => void;
  awardXp: (amount: number, reason: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  quizzes,
  selectedQuizId,
  awardXp,
}) => {
  const activeQuiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(10 * 60);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [failedAttempt, setFailedAttempt] = useState(false);
  const [failedQuestionIndex, setFailedQuestionIndex] = useState<number>(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctStreak, setCorrectStreak] = useState(0);

  // Timer countdown
  useEffect(() => {
    if (quizCompleted || failedAttempt) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [quizCompleted, failedAttempt]);

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // If no quizzes exist
  if (!activeQuiz || activeQuiz.questions.length === 0) {
    return (
      <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 text-slate-100">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Sudden-Death Quizzes</h1>
          <p className="text-xs text-slate-400 mt-1">Assess your syllabus mastery with 1-attempt precision.</p>
        </div>

        <div className="p-12 rounded-3xl bg-[#0F1424] border border-white/[0.08] text-center flex flex-col items-center justify-center space-y-3 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white">No Quizzes Generated Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm">
              Upload your document in <strong>My Documents</strong> to automatically generate interactive practice quizzes for your syllabus.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = activeQuiz.questions[currentIdx];
  const isCorrect = selectedOpt === currentQ.correctAnswerIndex;

  // Single-Attempt Logic: If wrong, restart from Question 1!
  const handleSubmitAnswer = () => {
    if (selectedOpt === null) return;
    setAnswerSubmitted(true);

    if (isCorrect) {
      // User got it right!
      setCorrectStreak((prev) => prev + 1);
    } else {
      // User got it WRONG! Sudden Death triggered!
      setFailedQuestionIndex(currentIdx);
      setFailedAttempt(true);
    }
  };

  // Continue to next question or complete
  const handleNext = () => {
    if (currentIdx < activeQuiz.questions.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOpt(null);
      setAnswerSubmitted(false);
    } else {
      // Finished all questions with 100% accuracy!
      setQuizCompleted(true);
      awardXp(100, 'Flawless Quiz Mastery');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  // Restart from Question 1 after a wrong answer
  const handleRestartFromBeginning = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setAnswerSubmitted(false);
    setFailedAttempt(false);
    setCorrectStreak(0);
    setSecondsLeft(10 * 60);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-4xl mx-auto text-slate-100 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {activeQuiz.title}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              1 Attempt • Sudden Death
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Rule: 100% accuracy required. If you make 1 mistake, you restart from Question 1!
          </p>
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {/* Streak pill */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>Streak: {correctStreak}/{activeQuiz.questions.length}</span>
          </div>

          {/* Time Left Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-300 font-mono text-xs font-bold">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>
        </div>
      </div>

      {/* Multi-Quiz Document Selector if multiple quizzes exist */}
      {quizzes.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0">Your Quizzes:</span>
          {quizzes.map((qz) => (
            <button
              key={qz.id}
              onClick={() => {
                setSelectedQuizId(qz.id);
                setCurrentIdx(0);
                setSelectedOpt(null);
                setAnswerSubmitted(false);
                setFailedAttempt(false);
                setQuizCompleted(false);
                setCorrectStreak(0);
                setSecondsLeft(10 * 60);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                qz.id === activeQuiz.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                  : 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {qz.title}
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-[#0A0E1A] h-2 rounded-full overflow-hidden border border-white/[0.06]">
        <div
          className="bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 h-full transition-all duration-300"
          style={{ width: `${((currentIdx + (answerSubmitted && isCorrect ? 1 : 0)) / activeQuiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Sudden Death Failure Modal / Alert */}
      {failedAttempt && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border-2 border-rose-500/40 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-600/40">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Wrong Answer on Question {failedQuestionIndex + 1}!</h3>
              <p className="text-xs text-rose-200 mt-0.5">
                Single Attempt Rule: You answered Question {failedQuestionIndex + 1} incorrectly. You must restart from Question 1 to master this material.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A0E1A]/80 border border-white/[0.08] text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Explanation &amp; Grounded Key:</span>
            <p className="text-emerald-300 font-medium">
              Correct Answer: Option {String.fromCharCode(65 + currentQ.correctAnswerIndex)} — {currentQ.options[currentQ.correctAnswerIndex]}
            </p>
            <p className="text-slate-400 text-[11px] pt-1">{currentQ.explanation}</p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={handleRestartFromBeginning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart from Question 1</span>
            </button>
          </div>
        </div>
      )}

      {/* Quiz Completion Victory Card */}
      {quizCompleted && (
        <div className="p-8 rounded-3xl bg-[#0F1424] border border-emerald-500/40 shadow-2xl text-center space-y-4 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">Flawless 100% Mastery!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              You answered every single question correctly on the first attempt without failing. +100 XP awarded!
            </p>
          </div>
          <button
            onClick={handleRestartFromBeginning}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            Retake Quiz
          </button>
        </div>
      )}

      {/* Question Card */}
      {!failedAttempt && !quizCompleted && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F1424] border border-white/[0.08] shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Question {currentIdx + 1} of {activeQuiz.questions.length}
            </span>
            <span className="text-[11px] font-semibold text-slate-400">
              {currentQ.conceptTag || 'Core Concept'}
            </span>
          </div>

          <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
            {currentQ.question}
          </h2>

          {/* Vertical Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt, optIdx) => {
              const letter = String.fromCharCode(65 + optIdx);
              const isSelected = selectedOpt === optIdx;
              const isOptCorrect = optIdx === currentQ.correctAnswerIndex;

              let cardStyle = 'border-white/[0.06] bg-[#0A0E1A]/80 text-slate-200 hover:bg-[#131B32] hover:border-indigo-500/30';
              if (answerSubmitted) {
                if (isOptCorrect) {
                  cardStyle = 'border-emerald-500/80 bg-emerald-500/15 text-emerald-100 font-semibold shadow-lg shadow-emerald-500/15';
                } else if (isSelected && !isOptCorrect) {
                  cardStyle = 'border-rose-500/80 bg-rose-500/20 text-rose-100 font-semibold shadow-lg shadow-rose-500/15';
                }
              } else if (isSelected) {
                cardStyle = 'border-indigo-500 bg-indigo-600/20 text-white font-semibold shadow-md shadow-indigo-500/15';
              }

              return (
                <button
                  key={optIdx}
                  disabled={answerSubmitted}
                  onClick={() => setSelectedOpt(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${cardStyle}`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        answerSubmitted && isOptCorrect
                          ? 'bg-emerald-600 text-white'
                          : answerSubmitted && isSelected && !isOptCorrect
                          ? 'bg-rose-600 text-white'
                          : isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white/[0.08] text-slate-300'
                      }`}
                    >
                      {letter}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>

                  {answerSubmitted && isOptCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {answerSubmitted && isSelected && !isOptCorrect && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Rationale / Explanation if answer submitted and correct */}
          {answerSubmitted && isCorrect && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200 space-y-1 animate-in fade-in">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" /> Correct!
              </span>
              <p className="text-[11px] text-slate-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Submit / Next Button Bar */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              {currentQ.hint ? `💡 Hint: ${currentQ.hint}` : 'Select your answer carefully.'}
            </span>

            {!answerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOpt === null}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
              >
                Submit Answer
              </button>
            ) : isCorrect ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 cursor-pointer active:scale-95"
              >
                <span>{currentIdx < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
