import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, User } from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExamUtils } from "@/lib/exam-utils";
import { Exam, ExamSession, StudentAnswer } from "@/lib/exam-types";
import QuestionRenderer from "@/components/question-renderer";
import Timer from "@/components/timer";
import ExamNavigation from "@/components/exam-navigation";
import { useToast } from "@/hooks/use-toast";

export default function ExamInterface() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [exam, setExam] = useState<Exam | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const sessionData = Storage.getSession();
    if (!sessionData) {
      setLocation('/student');
      return;
    }

    const examData = Storage.getExam(sessionData.examId);
    if (!examData) {
      setLocation('/student');
      return;
    }

    setSession(sessionData);
    setExam(examData);
    setAnswers(sessionData.answers);
    setTimeRemaining(examData.timer * 60); // Convert minutes to seconds
  }, [setLocation]);

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    const newAnswers = answers.filter(a => a.questionId !== questionId);
    newAnswers.push({ questionId, answer });
    setAnswers(newAnswers);
    
    // Update session
    if (session) {
      const updatedSession = { ...session, answers: newAnswers };
      Storage.saveSession(updatedSession);
    }
  };

  const handleSubmitExam = () => {
    if (!exam || !session) return;

    const { score, totalPoints } = ExamUtils.gradeExam(exam.questions, answers);
    const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
    const timeSpent = ExamUtils.calculateTimeSpent(session.startTime, new Date());

    const result = {
      examId: exam.id,
      examTitle: exam.title,
      studentName: session.studentName,
      score,
      totalPoints,
      percentage,
      completedAt: new Date(),
      timeSpent,
      answers
    };

    Storage.saveResult(result);
    Storage.clearSession();
    
    setLocation('/results');
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Your exam has been automatically submitted",
    });
    handleSubmitExam();
  };

  if (!exam || !session) {
    return <div>Loading...</div>;
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion.id);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Exam Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-primary rounded-lg flex items-center justify-center">
                <ClipboardList className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">{exam.title}</h1>
                <p className="text-sm text-slate-600">Student: <span>{session.studentName}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-700">Time Remaining</p>
                <Timer
                  initialTime={timeRemaining}
                  onTimeUp={handleTimeUp}
                  className="text-lg font-bold text-red-600"
                />
              </div>
              <Button
                onClick={handleSubmitExam}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Question Navigation */}
          <div className="lg:col-span-1">
            <ExamNavigation
              questions={exam.questions}
              answers={answers}
              currentQuestionIndex={currentQuestionIndex}
              onQuestionSelect={setCurrentQuestionIndex}
            />
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-slate-600">
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </span>
                    <span className="text-sm text-slate-600">
                      {currentQuestion.type.toUpperCase()} - {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <QuestionRenderer
                  question={currentQuestion}
                  answer={currentAnswer?.answer}
                  onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                />

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))}
                    disabled={currentQuestionIndex === exam.questions.length - 1}
                    className="bg-primary hover:bg-blue-700 px-6 py-2"
                  >
                    Next
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
