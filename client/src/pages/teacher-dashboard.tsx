import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, BarChart3, FolderOpen, BookOpen, User, FileText } from "lucide-react";
import { Storage } from "@/lib/storage";
import { Exam } from "@/lib/exam-types";
import { useToast } from "@/hooks/use-toast";

export default function TeacherDashboard() {
  const [, setLocation] = useLocation();
  const [recentExams, setRecentExams] = useState<Exam[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const exams = Storage.getExams();
    setRecentExams(exams.slice(-5).reverse()); // Show last 5 exams
  }, []);

  const handleLoadExam = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.name.endsWith('.question')) {
      toast({
        title: "Error",
        description: "Please select a valid .question file",
        variant: "destructive"
      });
      return;
    }

    try {
      const exam = await Storage.importExamFromFile(file);
      Storage.saveExam(exam);
      
      toast({
        title: "Success",
        description: "Exam loaded successfully for editing",
      });

      // Refresh recent exams list
      const exams = Storage.getExams();
      setRecentExams(exams.slice(-5).reverse());
      
      // Navigate to edit the exam
      setLocation('/teacher/edit-exam');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load exam file",
        variant: "destructive"
      });
    }
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
                onClick={() => setLocation('/')}
                className="text-slate-600 hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <BookOpen className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Teacher Dashboard</h1>
                <p className="text-sm text-slate-600">Manage exams and grades</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">Welcome, Teacher</span>
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                <User className="text-slate-600 text-sm" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                onClick={() => setLocation('/teacher/create-exam')}
                className="w-full h-auto p-0 justify-start"
              >
                <div className="flex items-center space-x-4 text-left w-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Create New Exam</h3>
                    <p className="text-sm text-slate-600">Build a new examination</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                onClick={() => setLocation('/teacher/grades')}
                className="w-full h-auto p-0 justify-start"
              >
                <div className="flex items-center space-x-4 text-left w-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">View Grades</h3>
                    <p className="text-sm text-slate-600">Manage student results</p>
                  </div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200 cursor-pointer group">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-auto p-0 justify-start"
              >
                <div className="flex items-center space-x-4 text-left w-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderOpen className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Load Exam</h3>
                    <p className="text-sm text-slate-600">Import existing exam file</p>
                  </div>
                </div>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".question"
                onChange={handleLoadExam}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Exams</h3>
            <div className="space-y-3">
              {recentExams.length > 0 ? (
                recentExams.map((exam) => (
                  <div key={exam.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-primary text-sm" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-800">{exam.title}</p>
                        <p className="text-sm text-slate-600">
                          Created {new Date(exam.createdAt).toLocaleDateString()} • {exam.questions.length} questions
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setLocation('/teacher/grades')}
                      className="text-primary hover:text-blue-700 text-sm font-medium"
                    >
                      View Results
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No exams created yet</p>
                  <p className="text-sm">Create your first exam to get started</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
