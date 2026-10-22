export type UserRole = 'student' | 'educator' | 'researcher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  streakDays: number;
  totalXp: number;
  level: number;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  badges: Badge[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'mastery' | 'quiz' | 'contribution';
}

export type ProcessingStatus = 'pending' | 'parsing' | 'ocr' | 'chunking' | 'embedding' | 'synthesizing' | 'ready' | 'error';

export interface DocumentChunk {
  id: string;
  chunkIndex: number;
  page: number;
  text: string;
  tokenCount: number;
  keyEntities: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'txt' | 'markdown' | 'ocr_image';
  uploadedAt: string;
  status: ProcessingStatus;
  progressPercent: number;
  currentStepMessage?: string;
  pageCount: number;
  wordCount: number;
  summaryId?: string;
  courseId?: string;
  tags: string[];
  chunks: DocumentChunk[];
  rawText?: string;
  summaryText?: string;
  keyTakeaways?: string[];
}

export interface Course {
  id: string;
  documentId: string;
  title: string;
  code: string;
  description: string;
  thumbnailGradient: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedHours: number;
  progressPercent: number;
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  keyConcepts: string[];
  contentMarkdown: string;
  deepDiveNotes: string;
  audioScript: string;
  audioDurationSeconds: number;
}

export interface OutlineNode {
  id: string;
  title: string;
  level: number;
  description?: string;
  children?: OutlineNode[];
}

export interface Summary {
  id: string;
  documentId: string;
  title: string;
  executiveSummary: string;
  keyTakeaways: string[];
  coreTheorems: {
    title: string;
    explanation: string;
    formulaOrCode?: string;
  }[];
  outlineTree: OutlineNode[];
}

export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface Flashcard {
  id: string;
  documentId: string;
  courseId?: string;
  front: string;
  back: string;
  hint: string;
  tag: string;
  box: LeitnerBox;
  lastReviewedAt?: string;
  nextReviewDate: string;
  repetitions: number;
  easeFactor: number;
}

export type QuestionType = 'mcq' | 'multiple_choice' | 'true_false' | 'scenario';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  conceptTag: string;
}

export interface Quiz {
  id: string;
  documentId: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimitMinutes: number;
  questions: QuizQuestion[];
  bestScore?: number;
  lastAttemptDate?: string;
}

export interface Citation {
  documentName: string;
  snippet: string;
  page: number;
  chunkId?: string;
}

export interface TutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  citations?: Citation[];
  suggestedFollowups?: string[];
  isSocratic?: boolean;
}

export interface GraphNode {
  id: string;
  label: string;
  category: 'Core Concept' | 'Theory' | 'Application' | 'Formula' | 'Algorithm';
  size: number;
  description: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  relatedFlashcardCount?: number;
  relatedQuizCount?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: 'depends on' | 'derives from' | 'applied in' | 'relates to' | 'implements';
}

export interface KnowledgeGraphData {
  documentId: string;
  nodes: GraphNode[];
  links: GraphLink[];
}

export interface DailyActivity {
  day: string; // e.g. Mon, Tue
  date: string;
  minutes: number;
  cardsReviewed: number;
  quizzesTaken: number;
}

export interface WeakTopic {
  topic: string;
  accuracy: number;
  totalAttempts: number;
  recommendedLessonId?: string;
  recommendedAction: string;
}

export interface RevisionTask {
  id: string;
  title: string;
  documentTitle: string;
  dueDate: string;
  dueTime: string;
  cardCount: number;
  estimatedMinutes: number;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface ExamCountdown {
  id: string;
  courseTitle: string;
  examDate: string;
  targetScore: string;
  daysRemaining: number;
}

export interface ClassroomGroup {
  id: string;
  name: string;
  code: string;
  membersCount: number;
  sharedDecksCount: number;
  activeBattles: number;
  leaderboard: {
    rank: number;
    name: string;
    avatar: string;
    points: number;
  }[];
}
