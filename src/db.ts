import fs from 'fs';
import path from 'path';

export interface DocumentRecord {
  id: string;
  userEmail?: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  uploadedAt: string;
  status: string;
  progressPercent: number;
  currentStepMessage: string;
  pageCount: number;
  wordCount: number;
  summaryText: string;
  keyTakeaways: string[];
}

export interface QuizQuestionRecord {
  id: string;
  type: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint: string;
  conceptTag: string;
}

export interface QuizRecord {
  id: string;
  documentId: string;
  userEmail?: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeLimitMinutes: number;
  questions: QuizQuestionRecord[];
}

export interface DatabaseSchema {
  documents: DocumentRecord[];
  quizzes: QuizRecord[];
}

const DB_FILE = path.join(process.cwd(), 'database.json');

function loadData(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial: DatabaseSchema = { documents: [], quizzes: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      documents: parsed.documents || [],
      quizzes: parsed.quizzes || [],
    };
  } catch (err) {
    console.error('Error loading database:', err);
    return { documents: [], quizzes: [] };
  }
}

function saveData(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing database:', err);
  }
}

export const db = {
  getDocuments(userEmail?: string): DocumentRecord[] {
    const docs = loadData().documents || [];
    if (userEmail && userEmail.trim()) {
      return docs.filter((d) => !d.userEmail || d.userEmail.toLowerCase() === userEmail.toLowerCase().trim());
    }
    return docs;
  },

  addDocument(doc: DocumentRecord) {
    const data = loadData();
    data.documents = [doc, ...(data.documents || [])];
    saveData(data);
    return doc;
  },

  getQuizzes(userEmail?: string): QuizRecord[] {
    const quizzes = loadData().quizzes || [];
    if (userEmail && userEmail.trim()) {
      return quizzes.filter((q) => !q.userEmail || q.userEmail.toLowerCase() === userEmail.toLowerCase().trim());
    }
    return quizzes;
  },

  addQuiz(quiz: QuizRecord) {
    const data = loadData();
    data.quizzes = [quiz, ...(data.quizzes || [])];
    saveData(data);
    return quiz;
  },

  deleteDocument(id: string) {
    const data = loadData();
    data.documents = (data.documents || []).filter((d) => d.id !== id);
    data.quizzes = (data.quizzes || []).filter((q) => q.documentId !== id);
    saveData(data);
  },

  clearAll(userEmail?: string) {
    const data = loadData();
    if (userEmail && userEmail.trim()) {
      const emailLower = userEmail.toLowerCase().trim();
      data.documents = (data.documents || []).filter((d) => d.userEmail && d.userEmail.toLowerCase() !== emailLower);
      data.quizzes = (data.quizzes || []).filter((q) => q.userEmail && q.userEmail.toLowerCase() !== emailLower);
      saveData(data);
    } else {
      saveData({ documents: [], quizzes: [] });
    }
  },

  countDocuments(userEmail?: string): number {
    return this.getDocuments(userEmail).length;
  }
};
