import { Question, StudentAnswer, ExamResult } from './exam-types';

export class ExamUtils {
  static generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  static gradeExam(questions: Question[], answers: StudentAnswer[]): { score: number; totalPoints: number } {
    let score = 0;
    let totalPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const studentAnswer = answers.find(a => a.questionId === question.id);
      
      if (studentAnswer && this.isAnswerCorrect(question, studentAnswer.answer)) {
        score += question.points;
      }
    });

    return { score, totalPoints };
  }

  private static isAnswerCorrect(question: Question, answer: string | string[]): boolean {
    const correctAnswers = question.correctAnswers;
    
    switch (question.type) {
      case 'mcq':
      case 'true-false':
      case 'fill-blank':
      case 'subjective':
        return typeof answer === 'string' && 
               correctAnswers.some(correct => 
                 correct.toLowerCase().trim() === answer.toLowerCase().trim()
               );
      
      case 'checkbox':
        if (!Array.isArray(answer)) return false;
        const answerSet = new Set(answer.map(a => a.toLowerCase().trim()));
        const correctSet = new Set(correctAnswers.map(c => c.toLowerCase().trim()));
        return answerSet.size === correctSet.size && 
               [...answerSet].every(a => correctSet.has(a));
      
      case 'image':
        return typeof answer === 'string' && 
               correctAnswers.some(correct => 
                 correct.toLowerCase().trim() === answer.toLowerCase().trim()
               );
      
      default:
        return false;
    }
  }

  static formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  static calculateTimeSpent(startTime: Date, endTime: Date): number {
    return Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
  }

  static validatePassword(provided: string, required: string): boolean {
    return provided.trim() === required.trim();
  }

  static calculateStatistics(results: ExamResult[]) {
    if (results.length === 0) {
      return {
        totalStudents: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0
      };
    }

    const percentages = results.map(r => r.percentage);
    
    return {
      totalStudents: results.length,
      averageScore: percentages.reduce((sum, p) => sum + p, 0) / percentages.length,
      highestScore: Math.max(...percentages),
      lowestScore: Math.min(...percentages)
    };
  }
}
