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
               Array.from(answerSet).every(a => correctSet.has(a));
      
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

  static calculateTimeSpent(startTime: Date | string, endTime: Date): number {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    return Math.round((endTime.getTime() - start.getTime()) / (1000 * 60));
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

  static async createQuestionsFolder(): Promise<FileSystemDirectoryHandle | null> {
    try {
      // Check if File System Access API is supported
      if ('showDirectoryPicker' in window) {
        // Request access to Downloads directory or let user choose
        const downloadsHandle = await (window as any).showDirectoryPicker({
          suggestedName: 'Downloads',
          mode: 'readwrite'
        });
        
        // Create or get the questions folder
        const questionsHandle = await downloadsHandle.getDirectoryHandle('questions', {
          create: true
        });
        
        return questionsHandle;
      }
    } catch (error) {
      console.log('File System Access API not available or user cancelled');
    }
    return null;
  }

  static async exportToQuestionsFolder(exam: any, filename: string) {
    const questionsFolder = await this.createQuestionsFolder();
    
    if (questionsFolder) {
      try {
        // Create file in questions folder
        const fileHandle = await questionsFolder.getFileHandle(filename, { create: true });
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(exam, null, 2));
        await writable.close();
        return true;
      } catch (error) {
        console.error('Error saving to questions folder:', error);
      }
    }
    
    // Fallback to regular download
    this.downloadFile(JSON.stringify(exam, null, 2), filename, 'application/json');
    return false;
  }

  static downloadFile(content: string, filename: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static async openQuestionsFolder(): Promise<FileList | null> {
    try {
      // Try to open the questions folder directly
      if ('showDirectoryPicker' in window) {
        const questionsHandle = await this.createQuestionsFolder();
        if (questionsHandle) {
          // Create a file input to simulate file selection from the folder
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.question,.json';
          input.multiple = false;
          
          return new Promise((resolve) => {
            input.onchange = (e) => {
              const files = (e.target as HTMLInputElement).files;
              resolve(files);
            };
            input.click();
          });
        }
      }
    } catch (error) {
      console.log('Could not access questions folder, using file picker');
    }
    
    // Fallback to regular file picker
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.question,.json';
    input.multiple = false;
    
    return new Promise((resolve) => {
      input.onchange = (e) => {
        const files = (e.target as HTMLInputElement).files;
        resolve(files);
      };
      input.click();
    });
  }
}
