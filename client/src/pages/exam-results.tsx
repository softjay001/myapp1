import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trophy, User, Clock, BarChart3 } from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExamUtils } from "@/lib/exam-utils";
import { ExamResult } from "@/lib/exam-types";
import { useToast } from "@/hooks/use-toast";

export default function ExamResults() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [result, setResult] = useState<ExamResult | null>(null);
  const [showGradeView, setShowGradeView] = useState(false);
  const [gradePassword, setGradePassword] = useState("");

  useEffect(() => {
    // Get the most recent result for this session
    const results = Storage.getResults();
    if (results.length > 0) {
      const latestResult = results[results.length - 1];
      setResult(latestResult);
    } else {
      setLocation('/student');
    }
  }, [setLocation]);

  const handleViewGrades = () => {
    if (!result) return;

    const exam = Storage.getExam(result.examId);
    if (!exam) {
      toast({
        title: "Error",
        description: "Exam data not found",
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

    setShowGradeView(true);
  };

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 70) return { grade: 'C', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'D', color: 'text-orange-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  if (!result) {
    return <div>Loading...</div>;
  }

  const { grade, color } = getGrade(result.percentage);
  const allResults = Storage.getResults(result.examId);
  const statistics = ExamUtils.calculateStatistics(allResults);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <Trophy className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Exam Results</h1>
                <p className="text-sm text-slate-600">Your examination has been completed</p>
              </div>
            </div>
            <Button
              onClick={() => setLocation('/')}
              variant="outline"
            >
              Return Home
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!showGradeView ? (
          <div className="space-y-8">
            {/* Result Card */}
            <Card className="p-8">
              <CardContent className="pt-0">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trophy className="text-white text-3xl" />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">Exam Submitted Successfully!</h2>
                  <p className="text-xl text-slate-600 mb-4">{result.examTitle}</p>
                  <p className="text-lg text-slate-600 mb-8">You may leave the hall. Thank you for taking the exam.</p>
                  
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="text-blue-600 text-xl" />
                      </div>
                      <p className="text-sm text-slate-600">Student</p>
                      <p className="font-semibold text-slate-800">{result.studentName}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold ${color === 'text-green-600' ? 'bg-green-100' : color === 'text-blue-600' ? 'bg-blue-100' : color === 'text-yellow-600' ? 'bg-yellow-100' : color === 'text-orange-600' ? 'bg-orange-100' : 'bg-red-100'}`}>
                        <span className={color}>{grade}</span>
                      </div>
                      <p className="text-sm text-slate-600">Grade</p>
                      <p className="font-semibold text-slate-800">{result.percentage.toFixed(1)}%</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Clock className="text-purple-600 text-xl" />
                      </div>
                      <p className="text-sm text-slate-600">Time Spent</p>
                      <p className="font-semibold text-slate-800">{result.timeSpent} min</p>
                    </div>
                  </div>
                  
                  <div className="text-center text-lg">
                    <span className="text-slate-600">Score: </span>
                    <span className="font-bold text-slate-800">
                      {result.score} / {result.totalPoints} points
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Grade View */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Teacher Grade View</h3>
                <p className="text-slate-600 mb-6">
                  Enter the grade password to view class analytics and export results.
                </p>
                
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <Label htmlFor="gradePassword">Grade Password</Label>
                    <Input
                      id="gradePassword"
                      type="password"
                      value={gradePassword}
                      onChange={(e) => setGradePassword(e.target.value)}
                      placeholder="Enter grade access password"
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handleViewGrades}
                    className="bg-primary hover:bg-blue-700"
                  >
                    View Grades
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Statistics */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <User className="text-primary" />
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
                      <p className="text-2xl font-bold text-slate-800">{statistics.averageScore.toFixed(1)}%</p>
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
                      <p className="text-2xl font-bold text-slate-800">{statistics.highestScore.toFixed(1)}%</p>
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
                      <p className="text-2xl font-bold text-slate-800">{statistics.lowestScore.toFixed(1)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Table */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">All Results</h3>
                  <Button
                    onClick={() => Storage.exportResultsToCSV(allResults, result.examTitle)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Export CSV
                  </Button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Student Name</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Score</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Grade</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-medium text-slate-600">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {allResults.map((r, index) => {
                        const gradeInfo = getGrade(r.percentage);
                        return (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">{r.studentName}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{r.score}/{r.totalPoints} ({r.percentage.toFixed(1)}%)</td>
                            <td className="px-6 py-4">
                              <span className={`text-sm font-medium ${gradeInfo.color}`}>{gradeInfo.grade}</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{new Date(r.completedAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{r.timeSpent} min</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
