export type QuestionType = 'mcq' | 'true-false' | 'fill-blank' | 'checkbox' | 'image' | 'subjective';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  image?: string;
  options?: string[];
  correctAnswers: string[];
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  timer: number; // in minutes
  studentPassword: string;
  gradePassword: string;
  questions: Question[];
  createdAt: Date;
}

export interface StudentAnswer {
  questionId: string;
  answer: string | string[];
}

export interface ExamSession {
  examId: string;
  studentName: string;
  answers: StudentAnswer[];
  startTime: Date;
  endTime?: Date;
  timeRemaining?: number;
}

export interface ExamResult {
  examId: string;
  examTitle: string;
  studentName: string;
  score: number;
  totalPoints: number;
  percentage: number;
  completedAt: Date;
  timeSpent: number; // in minutes
  answers: StudentAnswer[];
}

export interface ExamStatistics {
  totalStudents: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  results: ExamResult[];
}
