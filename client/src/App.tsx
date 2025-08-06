import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "@/pages/landing";
import TeacherDashboard from "@/pages/teacher-dashboard";
import CreateExam from "@/pages/create-exam";
import EditExam from "@/pages/edit-exam";
import StudentLogin from "@/pages/student-login";
import ExamInterface from "@/pages/exam-interface";
import GradeManagement from "@/pages/grade-management";
import ExamResults from "@/pages/exam-results";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/teacher" component={TeacherDashboard} />
      <Route path="/teacher/create-exam" component={CreateExam} />
      <Route path="/teacher/edit-exam" component={EditExam} />
      <Route path="/teacher/grades" component={GradeManagement} />
      <Route path="/student" component={StudentLogin} />
      <Route path="/student/exam" component={ExamInterface} />
      <Route path="/results" component={ExamResults} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
