import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Bot,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  Award,
  Download
} from 'lucide-react';
import { Course, Lesson } from '../../types';
import { ActiveTab } from '../../store/useAppStore';
import { FileExportModal } from '../../components/common/FileExportModal';

interface LessonViewerProps {
  course: Course;
  lesson?: Lesson;
  setSelectedLessonId: (id: string) => void;
  completeLesson: (id: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
  sendTutorMessage: (text: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  course,
  lesson,
  setSelectedLessonId,
  completeLesson,
  setActiveTab,
  sendTutorMessage,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [showDeepDive, setShowDeepDive] = useState(true);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Audio timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio && lesson) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= lesson.audioDurationSeconds) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio, playbackSpeed, lesson]);

  if (!lesson) {
    return (
      <div className="p-12 text-center text-slate-400">
        No lesson selected. Please choose a lesson from the syllabus.
      </div>
    );
  }

  // Find previous and next lessons
  const allLessons = course.modules.flatMap((m) => m.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAskTutor = () => {
    sendTutorMessage(`Can you explain the key concepts in lesson "${lesson.title}" and give me a practical intuition?`);
    setActiveTab('ai-tutor');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Navigation & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('courses')}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            {course.code} Syllabus
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-semibold text-indigo-400 truncate max-w-xs sm:max-w-md">
            {lesson.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Notes (PDF/MD)</span>
          </button>
          <button
            onClick={() => completeLesson(lesson.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              lesson.completed
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lesson.completed ? 'Mastered (+50 XP)' : 'Mark Completed (+50 XP)'}
          </button>
        </div>
      </div>

      {/* Lesson Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {lesson.durationMinutes} min read
          </span>
          {lesson.keyConcepts.map((concept, i) => (
            <span
              key={i}
              className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20"
            >
              {concept}
            </span>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {lesson.title}
        </h1>
      </div>

      {/* AI Audio Lecture Narration Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 shrink-0"
            >
              {isPlayingAudio ? (
                <Pause className="w-4 h-4 fill-white" />
              ) : (
                <Play className="w-4 h-4 fill-white ml-0.5" />
              )}
            </button>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>AI Synthesized Audio Lecture</span>
                <span className="text-[10px] text-slate-400 font-mono">Gemini TTS</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                {lesson.audioScript}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs font-mono text-slate-400">
              {formatSeconds(audioProgress)} / {formatSeconds(lesson.audioDurationSeconds)}
            </span>
            <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
              {[1, 1.25, 1.5].map((spd) => (
                <button
                  key={spd}
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-semibold transition-colors ${
                    playbackSpeed === spd
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Audio Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden cursor-pointer">
          <div
            className="bg-indigo-500 h-full rounded-full transition-all"
            style={{ width: `${(audioProgress / lesson.audioDurationSeconds) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Lesson Body Text */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 space-y-6 leading-relaxed">
        <div className="prose prose-invert max-w-none space-y-4 text-xs sm:text-sm">
          {lesson.contentMarkdown.split('\n\n').map((paragraph, i) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={i} className="text-lg font-bold text-white border-b border-slate-800 pb-2">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={i} className="text-sm font-bold text-indigo-300">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            if (paragraph.startsWith('```')) {
              const code = paragraph.replace(/```[a-z]*\n?/g, '').trim();
              return (
                <pre
                  key={i}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 overflow-x-auto"
                >
                  <code>{code}</code>
                </pre>
              );
            }
            return (
              <p key={i} className="text-slate-300">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Deep Dive Notes Collapsible */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => setShowDeepDive(!showDeepDive)}
            className="flex items-center justify-between w-full p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-left hover:bg-indigo-950/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-200">
                Professor's Deep Dive Notes & Invariant Analysis
              </span>
            </div>
            <span className="text-xs text-indigo-400 font-medium">
              {showDeepDive ? 'Hide' : 'Expand'}
            </span>
          </button>

          {showDeepDive && (
            <div className="p-4 mt-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans animate-in fade-in duration-150">
              {lesson.deepDiveNotes}
            </div>
          )}
        </div>

        {/* Quick Context Action Bar */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Need clarification on this lesson?</span>
          </div>
          <button
            onClick={handleAskTutor}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20"
          >
            <Bot className="w-3.5 h-3.5" />
            Ask Socratic AI Tutor
          </button>
        </div>
      </div>

      {/* Prev / Next Lesson Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        {prevLesson ? (
          <button
            onClick={() => {
              setSelectedLessonId(prevLesson.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Previous Lesson</div>
              <div className="font-semibold text-slate-200 truncate max-w-xs">{prevLesson.title}</div>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <button
            onClick={() => {
              setSelectedLessonId(nextLesson.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-2 transition-colors text-right"
          >
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Next Lesson</div>
              <div className="font-semibold text-slate-200 truncate max-w-xs">{nextLesson.title}</div>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            Module Complete!
          </div>
        )}
      </div>

      {/* File Export Modal */}
      <FileExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        documentTitle={course.title}
        exportType="course"
        course={course}
      />
    </div>
  );
};
