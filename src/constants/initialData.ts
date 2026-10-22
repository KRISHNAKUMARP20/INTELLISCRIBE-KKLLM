import {
  UserProfile,
  DocumentItem,
  Course,
  Summary,
  Flashcard,
  Quiz,
  KnowledgeGraphData,
  DailyActivity,
  WeakTopic,
  RevisionTask,
  ExamCountdown,
  ClassroomGroup
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_guest',
  name: 'Student',
  email: '',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  streakDays: 1,
  totalXp: 0,
  level: 1,
  dailyGoalMinutes: 30,
  todayStudyMinutes: 0,
  badges: [],
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_COURSES: Course[] = [];

export const INITIAL_SUMMARIES: Summary[] = [];

export const INITIAL_FLASHCARDS: Flashcard[] = [];

export const INITIAL_QUIZZES: Quiz[] = [];

export const INITIAL_KNOWLEDGE_GRAPH: KnowledgeGraphData = {
  documentId: '',
  nodes: [],
  links: [],
};

export const INITIAL_DAILY_ACTIVITY: DailyActivity[] = [
  { day: 'Mon', date: 'Oct 07', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Tue', date: 'Oct 08', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Wed', date: 'Oct 09', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Thu', date: 'Oct 10', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Fri', date: 'Oct 11', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Sat', date: 'Oct 12', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
  { day: 'Sun', date: 'Oct 13', minutes: 0, cardsReviewed: 0, quizzesTaken: 0 },
];

export const INITIAL_WEAK_TOPICS: WeakTopic[] = [];

export const INITIAL_REVISION_TASKS: RevisionTask[] = [];

export const INITIAL_EXAMS: ExamCountdown[] = [];

export const INITIAL_CLASSROOMS: ClassroomGroup[] = [];

