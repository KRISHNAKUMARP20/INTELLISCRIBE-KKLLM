import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  Cpu,
  BookOpen,
  HelpCircle,
  Copy,
  Check,
  Quote,
  Lightbulb,
  Zap,
  Flame,
  BrainCircuit
} from 'lucide-react';
import { TutorMessage } from '../../types';

interface AiTutorViewProps {
  messages: TutorMessage[];
  sendMessage: (text: string, aiModel?: string) => Promise<void>;
  documentTitle: string;
  socraticMode?: boolean;
  setSocraticMode?: (enabled: boolean) => void;
}

type AiModelType = 'gemini' | 'claude' | 'openai' | 'grok';

interface ModelOption {
  id: AiModelType;
  name: string;
  badge: string;
  desc: string;
  color: string;
  glow: string;
}

const AI_MODELS: ModelOption[] = [
  {
    id: 'gemini',
    name: 'Gemini 3.5 Pro',
    badge: 'Multimodal Master',
    desc: 'Deep multi-page synthesis with instant citations',
    color: 'from-sky-500 to-indigo-600',
    glow: 'rgba(56, 189, 248, 0.35)',
  },
  {
    id: 'openai',
    name: 'GPT-4o (OpenAI)',
    badge: 'Structured & Direct',
    desc: 'Mathematical rigor, crisp tables, and code snippets',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16, 185, 129, 0.35)',
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    badge: 'Nuanced Reasoning',
    desc: 'Deep conceptual intuition & step-by-step academic essays',
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245, 158, 11, 0.35)',
  },
  {
    id: 'grok',
    name: 'xAI Grok-2',
    badge: 'First Principles',
    desc: 'Sharp, intuitive, first-principles analogies',
    color: 'from-purple-500 to-pink-600',
    glow: 'rgba(168, 85, 247, 0.35)',
  },
];

export const AiTutorView: React.FC<AiTutorViewProps> = ({
  messages,
  sendMessage,
  documentTitle,
  socraticMode = false,
  setSocraticMode,
}) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<AiModelType>('gemini');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || input).trim();
    if (!q || loading) return;

    setInput('');
    setLoading(true);

    try {
      await sendMessage(q, selectedModel);
    } catch (err) {
      console.error('Tutor error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const activeModelConfig = AI_MODELS.find((m) => m.id === selectedModel) || AI_MODELS[0];

  return (
    <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 max-w-5xl mx-auto flex flex-col h-[calc(100vh-5.5rem)] text-slate-100">
      
      {/* Top Header & AI Engine Selector */}
      <div className="pb-4 border-b border-white/[0.08] shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeModelConfig.color} flex items-center justify-center text-white shadow-lg`}>
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                IntelliScribe AI Tutor
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Live Grounding
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Grounded in <span className="text-indigo-300 font-medium">{documentTitle}</span> • Powered by Google DeepMind &amp; Gemini
              </p>
            </div>
          </div>
        </div>

        {/* Model Persona Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#090D1A] border border-white/[0.08] overflow-x-auto max-w-full">
          {AI_MODELS.map((model) => {
            const isActive = selectedModel === model.id;
            return (
              <button
                key={model.id}
                onClick={() => setSelectedModel(model.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r ${model.color} text-white shadow-md shadow-black/40`
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
                title={model.desc}
              >
                {model.id === 'gemini' && <Sparkles className="w-3.5 h-3.5" />}
                {model.id === 'openai' && <Zap className="w-3.5 h-3.5" />}
                {model.id === 'claude' && <BrainCircuit className="w-3.5 h-3.5" />}
                {model.id === 'grok' && <Flame className="w-3.5 h-3.5" />}
                <span>{model.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Socratic Mode Toggle Bar */}
      {setSocraticMode && (
        <div className="px-4 py-2.5 rounded-xl bg-[#0F1424] border border-white/[0.08] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-300">
            <Lightbulb className={`w-4 h-4 ${socraticMode ? 'text-amber-400' : 'text-slate-500'}`} />
            <span>
              <strong>Socratic Tutor Mode:</strong> {socraticMode ? 'Engaging with guiding questions to build deep intuition.' : 'Providing direct explanations, clear formulas, and solutions.'}
            </span>
          </div>
          <button
            onClick={() => setSocraticMode(!socraticMode)}
            className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
              socraticMode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-white/[0.05] text-slate-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            {socraticMode ? 'Socratic ON' : 'Turn Socratic ON'}
          </button>
        </div>
      )}

      {/* Messages Scroll View */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-700">
        {messages.length === 0 && (
          <div className="text-center py-16 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mx-auto flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Ask your AI Academic Tutor</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Ask about complex terms, request proof breakdowns, generate quiz questions, or test your understanding with real syllabus grounding.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'tutor' && (
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeModelConfig.color} text-white flex items-center justify-center shrink-0 mt-1 shadow-md`}>
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-2xl flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 sm:p-5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap shadow-xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-none font-medium'
                    : 'bg-[#0F1424] border border-white/[0.08] text-slate-200 rounded-bl-none font-sans'
                }`}
              >
                {msg.text}

                {/* Citations Snippets */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2">
                    <div className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Quote className="w-3.5 h-3.5" />
                      Document Grounding &amp; Citations
                    </div>
                    {msg.citations.map((cite, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-black/30 border border-indigo-500/20 text-[11px] text-slate-300 space-y-1"
                      >
                        <div className="flex items-center justify-between text-indigo-300 font-semibold">
                          <span>{cite.documentName}</span>
                          <span className="text-slate-400 font-normal">Page {cite.page || 1}</span>
                        </div>
                        <p className="italic text-slate-400">"{cite.snippet}"</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/[0.08]">
                    <div className="text-[11px] font-semibold text-slate-400 mb-2">Suggested Follow-ups:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowups.map((followup, fi) => (
                        <button
                          key={fi}
                          onClick={() => handleSend(followup)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] text-indigo-300 hover:text-white transition-all cursor-pointer text-left"
                        >
                          → {followup}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Footer Info */}
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-500">
                <span>{msg.timestamp}</span>
                {msg.sender === 'tutor' && (
                  <>
                    <span>•</span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="hover:text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${activeModelConfig.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="p-4 rounded-2xl bg-[#0F1424] border border-white/[0.08] text-xs text-slate-400 flex items-center gap-2.5 shadow-xl">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span>{activeModelConfig.name} is formulating an academic breakdown...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="flex flex-wrap items-center gap-2 pt-1 shrink-0">
        {[
          'Give me an intuitive real-world example',
          'Break down the core formulas or algorithms',
          'Create a 3-question diagnostic quiz',
          'What are common exam pitfalls for this topic?',
        ].map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-[#0F1424] hover:bg-[#131B32] border border-white/[0.08] hover:border-indigo-500/40 text-xs font-medium text-slate-300 hover:text-white transition-colors shadow-xs cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="relative pt-1 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask ${activeModelConfig.name} anything about ${documentTitle}...`}
          className="w-full pl-4 pr-16 py-3.5 rounded-2xl bg-[#0F1424] border border-white/[0.1] text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-2xl transition-all"
        />

        <div className="absolute right-2 top-3 flex items-center gap-1.5">
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
