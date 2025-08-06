import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, FolderOpen } from "lucide-react";
import { Storage } from "@/lib/storage";
import { ExamUtils } from "@/lib/exam-utils";
import { useToast } from "@/hooks/use-toast";

export default function StudentLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [studentName, setStudentName] = useState("");
  const [examPassword, setExamPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.question')) {
      setSelectedFile(file);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid .question file",
        variant: "destructive"
      });
    }
  };

  const handleStartExam = async () => {
    if (!studentName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return;
    }

    if (!examPassword.trim()) {
      toast({
        title: "Error", 
        description: "Please enter the exam password",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select an exam file",
        variant: "destructive"
      });
      return;
    }

    try {
      const exam = await Storage.importExamFromFile(selectedFile);
      
      if (!ExamUtils.validatePassword(examPassword, exam.studentPassword)) {
        toast({
          title: "Error",
          description: "Incorrect exam password",
          variant: "destructive"
        });
        return;
      }

      // Save exam to local storage for the session
      Storage.saveExam(exam);

      // Create exam session
      const session = {
        examId: exam.id,
        studentName: studentName.trim(),
        answers: [],
        startTime: new Date()
      };
      
      Storage.saveSession(session);
      setLocation('/student/exam');
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load exam file",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-primary rounded-lg flex items-center justify-center">
                <Users className="text-white text-sm" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Student Portal</h1>
                <p className="text-sm text-slate-600">Login to take examination</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8">
          <CardContent className="pt-0">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Student Login</h2>
              <p className="text-slate-600">Enter your details to access the examination</p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="studentName">Student Name *</Label>
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 px-4 py-3"
                />
              </div>
              
              <div>
                <Label htmlFor="examPassword">Exam Password *</Label>
                <Input
                  id="examPassword"
                  type="password"
                  value={examPassword}
                  onChange={(e) => setExamPassword(e.target.value)}
                  placeholder="Enter exam access password"
                  className="mt-2 px-4 py-3"
                />
              </div>
              
              <div>
                <Label>Select Exam File</Label>
                <div className="mt-2 border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".question"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="examFile"
                  />
                  <label htmlFor="examFile" className="cursor-pointer">
                    <FolderOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">
                      {selectedFile ? selectedFile.name : 'Click to select .question file'}
                    </p>
                    <p className="text-sm text-slate-500">or drag and drop your exam file here</p>
                  </label>
                </div>
              </div>
              
              <Button 
                onClick={handleStartExam}
                className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
              >
                Start Examination
              </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium text-slate-800 mb-2">Instructions:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Enter your complete name as registered</li>
                <li>• Use the password provided by your instructor</li>
                <li>• Select the correct examination file</li>
                <li>• Ensure stable internet connection</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
