import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BarChart3, Download, Users, Trophy } from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExamUtils } from "@/lib/exam-utils";
import { Exam, ExamResult } from "@/lib/exam-types";
import { useToast } from "@/hooks/use-toast";

export default function GradeManagement() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExamId, setSelectedExamId] = useState<string>("");
  const [gradePassword, setGradePassword] = useState("");
  const [results, setResults] = useState<ExamResult[]>([]);
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0
  });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const examData = Storage.getExams();
    setExams(examData);
  }, []);

  const handleLoadGrades = () => {
    if (!selectedExamId) {
      toast({
        title: "Error",
        description: "Please select an exam",
        variant: "destructive"
      });
      return;
    }

    const exam = Storage.getExam(selectedExamId);
    if (!exam) {
      toast({
        title: "Error",
        description: "Exam not found",
        variant: "destructive"
      });
      return;
    }

    if (!ExamUtils.validatePassword(gradePassword, exam.gradePassword)) {
      toast({
        title: "Error",
        description: "Incorrect grade password",
        variant: "destructive"
      });
      return;
    }

    const examResults = Storage.getResults(selectedExamId);
    setResults(examResults);
    setStatistics(ExamUtils.calculateStatistics(examResults));
    setShowResults(true);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', bgColor: 'bg-green-100', textColor: 'text-green-800' };
    if (percentage >= 80) return { grade: 'B', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
    if (percentage >= 70) return { grade: 'C', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
    if (percentage >= 60) return { grade: 'D', bgColor: 'bg-orange-100', textColor: 'text-orange-800' };
    return { grade: 'F', bgColor: 'bg-red-100', textColor: 'text-red-800' };
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    
    const exam = Storage.getExam(selectedExamId);
    if (exam) {
      Storage.exportResultsToCSV(results, exam.title);
      toast({
        title: "Success",
        description: "Results exported to CSV successfully",
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
                onClick={() => setLocation('/teacher')}
                className="text-slate-600 hover:text-primary"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Grade Management</h1>
                <p className="text-sm text-slate-600">View and export student results</p>
              </div>
            </div>
            {showResults && (
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleExportCSV}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">Load Exam Grades</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="examSelect">Select Exam</Label>
                  <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose an exam..." />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="gradePassword">Grade Password</Label>
                  <Input
                    id="gradePassword"
                    type="password"
                    value={gradePassword}
                    onChange={(e) => setGradePassword(e.target.value)}
                    placeholder="Enter grade password..."
                    className="mt-2"
                  />
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={handleLoadGrades}
                    className="bg-primary hover:bg-blue-700 w-full"
                  >
                    Load Grades
                  </Button>
                </div>
              </div>
              
              {exams.length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                  <p>No exams found</p>
                  <p className="text-sm">Create an exam first to view grades</p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Total Students</p>
                      <p className="text-2xl font-bold text-slate-800">{statistics.totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Average Score</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {statistics.totalStudents > 0 ? statistics.averageScore.toFixed(1) + '%' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Trophy className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Highest Score</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {statistics.totalStudents > 0 ? statistics.highestScore.toFixed(1) + '%' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <BarChart3 className="text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Lowest Score</p>
                      <p className="text-2xl font-bold text-slate-800">
                        {statistics.totalStudents > 0 ? statistics.lowestScore.toFixed(1) + '%' : 'N/A'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Student Results</h3>
                
                {results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Student Name</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Score</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Grade</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Date Taken</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Time Spent</th>
                          <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {results.map((result, index) => {
                          const gradeInfo = getGrade(result.percentage);
                          return (
                            <tr key={index} className="hover:bg-slate-50">
                              <td className="px-6 py-4 text-sm font-medium text-slate-800">{result.studentName}</td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {result.score}/{result.totalPoints} ({result.percentage.toFixed(1)}%)
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${gradeInfo.bgColor} ${gradeInfo.textColor}`}>
                                  {gradeInfo.grade}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">
                                {new Date(result.completedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-slate-600">{result.timeSpent} min</td>
                              <td className="px-6 py-4">
                                <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Completed
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p>No results found for this exam</p>
                    <p className="text-sm">Students haven't taken this exam yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
