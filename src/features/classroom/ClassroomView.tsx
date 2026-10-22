import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Users,
  Award,
  Zap,
  Swords,
  Share2,
  BookOpen,
  Layers,
  CheckCircle2,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { ClassroomGroup } from '../../types';
import { ActiveTab } from '../../store/useAppStore';

interface ClassroomViewProps {
  classrooms: ClassroomGroup[];
  awardXp: (amount: number, reason: string) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const ClassroomView: React.FC<ClassroomViewProps> = ({
  classrooms,
  awardXp,
  setActiveTab,
}) => {
  const activeGroup = classrooms[0];
  const [battleActive, setBattleActive] = useState(false);
  const [battleRound, setBattleRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [rivalScore, setRivalScore] = useState(0);
  const [battleFinished, setBattleFinished] = useState(false);

  const battleQuestions = [
    {
      q: 'Does Raft permit leader election with an even number of nodes without split risk?',
      opts: ['No, odd is required for strict majority', 'Yes, ties are ignored', 'Yes, lower node id wins'],
      correct: 0,
    },
    {
      q: 'What is the role of tracrRNA in natural CRISPR-Cas9?',
      opts: ['Scaffold pairing with crRNA for RNase III processing', 'Cleaving the non-target DNA strand', 'Synthesizing the PAM motif'],
      correct: 0,
    },
    {
      q: 'Why divide by sqrt(d_k) in transformer attention?',
      opts: ['Prevents vanishing gradients in saturated softmax', 'Accelerates linear matrix inversion', 'Reduces memory by half'],
      correct: 0,
    },
  ];

  const handleStartBattle = () => {
    setBattleActive(true);
    setBattleRound(0);
    setUserScore(0);
    setRivalScore(0);
    setBattleFinished(false);
  };

  const handleAnswerBattle = (optIdx: number) => {
    const isCorrect = optIdx === battleQuestions[battleRound].correct;
    const newScore = isCorrect ? userScore + 100 : userScore;
    // Rival randomly scores
    const rivalDelta = Math.random() > 0.35 ? 100 : 0;
    const newRival = rivalScore + rivalDelta;

    setUserScore(newScore);
    setRivalScore(newRival);

    if (battleRound < battleQuestions.length - 1) {
      setBattleRound((prev) => prev + 1);
    } else {
      setBattleFinished(true);
      if (newScore >= newRival) {
        confetti({ particleCount: 110, spread: 70, origin: { y: 0.6 } });
        awardXp(150, 'Won Cohort Quiz Battle!');
      } else {
        awardXp(40, 'Completed Cohort Quiz Battle');
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
            COLLABORATIVE PEER LEARNING
          </span>
          <h1 className="text-2xl font-bold text-white mt-1.5">{activeGroup.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cohort Code: <strong className="text-slate-200 font-mono">{activeGroup.code}</strong> • {activeGroup.membersCount} Active Scholars
          </p>
        </div>

        <button
          onClick={handleStartBattle}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
        >
          <Swords className="w-4 h-4" />
          Start Peer Quiz Battle Blitz
        </button>
      </div>

      {/* Battle Modal / Drawer if Active */}
      {battleActive && (
        <div className="p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/50 shadow-2xl space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
              <Swords className="w-4 h-4" />
              <span>Cohort Blitz Duel • Round {battleRound + 1} of {battleQuestions.length}</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-indigo-400 font-bold">You: {userScore} pts</span>
              <span className="text-slate-500">vs</span>
              <span className="text-rose-400 font-bold">Elena (Rival): {rivalScore} pts</span>
            </div>
          </div>

          {!battleFinished ? (
            <div className="space-y-4 py-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {battleQuestions[battleRound].q}
              </h3>
              <div className="space-y-2">
                {battleQuestions[battleRound].opts.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerBattle(i)}
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 hover:bg-slate-800 text-left text-xs sm:text-sm text-slate-200 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
                <Trophy className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-extrabold text-white">
                {userScore >= rivalScore ? 'Victory! Outstanding Speed & Accuracy' : 'Great Duel! Elena edged ahead'}
              </h3>
              <p className="text-xs text-slate-300">
                Final Score: You ({userScore} pts) vs Elena ({rivalScore} pts). Earned +{userScore >= rivalScore ? 150 : 40} XP.
              </p>
              <button
                onClick={() => setBattleActive(false)}
                className="mt-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
              >
                Close Battle
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cohort Leaderboard & Shared Decks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaderboard Table */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Weekly Cohort Leaderboard</span>
              </h3>
              <p className="text-xs text-slate-400">Ranks calculated by study retention, quiz scores, and streak days.</p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Season 4</span>
          </div>

          <div className="divide-y divide-slate-800/80">
            {activeGroup.leaderboard.map((scholar) => (
              <div
                key={scholar.rank}
                className={`py-3 flex items-center justify-between ${
                  scholar.name.includes('(You)') ? 'bg-indigo-950/20 px-3 rounded-xl' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 text-center text-xs font-bold font-mono ${
                      scholar.rank === 1
                        ? 'text-amber-400'
                        : scholar.rank === 2
                        ? 'text-indigo-400'
                        : 'text-slate-400'
                    }`}
                  >
                    #{scholar.rank}
                  </span>
                  <img
                    src={scholar.avatar}
                    alt={scholar.name}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{scholar.name}</div>
                    <div className="text-[10px] text-slate-500">Scholar • CS-401</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-white font-mono">
                    {scholar.points.toLocaleString()} XP
                  </div>
                  <div className="text-[10px] text-emerald-400">Mastery Track</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shared Decks & Group Resources */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Shared Cohort Decks</span>
            </h3>
            <p className="text-xs text-slate-400">
              Community curated decks peer-reviewed by students and teaching assistants.
            </p>

            <div className="space-y-2 pt-1">
              {[
                { title: 'Raft & Paxos Exam Edge Cases', cards: 38, creator: 'Elena Rostova' },
                { title: 'Byzantine Fault Tolerance Math', cards: 24, creator: 'Marcus Brody' },
                { title: 'CRISPR Repair Pathways Deep Dive', cards: 42, creator: 'Priya Sharma' },
              ].map((deck, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveTab('flashcards')}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-indigo-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200">{deck.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {deck.cards} cards • By {deck.creator}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('flashcards')}
            className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/30"
          >
            Review Cohort Decks
          </button>
        </div>
      </div>
    </div>
  );
};
