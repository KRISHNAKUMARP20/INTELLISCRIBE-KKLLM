import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Plus,
  AlertCircle,
  Award,
  Flame,
  Layers
} from 'lucide-react';
import { ExamCountdown, RevisionTask } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface RevisionPlannerViewProps {
  tasks: RevisionTask[];
  setTasks: React.Dispatch<React.SetStateAction<RevisionTask[]>>;
  exams: ExamCountdown[];
  pomodoroRunning: boolean;
  setPomodoroRunning: (running: boolean) => void;
  pomodoroSeconds: number;
  setPomodoroSeconds: React.Dispatch<React.SetStateAction<number>>;
  pomodoroMode: 'focus' | 'break';
  setPomodoroMode: (mode: 'focus' | 'break') => void;
  soundscape: 'none' | 'rain' | 'lofi' | 'library';
  setSoundscape: (sound: 'none' | 'rain' | 'lofi' | 'library') => void;
  awardXp: (amount: number, reason: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const RevisionPlannerView: React.FC<RevisionPlannerViewProps> = ({
  tasks,
  setTasks,
  exams,
  pomodoroRunning,
  setPomodoroRunning,
  pomodoroSeconds,
  setPomodoroSeconds,
  pomodoroMode,
  setPomodoroMode,
  soundscape,
  setSoundscape,
  awardXp,
  setActiveTab,
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Pomodoro countdown effect
  useEffect(() => {
    let timer: any;
    if (pomodoroRunning) {
      timer = setInterval(() => {
        setPomodoroSeconds((prev) => {
          if (prev <= 1) {
            setPomodoroRunning(false);
            if (pomodoroMode === 'focus') {
              awardXp(60, 'Completed 25-minute Pomodoro study block!');
              setPomodoroMode('break');
              return 5 * 60;
            } else {
              setPomodoroMode('focus');
              return 25 * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroMode, setPomodoroSeconds, setPomodoroRunning, setPomodoroMode, awardXp]);

  const toggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextState = !t.completed;
        if (nextState) awardXp(30, 'Completed revision task');
        return { ...t, completed: nextState };
      })
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: RevisionTask = {
      id: `task_${Date.now()}`,
      title: newTaskTitle.trim(),
      documentTitle: 'Personal Study Schedule',
      dueDate: 'Today',
      dueTime: 'Custom',
      cardCount: 5,
      estimatedMinutes: 15,
      completed: false,
      priority: 'medium',
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const totalSeconds = pomodoroMode === 'focus' ? 25 * 60 : 5 * 60;
  const progressPercent = Math.round(((totalSeconds - pomodoroSeconds) / totalSeconds) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
            EBBINGHAUS SPACING & FOCUS
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5">Revision Scheduler & Pomodoro</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Optimize exam readiness with spaced repetition tasks and audio-focused study blocks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Spaced Repetition Queue & Exam Countdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Exam Countdown Banners */}
          {exams.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Target Exam Countdowns
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {exams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white line-clamp-1">{exam.courseTitle}</div>
                      <div className="text-[11px] text-slate-400">Target Score: {exam.targetScore}</div>
                      <div className="text-[10px] text-slate-500 font-mono">Date: {exam.examDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-indigo-400 font-mono">
                        {exam.daysRemaining}d
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Daily Revision Tasks */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Daily Spaced Revision Queue</h3>
                <p className="text-xs text-slate-400">
                  Tasks calculated from your Leitner recall intervals and upcoming deadlines.
                </p>
              </div>
              <span className="text-xs text-indigo-400 font-mono font-semibold">
                {tasks.filter((t) => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            {/* Quick add custom task */}
            <form onSubmit={handleAddTask} className="flex gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Add custom study task for your syllabus..."
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-indigo-600/30"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </form>

            {/* Task list */}
            {tasks.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center space-y-2">
                <Calendar className="w-6 h-6 text-slate-500 mx-auto" />
                <div className="text-xs font-semibold text-slate-300">No Revision Tasks Scheduled</div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Upload a document to automatically populate revision checkpoints, or add your own custom study tasks above.
                </p>
              </div>
            ) : (
              <div className="space-y-2 pt-1">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => toggleTask(task.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      task.completed
                        ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                          task.completed
                            ? 'bg-emerald-500 text-slate-950'
                            : 'border border-slate-600'
                        }`}
                      >
                        {task.completed && <CheckCircle2 className="w-4 h-4" />}
                      </div>

                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            task.completed ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {task.title}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {task.documentTitle} • {task.estimatedMinutes} mins
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          task.priority === 'high'
                            ? 'bg-rose-500/20 text-rose-300'
                            : task.priority === 'medium'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {task.priority.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{task.dueTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Built-in Pomodoro Focus Engine */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  pomodoroMode === 'focus'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                {pomodoroMode === 'focus' ? 'Deep Study Interval (25m)' : 'Rest Interval (5m)'}
              </span>
            </div>

            {/* Circular Timer Visual */}
            <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="88"
                  cy="88"
                  r="72"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={452}
                  strokeDashoffset={452 - (452 * progressPercent) / 100}
                  strokeLinecap="round"
                  className={`transition-all duration-300 ${
                    pomodoroMode === 'focus' ? 'text-indigo-500' : 'text-emerald-500'
                  }`}
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <div className="text-3xl font-black text-white font-mono tracking-tight">
                  {formatTimer(pomodoroSeconds)}
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold mt-0.5">
                  {pomodoroRunning ? 'Focusing...' : 'Paused'}
                </div>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setPomodoroRunning(!pomodoroRunning)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg transition-all ${
                  pomodoroRunning
                    ? 'bg-slate-800 hover:bg-slate-700 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30 hover:scale-105'
                }`}
              >
                {pomodoroRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{pomodoroRunning ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => {
                  setPomodoroRunning(false);
                  setPomodoroSeconds(pomodoroMode === 'focus' ? 25 * 60 : 5 * 60);
                }}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Ambient Study Soundscape Selector */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Ambient Soundscape</span>
              </span>
              <span className="text-[10px] text-slate-500 uppercase">{soundscape}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'none', label: 'Mute Audio' },
                { id: 'rain', label: 'Gentle Rain' },
                { id: 'lofi', label: 'Lo-Fi Chill' },
                { id: 'library', label: 'Library Ambience' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSoundscape(s.id as any)}
                  className={`p-2 rounded-xl text-[11px] font-medium border text-center transition-colors ${
                    soundscape === s.id
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-200'
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-400'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
