import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Plus } from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExamUtils } from "@/lib/exam-utils";
import { Exam, Question } from "@/lib/exam-types";
import QuestionBuilder from "@/components/question-builder";
import { useToast } from "@/hooks/use-toast";

export default function CreateExam() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [examTitle, setExamTitle] = useState("");
  const [examTimer, setExamTimer] = useState(60);
  const [studentPassword, setStudentPassword] = useState("");
  const [gradePassword, setGradePassword] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false);

  const handleSaveExam = () => {
    if (!examTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter an exam title",
        variant: "destructive"
      });
      return;
    }

    if (!studentPassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a student password",
        variant: "destructive"
      });
      return;
    }

    if (!gradePassword.trim()) {
      toast({
        title: "Error",
        description: "Please enter a grade password",
        variant: "destructive"
      });
      return;
    }

    if (questions.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one question",
        variant: "destructive"
      });
      return;
    }

    const exam: Exam = {
      id: ExamUtils.generateId(),
      title: examTitle,
      timer: examTimer,
      studentPassword,
      gradePassword,
      questions,
      createdAt: new Date()
    };

    Storage.saveExam(exam);
    Storage.exportExamToFile(exam);
    
    toast({
      title: "Success",
      description: "Exam saved and exported successfully",
    });

    // Reset form
    setExamTitle("");
    setExamTimer(60);
    setStudentPassword("");
    setGradePassword("");
    setQuestions([]);
  };

  const handleAddQuestion = (question: Question) => {
    setQuestions([...questions, question]);
    setShowQuestionBuilder(false);
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/teacher')}
                className="text-slate-600 hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <Plus className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Create New Exam</h1>
                <p className="text-sm text-slate-600">Build your examination</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleSaveExam}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Exam
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Exam Settings */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Exam Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Exam Title</Label>
                    <Input
                      id="title"
                      value={examTitle}
                      onChange={(e) => setExamTitle(e.target.value)}
                      placeholder="Enter exam title..."
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timer">Exam Timer (minutes)</Label>
                    <Input
                      id="timer"
                      type="number"
                      value={examTimer}
                      onChange={(e) => setExamTimer(parseInt(e.target.value) || 60)}
                      placeholder="60"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="studentPass">Student Password</Label>
                    <Input
                      id="studentPass"
                      value={studentPassword}
                      onChange={(e) => setStudentPassword(e.target.value)}
                      placeholder="Enter access password..."
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="gradePass">Grade Password</Label>
                    <Input
                      id="gradePass"
                      type="password"
                      value={gradePassword}
                      onChange={(e) => setGradePassword(e.target.value)}
                      placeholder="Enter grade password..."
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Management */}
          <div className="lg:col-span-2">
            {/* Question Builder */}
            {showQuestionBuilder ? (
              <QuestionBuilder
                onSave={handleAddQuestion}
                onCancel={() => setShowQuestionBuilder(false)}
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-slate-800">Questions</h3>
                    <Button
                      onClick={() => setShowQuestionBuilder(true)}
                      className="bg-primary hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                  
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <div key={question.id} className="border border-slate-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="text-sm font-medium text-slate-600">
                                  Question {index + 1}
                                </span>
                                <span className="text-xs bg-slate-100 px-2 py-1 rounded">
                                  {question.type.toUpperCase()}
                                </span>
                                <span className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">
                                  {question.points} pts
                                </span>
                              </div>
                              <p className="text-slate-800 mb-2">{question.text}</p>
                              {question.options && (
                                <div className="text-sm text-slate-600">
                                  Options: {question.options.join(', ')}
                                </div>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Plus className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <p>No questions added yet</p>
                      <p className="text-sm">Click "Add Question" to get started</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
