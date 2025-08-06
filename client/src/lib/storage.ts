import { Exam, ExamResult, ExamSession } from './exam-types';

const EXAMS_KEY = 'cbt_exams';
const RESULTS_KEY = 'cbt_results';
const SESSION_KEY = 'cbt_current_session';

export class Storage {
  static saveExam(exam: Exam): void {
    const exams = this.getExams();
    const existingIndex = exams.findIndex(e => e.id === exam.id);
    
    if (existingIndex >= 0) {
      exams[existingIndex] = exam;
    } else {
      exams.push(exam);
    }
    
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }

  static getExams(): Exam[] {
    const data = localStorage.getItem(EXAMS_KEY);
    return data ? JSON.parse(data) : [];
  }

  static getExam(id: string): Exam | null {
    const exams = this.getExams();
    return exams.find(e => e.id === id) || null;
  }

  static deleteExam(id: string): void {
    const exams = this.getExams().filter(e => e.id !== id);
    localStorage.setItem(EXAMS_KEY, JSON.stringify(exams));
  }

  static saveResult(result: ExamResult): void {
    const results = this.getResults();
    results.push(result);
    localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }

  static getResults(examId?: string): ExamResult[] {
    const data = localStorage.getItem(RESULTS_KEY);
    const results = data ? JSON.parse(data) : [];
    return examId ? results.filter((r: ExamResult) => r.examId === examId) : results;
  }

  static saveSession(session: ExamSession): void {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  static getSession(): ExamSession | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  }

  static clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  static exportExamToFile(exam: Exam): void {
    const dataStr = JSON.stringify(exam, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.question`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static importExamFromFile(file: File): Promise<Exam> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const exam = JSON.parse(e.target?.result as string);
          if (this.validateExam(exam)) {
            resolve(exam);
          } else {
            reject(new Error('Invalid exam file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse exam file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  static exportResultsToCSV(results: ExamResult[], examTitle: string): void {
    const headers = ['Student Name', 'Score', 'Total Points', 'Percentage', 'Grade', 'Date Completed', 'Time Spent (min)'];
    const rows = results.map(result => [
      result.studentName,
      result.score.toString(),
      result.totalPoints.toString(),
      `${result.percentage.toFixed(1)}%`,
      this.calculateGrade(result.percentage),
      new Date(result.completedAt).toLocaleDateString(),
      result.timeSpent.toString()
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${examTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static validateExam(exam: any): exam is Exam {
    return (
      exam &&
      typeof exam.id === 'string' &&
      typeof exam.title === 'string' &&
      typeof exam.timer === 'number' &&
      typeof exam.studentPassword === 'string' &&
      typeof exam.gradePassword === 'string' &&
      Array.isArray(exam.questions)
    );
  }

  private static calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  }
}
