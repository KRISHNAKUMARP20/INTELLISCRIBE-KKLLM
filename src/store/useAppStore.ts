import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserProfile,
  DocumentItem,
  Course,
  Lesson,
  Summary,
  Flashcard,
  Quiz,
  QuizQuestion,
  TutorMessage,
  KnowledgeGraphData,
  DailyActivity,
  WeakTopic,
  RevisionTask,
  ExamCountdown,
  ClassroomGroup,
  LeitnerBox,
  DocumentChunk
} from '../types';
import {
  INITIAL_USER,
  INITIAL_DOCUMENTS,
  INITIAL_COURSES,
  INITIAL_SUMMARIES,
  INITIAL_FLASHCARDS,
  INITIAL_QUIZZES,
  INITIAL_KNOWLEDGE_GRAPH,
  INITIAL_DAILY_ACTIVITY,
  INITIAL_WEAK_TOPICS,
  INITIAL_REVISION_TASKS,
  INITIAL_EXAMS,
  INITIAL_CLASSROOMS
} from '../constants/initialData';

export type ActiveTab =
  | 'landing'
  | 'dashboard'
  | 'notebook'
  | 'documents'
  | 'courses'
  | 'lessons'
  | 'summaries'
  | 'flashcards'
  | 'quizzes'
  | 'ai-tutor'
  | 'knowledge-graph'
  | 'revision-planner'
  | 'classroom'
  | 'exports'
  | 'settings';

export function useAppStore() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('intelliscribe_logged_in');
      if (stored === 'false') return false;
      if (stored === 'true') return true;
      // Default to landing page if user has never logged in
      return false;
    }
    return false;
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const storedAuth = localStorage.getItem('intelliscribe_logged_in');
      if (storedAuth === 'false') return 'landing';
      const savedTab = localStorage.getItem('intelliscribe_active_tab') as ActiveTab;
      if (savedTab && savedTab !== 'landing') return savedTab;
      if (storedAuth === 'true') return 'dashboard';
    }
    return 'landing';
  });
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const authUser = params.get('auth_user');
      if (authUser) {
        try {
          const parsed = JSON.parse(decodeURIComponent(authUser));
          const updated = {
            ...INITIAL_USER,
            name: parsed.name || 'Student',
            email: parsed.email || '',
            avatarUrl: parsed.avatar_url || INITIAL_USER.avatarUrl,
          };
          localStorage.setItem('intelliscribe_logged_in', 'true');
          localStorage.setItem('intelliscribe_user', JSON.stringify(updated));
          return updated;
        } catch {}
      }
      const saved = localStorage.getItem('intelliscribe_user');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return INITIAL_USER;
  });
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [selectedDocId, setSelectedDocId] = useState<string>('');
  
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('');

  const [summaries, setSummaries] = useState<Summary[]>(INITIAL_SUMMARIES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [quizzes, setQuizzes] = useState<Quiz[]>(INITIAL_QUIZZES);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [courseSubTab, setCourseSubTab] = useState<'overview' | 'summary' | 'flashcards' | 'quizzes' | 'notes' | 'lessons'>('overview');

  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData>(INITIAL_KNOWLEDGE_GRAPH);
  const [dailyActivities, setDailyActivities] = useState<DailyActivity[]>(INITIAL_DAILY_ACTIVITY);
  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>(INITIAL_WEAK_TOPICS);
  const [revisionTasks, setRevisionTasks] = useState<RevisionTask[]>(INITIAL_REVISION_TASKS);
  const [exams, setExams] = useState<ExamCountdown[]>(INITIAL_EXAMS);
  const [classrooms, setClassrooms] = useState<ClassroomGroup[]>(INITIAL_CLASSROOMS);

  // AI Tutor state
  const [tutorMessages, setTutorMessages] = useState<TutorMessage[]>([
    {
      id: 'msg_welcome',
      sender: 'tutor',
      text: `Hello ${user.name || 'Krishna'}! I am your IntelliScribe AI Tutor connected to your live document database.\n\nUpload any document or ask me questions about your syllabus to get started!`,
      timestamp: 'Just now',
      suggestedFollowups: [
        'Explain key definitions simply',
        'Generate practice questions on my uploaded notes',
        'Summarize the core takeaways',
      ],
    },
  ]);
  const [socraticMode, setSocraticMode] = useState<boolean>(false);

  // Global search modal & notifications
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 'n1', title: 'Daily Goal Complete', message: 'You reviewed 32 minutes today. Keep the streak!', time: '10m ago', read: false },
    { id: 'n2', title: 'New Badge Unlocked', message: 'Consensus Master earned (+100 XP)', time: '1h ago', read: false },
    { id: 'n3', title: 'Spaced Repetition Due', message: '8 flashcards in Box 1 & 2 are waiting for review', time: '2h ago', read: true },
  ]);

  // Pomodoro focus state
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [pomodoroMode, setPomodoroMode] = useState<'focus' | 'break'>('focus');
  const [soundscape, setSoundscape] = useState<'none' | 'rain' | 'lofi' | 'library'>('none');

  // Load real documents & quizzes directly for this specific user
  const refreshFromDatabase = useCallback(() => {
    const userEmailParam = user?.email ? `?userEmail=${encodeURIComponent(user.email)}` : '';

    fetch(`/api/db/documents${userEmailParam}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setDocuments(data);
          if (data.length > 0) {
            setSelectedDocId((prev) => prev || data[0].id);
          } else {
            setSelectedDocId('');
          }
        }
      })
      .catch((err) => console.log('Database load notice:', err));

    fetch(`/api/db/quizzes${userEmailParam}`)
      .then((res) => res.json())
      .then((quizData) => {
        if (Array.isArray(quizData)) {
          setQuizzes(quizData);
          if (quizData.length > 0) {
            setSelectedQuizId((prev) => prev || quizData[0].id);
          } else {
            setSelectedQuizId('');
          }
        }
      })
      .catch((err) => console.log('Quiz database load notice:', err));
  }, [user?.email]);

  useEffect(() => {
    refreshFromDatabase();
  }, [refreshFromDatabase, user?.email]);



  // Currently selected document
  const activeDocument = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || documents[0];
  }, [documents, selectedDocId]);

  // Currently selected course
  const activeCourse = useMemo(() => {
    return courses.find((c) => c.id === selectedCourseId) || courses[0];
  }, [courses, selectedCourseId]);

  // Currently selected lesson
  const activeLesson = useMemo(() => {
    for (const mod of activeCourse?.modules || []) {
      const found = mod.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return activeCourse?.modules?.[0]?.lessons?.[0];
  }, [activeCourse, selectedLessonId]);

  // Currently selected summary
  const activeSummary = useMemo(() => {
    return summaries.find((s) => s.documentId === selectedDocId) || summaries[0];
  }, [summaries, selectedDocId]);

  // Flashcards for current document or all
  const filteredFlashcards = useMemo(() => {
    return flashcards.filter((f) => f.documentId === selectedDocId);
  }, [flashcards, selectedDocId]);

  // Flashcards due today
  const dueFlashcards = useMemo(() => {
    return filteredFlashcards.filter((f) => f.nextReviewDate === 'Today' || f.box <= 2);
  }, [filteredFlashcards]);

  // Award XP helper
  const awardXp = useCallback((amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.totalXp + amount;
      const newLevel = Math.floor(newXp / 600) + 1;
      return {
        ...prev,
        totalXp: newXp,
        level: newLevel,
      };
    });
    setNotifications((prev) => [
      {
        id: `xp_${Date.now()}`,
        title: `+${amount} XP Earned!`,
        message: reason,
        time: 'Just now',
        read: false,
      },
      ...prev,
    ]);
  }, []);

  // Update Flashcard after Leitner review
  const reviewFlashcard = useCallback((cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id !== cardId) return c;
        let newBox: LeitnerBox = c.box;
        let nextDate = 'Tomorrow';

        if (rating === 'again') {
          newBox = 1;
          nextDate = 'Today';
        } else if (rating === 'hard') {
          newBox = Math.max(1, c.box) as LeitnerBox;
          nextDate = 'In 2 days';
        } else if (rating === 'good') {
          newBox = Math.min(5, c.box + 1) as LeitnerBox;
          nextDate = newBox === 5 ? 'In 7 days' : 'In 4 days';
        } else if (rating === 'easy') {
          newBox = Math.min(5, c.box + 2) as LeitnerBox;
          nextDate = 'In 7 days';
        }

        return {
          ...c,
          box: newBox,
          nextReviewDate: nextDate,
          repetitions: c.repetitions + 1,
          lastReviewedAt: 'Just now',
        };
      })
    );
    awardXp(15, 'Flashcard reviewed');
  }, [awardXp]);

  // Mark lesson as complete
  const completeLesson = useCallback((lessonId: string) => {
    setCourses((prev) =>
      prev.map((crs) => ({
        ...crs,
        modules: crs.modules.map((mod) => ({
          ...mod,
          lessons: mod.lessons.map((les) =>
            les.id === lessonId ? { ...les, completed: true } : les
          ),
        })),
      }))
    );
    awardXp(50, 'Lesson mastered');
  }, [awardXp]);

  // Document upload & 6-stage pipeline simulator
  const uploadAndProcessDocument = useCallback(
    (fileData: { name: string; size: string; type: any; textContent?: string }) => {
      const newDocId = `doc_${Date.now()}`;
      const newSummaryId = `sum_${Date.now()}`;
      const newCourseId = `crs_${Date.now()}`;

      const initialNewDoc: DocumentItem = {
        id: newDocId,
        title: fileData.name.replace(/\.[^/.]+$/, ''),
        fileName: fileData.name,
        fileSize: fileData.size || '3.2 MB',
        fileType: fileData.type || 'pdf',
        uploadedAt: 'Just now',
        status: 'parsing',
        progressPercent: 15,
        currentStepMessage: 'Stage 1/6: Virus sanitization & PDF parsing initiated...',
        pageCount: 16,
        wordCount: 5400,
        summaryId: newSummaryId,
        courseId: newCourseId,
        tags: ['New Upload', 'Document Extraction', 'Auto-Synthesized'],
        chunks: [],
      };

      setDocuments((prev) => [initialNewDoc, ...prev]);
      setSelectedDocId(newDocId);
      setActiveTab('documents');

      // Simulate the 6 processing pipeline stages
      const stages: { status: any; progress: number; msg: string; delay: number }[] = [
        { status: 'ocr', progress: 32, msg: 'Stage 2/6: Tesseract OCR & Layout segmentation parsing tables & headings...', delay: 1200 },
        { status: 'chunking', progress: 55, msg: 'Stage 3/6: Semantic chunking with 512-token sliding window...', delay: 2400 },
        { status: 'embedding', progress: 75, msg: 'Stage 4/6: Generating vector embeddings & entity extraction...', delay: 3800 },
        { status: 'synthesizing', progress: 92, msg: 'Stage 5/6: Synthesizing Course Syllabus, Spaced Repetition Cards & Quiz...', delay: 5200 },
        { status: 'ready', progress: 100, msg: 'Stage 6/6: Complete! Knowledge graph & interactive tutor ready.', delay: 6800 },
      ];

      stages.forEach(({ status, progress, msg, delay }) => {
        setTimeout(() => {
          setDocuments((prevDocs) =>
            prevDocs.map((d) => {
              if (d.id !== newDocId) return d;
              const isReady = status === 'ready';
              return {
                ...d,
                status,
                progressPercent: progress,
                currentStepMessage: msg,
                chunks: isReady
                  ? [
                      {
                        id: `chunk_${Date.now()}_1`,
                        chunkIndex: 0,
                        page: 1,
                        text: `${d.title} establishes high-yield theoretical frameworks and execution pipelines with verifiable consistency bounds.`,
                        tokenCount: 42,
                        keyEntities: ['Core Framework', 'Execution Pipeline', 'Invariants'],
                      },
                      {
                        id: `chunk_${Date.now()}_2`,
                        chunkIndex: 1,
                        page: 4,
                        text: `Key practical mechanisms require strict state validation, error telemetry, and fault-tolerant boundaries.`,
                        tokenCount: 39,
                        keyEntities: ['State Validation', 'Telemetry', 'Fault Tolerance'],
                      },
                    ]
                  : d.chunks,
              };
            })
          );

          if (status === 'ready') {
            // Persist document to database so it stays permanently in database.json and upon refresh
            fetch('/api/ai/upload-and-summarize', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                docName: initialNewDoc.fileName,
                textContent: `${initialNewDoc.title}: Theoretical foundations, operational invariants, and modular architectures extracted from your document.`,
                userEmail: user?.email || undefined,
              }),
            })
              .then((res) => res.json())
              .then((dbData) => {
                if (dbData?.id) {
                  // Link backend persistent record
                  console.log('Document stored in persistent database:', dbData.id);
                }
              })
              .catch((err) => console.log('Storage note:', err));

            // Add synthesized Course
            const newCourse: Course = {
              id: newCourseId,
              documentId: newDocId,
              title: initialNewDoc.title,
              code: 'DOC-AUTO',
              description: `Master key concepts synthesized from ${initialNewDoc.title}. Includes interactive lessons, deep dive notes, and audio summaries.`,
              thumbnailGradient: 'from-violet-600 via-purple-600 to-pink-600',
              level: 'Intermediate',
              estimatedHours: 6,
              progressPercent: 0,
              modules: [
                {
                  id: `mod_${Date.now()}_1`,
                  title: 'Module 1: Core Fundamentals & Principles',
                  description: 'Core concepts, architectures, and theoretical foundations.',
                  order: 1,
                  lessons: [
                    {
                      id: `les_${Date.now()}_1`,
                      moduleId: `mod_${Date.now()}_1`,
                      title: '1.1 System Foundations & Architecture',
                      durationMinutes: 12,
                      completed: false,
                      keyConcepts: ['Structural Architecture', 'Operational Invariants'],
                      contentMarkdown: `### Overview of ${initialNewDoc.title}\n\nThis synthesized course breaks down the document into actionable learning units.\n\n- **Primary Purpose:** Establish verifiable invariants and practical understanding.\n- **Key Mechanisms:** State boundaries, fail-safe protocols, and modular transitions.`,
                      deepDiveNotes: `Remember to test boundary conditions when reviewing this material.`,
                      audioScript: `Welcome to this synthesized lesson on ${initialNewDoc.title}. We will cover the main architectural insights.`,
                      audioDurationSeconds: 120,
                    },
                  ],
                },
              ],
            };
            setCourses((prev) => [newCourse, ...prev]);

            // Add synthesized Summary
            const newSummary: Summary = {
              id: newSummaryId,
              documentId: newDocId,
              title: `Summary: ${initialNewDoc.title}`,
              executiveSummary: `This executive synthesis condenses ${initialNewDoc.title} into essential frameworks, core principles, and actionable models.`,
              keyTakeaways: [
                'Decomposes complex interactions into modular verified stages',
                'Enforces deterministic safety invariants across all execution paths',
                'Provides high-yield exam and implementation mastery points',
              ],
              coreTheorems: [
                {
                  title: 'Primary Operational Invariant',
                  explanation: 'Systematic consistency is preserved through verified validation before state mutation.',
                  formulaOrCode: 'State_{t+1} = Validate(State_t, Transition)',
                },
              ],
              outlineTree: [
                { id: 'o1', title: '1. Theoretical Framework', level: 1 },
                { id: 'o2', title: '2. Implementation Details', level: 1 },
              ],
            };
            setSummaries((prev) => [newSummary, ...prev]);

            // Add synthesized Flashcards
            const newCards: Flashcard[] = [
              {
                id: `fc_${Date.now()}_1`,
                documentId: newDocId,
                courseId: newCourseId,
                front: `What is the primary objective established in ${initialNewDoc.title}?`,
                back: 'To establish verifiable state consistency and fault-tolerant operations.',
                hint: 'Look at the introductory thesis.',
                tag: 'Foundations',
                box: 1,
                repetitions: 0,
                easeFactor: 2.5,
                nextReviewDate: 'Today',
              },
              {
                id: `fc_${Date.now()}_2`,
                documentId: newDocId,
                courseId: newCourseId,
                front: `What boundary condition is critical in ${initialNewDoc.title}?`,
                back: 'Ensuring quorum safety and deterministic state playback during recovery.',
                hint: 'Safety over partition tolerance.',
                tag: 'Mechanics',
                box: 1,
                repetitions: 0,
                easeFactor: 2.5,
                nextReviewDate: 'Today',
              },
            ];
            setFlashcards((prev) => [...newCards, ...prev]);

            // Add synthesized Quiz
            const newQuiz: Quiz = {
              id: `qz_${Date.now()}`,
              documentId: newDocId,
              title: `Assessment: ${initialNewDoc.title}`,
              difficulty: 'Intermediate',
              timeLimitMinutes: 8,
              questions: [
                {
                  id: `q_${Date.now()}_1`,
                  type: 'mcq',
                  question: `Which invariant is foundational in ${initialNewDoc.title}?`,
                  options: [
                    'Deterministic state verification prior to commit',
                    'Arbitrary unlogged mutation across isolated nodes',
                    'Ignoring network failure conditions',
                    'Disabling audit logs to maximize throughput',
                  ],
                  correctAnswerIndex: 0,
                  explanation: 'Deterministic state verification ensures all participating nodes produce identical outcomes upon playback.',
                  hint: 'Focus on deterministic guarantees.',
                  conceptTag: 'Core Invariants',
                },
              ],
            };
            setQuizzes((prev) => [newQuiz, ...prev]);

            awardXp(120, `Successfully processed "${initialNewDoc.title}"`);
          }
        }, delay);
      });
    },
    [awardXp]
  );

  // Send Tutor message
  const sendTutorMessage = useCallback(
    async (text: string, aiModel: string = 'gemini') => {
      const userMsg: TutorMessage = {
        id: `usr_${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setTutorMessages((prev) => [...prev, userMsg]);

      // Prepare context chunks from active document
      const contextChunks = activeDocument?.chunks?.map((c) => ({
        page: c.page,
        text: c.text,
      })) || [];

      try {
        const res = await fetch('/api/ai/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: text,
            documentTitle: activeDocument?.title || 'Study Material',
            contextChunks,
            conversationHistory: tutorMessages.slice(-4).map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text,
            })),
            socraticMode,
            aiModel,
          }),
        });

        const data = await res.json();
        const aiMsg: TutorMessage = {
          id: `tut_${Date.now()}`,
          sender: 'tutor',
          text: data.answer || 'Analyzing your inquiry with our academic knowledge graph...',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: data.citations || [],
          suggestedFollowups: data.suggestedFollowups || [],
          isSocratic: socraticMode,
        };
        setTutorMessages((prev) => [...prev, aiMsg]);
        awardXp(20, 'Tutor interaction');
      } catch (err) {
        // Fallback message
        const fallbackMsg: TutorMessage = {
          id: `tut_fallback_${Date.now()}`,
          sender: 'tutor',
          text: `Analyzing **${activeDocument?.title}** regarding "${text}":\n\n` +
            `The core insight revolves around deterministic state reproduction and strict quorum safety. ` +
            `In distributed systems and scientific proofs, safety guarantees must remain preserved even under adversarial or degraded conditions.\n\n` +
            (socraticMode
              ? `*Socratic question for you:* What happens to the system state if a partition prevents acknowledgment from reaching the quorum?`
              : `*Exam Note:* Pay close attention to the trade-offs between linearizability and availability.`),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: [
            {
              documentName: activeDocument?.title || 'Course Material',
              snippet: 'Quorum validation guarantees safety invariants across all node transitions.',
              page: 2,
            },
          ],
          suggestedFollowups: [
            'Can you give me a step-by-step example?',
            'What are the most common edge cases?',
            'Generate a flashcard on this concept',
          ],
        };
        setTutorMessages((prev) => [...prev, fallbackMsg]);
      }
    },
    [activeDocument, tutorMessages, socraticMode, awardXp]
  );

  return {
    activeTab,
    setActiveTab,
    user,
    setUser,
    documents,
    setDocuments,
    selectedDocId,
    setSelectedDocId,
    activeDocument,
    courses,
    selectedCourseId,
    setSelectedCourseId,
    activeCourse,
    selectedLessonId,
    setSelectedLessonId,
    activeLesson,
    summaries,
    activeSummary,
    flashcards,
    filteredFlashcards,
    dueFlashcards,
    reviewFlashcard,
    quizzes,
    selectedQuizId,
    setSelectedQuizId,
    knowledgeGraph,
    dailyActivities,
    weakTopics,
    revisionTasks,
    setRevisionTasks,
    exams,
    classrooms,
    tutorMessages,
    sendTutorMessage,
    socraticMode,
    setSocraticMode,
    isSearchOpen,
    setIsSearchOpen,
    notifications,
    setNotifications,
    pomodoroRunning,
    setPomodoroRunning,
    pomodoroSeconds,
    setPomodoroSeconds,
    pomodoroMode,
    setPomodoroMode,
    soundscape,
    setSoundscape,
    completeLesson,
    uploadAndProcessDocument,
    courseSubTab,
    setCourseSubTab,
    awardXp,
    isLoggedIn,
    setIsLoggedIn,
    login: (name: string, email: string, avatarUrl?: string) => {
      setIsLoggedIn(true);
      const updatedUser = {
        ...user,
        name,
        email,
        ...(avatarUrl ? { avatarUrl } : {}),
      };
      setUser(updatedUser);
      localStorage.setItem('intelliscribe_logged_in', 'true');
      localStorage.setItem('intelliscribe_user', JSON.stringify(updatedUser));
      localStorage.setItem('intelliscribe_active_tab', 'dashboard');
      setActiveTab('dashboard');
    },
    logout: () => {
      setIsLoggedIn(false);
      setUser(INITIAL_USER);
      localStorage.setItem('intelliscribe_logged_in', 'false');
      localStorage.removeItem('intelliscribe_user');
      localStorage.setItem('intelliscribe_active_tab', 'landing');
      setActiveTab('landing');
    },
  };
}
