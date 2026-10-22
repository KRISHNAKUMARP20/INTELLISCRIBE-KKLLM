import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Sparkles,
  FileText,
  Layers,
  HelpCircle,
  FileCode,
  GraduationCap,
  ArrowRight,
  Zap,
  CheckCircle2,
  ShieldCheck,
  BrainCircuit,
  UploadCloud,
  ChevronRight,
  Flame,
  Star,
  Cpu,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { AuthModal } from '../../components/common/AuthModal';
import { ActiveTab } from '../../store/useAppStore';

interface LandingPageProps {
  isLoggedIn?: boolean;
  setActiveTab: (tab: ActiveTab) => void;
  onQuickStartDemo: (sampleType: 'consensus' | 'crispr' | 'transformers') => void;
  onLoginSuccess?: (name: string, email: string, avatarUrl?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isLoggedIn, setActiveTab, onQuickStartDemo, onLoginSuccess }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number>(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Protected action: if user is not logged in, prompt sign in / auth modal
  const handleProtectedAction = (action: () => void) => {
    if (!isLoggedIn) {
      setIsAuthOpen(true);
      return;
    }
    action();
  };

  const featurePillars = [
    {
      id: 'summaries',
      title: 'AI Summaries & Notes',
      tag: 'Neural Synthesis',
      description: 'Condenses dense 60+ page textbook PDFs, slides, and journals into crystal-clear executive takeaways with mathematical proofs and formulas highlighted.',
      icon: Sparkles,
      color: 'from-sky-400 via-indigo-500 to-purple-600',
      glow: 'rgba(56, 189, 248, 0.45)',
      tab: 'summaries' as ActiveTab,
      stats: '85% faster review time'
    },
    {
      id: 'flashcards',
      title: 'Adaptive Spaced Flashcards',
      tag: 'Leitner Algorithm',
      description: 'Auto-constructs active-recall flashcard decks calibrated to your memory half-life to maximize long-term retention without stressful cramming.',
      icon: Layers,
      color: 'from-purple-500 via-indigo-600 to-pink-500',
      glow: 'rgba(192, 132, 252, 0.45)',
      tab: 'flashcards' as ActiveTab,
      stats: '4x retention rate'
    },
    {
      id: 'quizzes',
      title: 'Diagnostic Quiz Engine',
      tag: 'Mastery Assessment',
      description: 'Generates multi-choice and scenario exams with Socratic feedback, explaining exactly why distractors are wrong and reinforcing weak concepts.',
      icon: HelpCircle,
      color: 'from-amber-400 via-indigo-500 to-sky-400',
      glow: 'rgba(251, 191, 36, 0.45)',
      tab: 'quizzes' as ActiveTab,
      stats: 'Instant auto-grading & hints'
    },
    {
      id: 'courses',
      title: 'Interactive Modular Courses',
      tag: 'Curriculum AI',
      description: 'Breaks down complex topics into progressive units with step-by-step reading modules, code snippets, visual checkpoints, and completion certificates.',
      icon: GraduationCap,
      color: 'from-indigo-500 via-purple-600 to-sky-400',
      glow: 'rgba(99, 102, 241, 0.45)',
      tab: 'courses' as ActiveTab,
      stats: 'Structured unit pathways'
    },
    {
      id: 'ai-tutor',
      title: 'Contextual AI Mentor',
      tag: '24/7 Grounded Tutor',
      description: 'Engage with a conversational Socratic tutor that knows every page, diagram, and equation in your uploaded materials and answers with direct citations.',
      icon: BrainCircuit,
      color: 'from-emerald-400 via-teal-500 to-indigo-600',
      glow: 'rgba(52, 211, 153, 0.45)',
      tab: 'ai-tutor' as ActiveTab,
      stats: 'Verified source citations'
    }
  ];


  return (
    <div className="min-h-screen bg-[#030712] ai-midnight-bg text-slate-100 flex flex-col relative overflow-hidden selection:bg-indigo-600 selection:text-white">
      {/* Background Animated AI Midnight Gradient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Midnight Glowing Orb 1 - Cobalt & Electric Indigo */}
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-indigo-600/30 via-blue-600/25 to-sky-400/20 blur-[140px] animate-midnight-mesh-1" />
        {/* Midnight Glowing Orb 2 - Deep Violet & Nebula Purple */}
        <div className="absolute top-1/3 -right-32 w-[720px] h-[720px] rounded-full bg-gradient-to-br from-violet-600/25 via-purple-900/25 to-indigo-950/40 blur-[150px] animate-midnight-mesh-2" />
        {/* Midnight Glowing Orb 3 - Sky & Cyan Aurora */}
        <div className="absolute -bottom-48 left-10 w-[620px] h-[620px] rounded-full bg-gradient-to-tl from-cyan-500/20 via-indigo-900/30 to-transparent blur-[160px] animate-midnight-mesh-3" />
        
        {/* Subtle Starlight Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #818cf8 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      </div>

      {/* Top Glass Navigation Bar */}
      <header className="relative z-30 h-20 border-b border-indigo-500/15 px-6 sm:px-12 flex items-center justify-between backdrop-blur-2xl bg-[#030712]/80 sticky top-0 transition-all">
        {/* Brand Logo with User-uploaded Image */}
        <div
          onClick={() => handleProtectedAction(() => setActiveTab('dashboard'))}
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative">
            <img
              src="/logo.jpg"
              alt="IntelliScribe Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-indigo-600/40 group-hover:shadow-indigo-500/70 group-hover:scale-105 transition-all duration-300 ring-1 ring-indigo-400/40"
            />
            <div className="absolute -inset-1 rounded-xl bg-indigo-500/30 blur-xs -z-10 group-hover:opacity-100 opacity-0 transition-opacity" />
          </div>
          
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-wider text-white group-hover:text-indigo-300 transition-colors">
              INTELLISCRIBE
            </span>
            <span className="text-[10px] font-semibold text-indigo-400 tracking-widest uppercase">
              Learn Smarter • Grow Faster
            </span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setActiveTab('landing')} 
            className="text-indigo-400 font-semibold flex items-center gap-1.5 hover:text-indigo-300 transition-colors cursor-pointer"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
            Home
          </button>
          <button 
            onClick={() => handleProtectedAction(() => setActiveTab('courses'))} 
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
          >
            Courses
          </button>
          <button 
            onClick={() => handleProtectedAction(() => setActiveTab('documents'))} 
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
          >
            Documents
          </button>
          <button 
            onClick={() => handleProtectedAction(() => setActiveTab('dashboard'))} 
            className="hover:text-white transition-colors flex items-center gap-1 text-slate-300 cursor-pointer"
          >
            Dashboard
          </button>
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer hover:scale-105 active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-xl hover:bg-white/[0.08] border border-white/[0.12] hover:border-indigo-400/50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Account</span>
            </button>
          )}

          <button
            onClick={() => handleProtectedAction(() => {
              onQuickStartDemo('consensus');
              setActiveTab('dashboard');
            })}
            className="hidden sm:flex text-xs font-semibold text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-white/[0.06] border border-white/[0.08] hover:border-indigo-400/40 transition-all cursor-pointer"
          >
            Explore Demo
          </button>
          <button
            onClick={() => handleProtectedAction(() => setActiveTab('dashboard'))}
            className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/35 hover:shadow-indigo-500/60 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-12 pb-20 max-w-6xl mx-auto w-full">
        
        {/* Animated Pill Badge */}
        <div 
          onClick={() => {
            handleProtectedAction(() => {
              onQuickStartDemo('transformers');
              setActiveTab('courses');
            });
          }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/40 backdrop-blur-md mb-8 hover:border-indigo-400/80 hover:bg-indigo-900/40 transition-all cursor-pointer group shadow-lg shadow-indigo-600/20"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-400 shadow-[0_0_10px_#818cf8]" />
          </span>
          <span className="text-xs font-semibold bg-gradient-to-r from-indigo-200 via-sky-200 to-indigo-100 bg-clip-text text-transparent">
            ✨ Intelligent Knowledge Synthesizer • Live AI Model 2.5
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
        </div>

        {/* Hero Title with Shimmer Animation */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white max-w-4xl leading-[1.12] mb-6 drop-shadow-2xl">
          Transform Dense Documents into{' '}
          <span className="bg-gradient-to-r from-indigo-300 via-sky-300 to-purple-400 bg-clip-text text-transparent animate-text-shimmer drop-shadow-[0_0_35px_rgba(129,140,248,0.5)]">
            Interactive AI Galaxies
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Upload complex PDF textbooks, lecture slides, or technical papers. Watch IntelliScribe dynamically generate 
          <span className="text-indigo-300 font-semibold"> multi-unit courses</span>, 
          <span className="text-sky-300 font-semibold"> active-recall flashcards</span>, and 
          <span className="text-purple-300 font-semibold"> diagnostic self-grading quizzes</span> in real-time.
        </p>

        {/* Primary Action Buttons with Glow Effects */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => handleProtectedAction(() => setActiveTab('dashboard'))}
            className="group relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 hover:from-indigo-500 hover:via-purple-500 hover:to-sky-400 text-white text-sm sm:text-base font-bold shadow-2xl shadow-indigo-600/50 hover:shadow-indigo-500/80 transition-all duration-300 hover:scale-[1.04] active:scale-[0.98] flex items-center gap-3 cursor-pointer"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <Sparkles className="w-5 h-5 text-indigo-200 animate-spin-slow" />
            <span className="relative z-10">{isLoggedIn ? 'Go to Dashboard' : 'Start Learning Now'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </button>

          {!isLoggedIn && (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-6 py-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm sm:text-base font-bold flex items-center gap-2.5 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          )}

          <button
            onClick={() => {
              handleProtectedAction(() => {
                onQuickStartDemo('consensus');
                setActiveTab('courses');
              });
            }}
            className="px-7 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-indigo-500/30 hover:border-indigo-400/70 text-slate-200 text-sm sm:text-base font-semibold flex items-center gap-3 shadow-xl backdrop-blur-md transition-all duration-200 hover:text-white hover:scale-[1.02] cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/25 flex items-center justify-center text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </div>
            <span>Watch Live Interactive Demo</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* INTERACTIVE ANIMATED CONSTELLATION & ORBIT NODE DIAGRAM       */}
        {/* ============================================================== */}
        <div className="relative w-full max-w-4xl h-[460px] sm:h-[520px] my-4 flex items-center justify-center select-none">
          
          {/* Animated floating particles inside the constellation */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-particle-drift" />
            <div className="absolute top-2/3 right-1/4 w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] animate-particle-drift [animation-delay:2s]" />
            <div className="absolute bottom-1/3 left-1/5 w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8] animate-particle-drift [animation-delay:4s]" />
          </div>

          {/* Circular Orbit Guides */}
          <div className="absolute w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border border-dashed border-indigo-500/30 animate-pulse-ring" />
          <div className="absolute w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] rounded-full border border-indigo-400/15 animate-orbit-slow" />
          <div className="absolute w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] rounded-full border border-sky-500/30 animate-orbit-reverse" />
          
          {/* Rotating outer orbital ring with glowing satellite */}
          <div className="absolute w-[450px] h-[450px] sm:w-[560px] sm:h-[560px] rounded-full border border-white/[0.04] animate-spin-slow pointer-events-none flex items-start justify-center">
            <div className="w-3 h-3 -mt-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 shadow-[0_0_15px_#38bdf8] animate-ping" />
          </div>

          {/* SVG Connector Beams */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 500">
            <defs>
              <linearGradient id="beamIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4338ca" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="beamSky" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.15" />
              </linearGradient>
              <linearGradient id="beamPurple" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#4338ca" stopOpacity="0.15" />
              </linearGradient>
            </defs>

            {/* Connecting laser lines to nodes */}
            <line x1="400" y1="260" x2="400" y2="70" stroke="url(#beamSky)" strokeWidth="2" className="animate-beam-dash" />
            <line x1="400" y1="260" x2="140" y2="150" stroke="url(#beamPurple)" strokeWidth="2" className="animate-beam-dash" />
            <line x1="400" y1="260" x2="660" y2="150" stroke="url(#beamIndigo)" strokeWidth="2" className="animate-beam-dash" />
            <line x1="400" y1="260" x2="180" y2="400" stroke="url(#beamSky)" strokeWidth="2" className="animate-beam-dash" />
            <line x1="400" y1="260" x2="620" y2="400" stroke="url(#beamPurple)" strokeWidth="2" className="animate-beam-dash" />
          </svg>

          {/* Central Core Reactor (Document Ingestion Engine) */}
          <div 
            onClick={() => handleProtectedAction(() => setActiveTab('documents'))}
            className="group relative z-20 cursor-pointer flex flex-col items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
          >
            {/* Ambient Background Aura */}
            <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-indigo-600 via-sky-500 to-purple-600 opacity-60 blur-2xl group-hover:opacity-90 group-hover:blur-3xl transition-all duration-300 animate-pulse-glow" />
            
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#0B0F1D]/90 border-2 border-indigo-400/60 p-4 flex flex-col items-center justify-center shadow-2xl backdrop-blur-xl group-hover:border-sky-300 transition-all">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white mb-1.5 shadow-lg shadow-indigo-500/50 group-hover:rotate-6 transition-transform">
                <BookOpen className="w-7 h-7 animate-float-gentle" />
              </div>
              <span className="text-xs font-black text-white tracking-wider">
                CORE DOC
              </span>
              <span className="text-[9px] text-sky-300 font-bold uppercase tracking-widest">
                AI INGESTION
              </span>
            </div>
            
            <div className="mt-2.5 px-3 py-1 rounded-full bg-indigo-950/90 border border-indigo-400/40 text-[10px] text-indigo-300 font-mono font-semibold shadow-lg shadow-indigo-900/50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Click to Feed Document
            </div>
          </div>

          {/* Node 1: AI Summaries (Top Center) */}
          <div
            onClick={() => handleProtectedAction(() => setActiveTab('courses'))}
            onMouseEnter={() => setHoveredNode('summaries')}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute top-2 sm:top-4 flex flex-col items-center gap-1.5 cursor-pointer group z-20 transition-all duration-300 hover:scale-110"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F1D]/90 border border-sky-400/40 flex items-center justify-center text-sky-300 shadow-[0_0_25px_rgba(56,189,248,0.3)] group-hover:border-sky-300 group-hover:shadow-[0_0_35px_rgba(56,189,248,0.5)] transition-all">
              <Sparkles className="w-6 h-6 text-sky-400 group-hover:rotate-12 transition-transform" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-sky-500/30 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-bold text-white tracking-tight">AI Summaries</span>
              <span className="text-[9px] text-sky-400 font-medium">TL;DR Notes</span>
            </div>
          </div>

          {/* Node 2: Flashcards (Top Left) */}
          <div
            onClick={() => handleProtectedAction(() => setActiveTab('courses'))}
            onMouseEnter={() => setHoveredNode('flashcards')}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute top-12 left-4 sm:left-12 flex flex-col items-center gap-1.5 cursor-pointer group z-20 transition-all duration-300 hover:scale-110"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F1D]/90 border border-purple-400/40 flex items-center justify-center text-purple-300 shadow-[0_0_25px_rgba(192,132,252,0.3)] group-hover:border-purple-300 group-hover:shadow-[0_0_35px_rgba(192,132,252,0.5)] transition-all">
              <Layers className="w-6 h-6 text-purple-400 group-hover:-translate-y-0.5 transition-transform" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-purple-500/30 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-bold text-white tracking-tight">Flashcards</span>
              <span className="text-[9px] text-purple-400 font-medium">Active Recall</span>
            </div>
          </div>

          {/* Node 3: Quizzes (Top Right) */}
          <div
            onClick={() => handleProtectedAction(() => setActiveTab('courses'))}
            onMouseEnter={() => setHoveredNode('quizzes')}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute top-12 right-4 sm:right-12 flex flex-col items-center gap-1.5 cursor-pointer group z-20 transition-all duration-300 hover:scale-110"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F1D]/90 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_25px_rgba(129,140,248,0.3)] group-hover:border-indigo-300 group-hover:shadow-[0_0_35px_rgba(129,140,248,0.5)] transition-all">
              <HelpCircle className="w-6 h-6 text-indigo-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-bold text-white tracking-tight">Smart Quizzes</span>
              <span className="text-[9px] text-indigo-400 font-medium">Auto Grading</span>
            </div>
          </div>

          {/* Node 4: Full Course (Bottom Left) */}
          <div
            onClick={() => handleProtectedAction(() => setActiveTab('courses'))}
            onMouseEnter={() => setHoveredNode('courses')}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute bottom-6 left-12 sm:left-24 flex flex-col items-center gap-1.5 cursor-pointer group z-20 transition-all duration-300 hover:scale-110"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F1D]/90 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-[0_0_25px_rgba(99,102,241,0.3)] group-hover:border-indigo-300 group-hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] transition-all">
              <GraduationCap className="w-6 h-6 text-indigo-400 group-hover:rotate-6 transition-transform" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-indigo-500/30 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-bold text-white tracking-tight">Full Course</span>
              <span className="text-[9px] text-indigo-400 font-medium">Bite-sized Units</span>
            </div>
          </div>

          {/* Node 5: AI Tutor & Revision (Bottom Right) */}
          <div
            onClick={() => handleProtectedAction(() => setActiveTab('ai-tutor'))}
            onMouseEnter={() => setHoveredNode('tutor')}
            onMouseLeave={() => setHoveredNode(null)}
            className="absolute bottom-6 right-12 sm:right-24 flex flex-col items-center gap-1.5 cursor-pointer group z-20 transition-all duration-300 hover:scale-110"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0B0F1D]/90 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.3)] group-hover:border-emerald-300 group-hover:shadow-[0_0_35px_rgba(52,211,153,0.5)] transition-all">
              <BrainCircuit className="w-6 h-6 text-emerald-400 group-hover:animate-pulse" />
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-emerald-500/30 backdrop-blur-md flex flex-col items-center">
              <span className="text-xs font-bold text-white tracking-tight">24/7 AI Tutor</span>
              <span className="text-[9px] text-emerald-400 font-medium">Deep Q&A</span>
            </div>
          </div>
        </div>

        {/* Feature Pillars Interactive Selector */}
        <div className="w-full mt-12 max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-1.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md mb-6">
            {featurePillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isActive = activeFeatureIndex === idx;
              return (
                <button
                  key={pillar.id}
                  onClick={() => setActiveFeatureIndex(idx)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-gradient-to-b from-indigo-900/70 to-slate-900/90 border border-indigo-400/40 shadow-lg shadow-indigo-500/20'
                      : 'hover:bg-white/[0.04] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold text-center leading-tight ${isActive ? 'text-white' : 'text-slate-400'}`}>
                    {pillar.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Feature Showcase Spotlight Card */}
          <div className="relative overflow-hidden rounded-2xl glass-panel-glow p-6 sm:p-8 text-left transition-all duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/35">
                    {featurePillars[activeFeatureIndex].tag}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {featurePillars[activeFeatureIndex].stats}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {featurePillars[activeFeatureIndex].title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {featurePillars[activeFeatureIndex].description}
                </p>
              </div>

              <button
                onClick={() => handleProtectedAction(() => setActiveTab(featurePillars[activeFeatureIndex].tab))}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-sky-500 hover:from-indigo-500 hover:to-sky-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/35 flex items-center gap-2 shrink-0 transition-transform hover:scale-105 cursor-pointer"
              >
                <span>Open {featurePillars[activeFeatureIndex].title.split(' ')[0]}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>



        {/* Live Social Proof Metrics */}
        <div className="mt-16 pt-10 border-t border-white/[0.08] w-full max-w-4xl">
          <div className="flex flex-wrap items-center justify-around gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                50,000+
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-400" />
                Pages Synthesized
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-white/[0.08]" />

            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                98.4%
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Exam Concept Accuracy
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-white/[0.08]" />

            <div className="flex flex-col items-center">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent flex items-center gap-1">
                4.9
                <Star className="w-5 h-5 fill-amber-400 text-amber-400 inline" />
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1">
                From 12,000+ Students
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Subtle Footer */}
      <footer className="relative z-20 border-t border-white/[0.06] bg-[#05070D] py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400 font-medium">INTELLISCRIBE Engine: Operational</span>
          </div>
          <div>
            Built for next-generation self-directed learning & academic research
          </div>
        </div>
      </footer>

      {/* Social & Email Authentication Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(provider, email, userName, avatarUrl) => {
          setIsAuthOpen(false);
          let cleanName = userName;
          if (!cleanName) {
            const emailPrefix = email.split('@')[0];
            cleanName = emailPrefix
              .split(/[._-]/)
              .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
              .join(' ');
          }

          // Update user in store if available
          if (onLoginSuccess) {
            onLoginSuccess(cleanName, email, avatarUrl);
          }
          setActiveTab('dashboard');
        }}
      />
    </div>
  );
};
