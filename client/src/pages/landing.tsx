import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, Users, HelpCircle } from "lucide-react";

export default function Landing() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-700 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Impetus Dominion Academy</h1>
                <p className="text-sm text-slate-600">Computer-Based Testing System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-600 hover:text-primary transition-colors">
                <HelpCircle className="w-4 h-4 mr-1 inline" />
                <span className="text-sm">Help</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Welcome to CBT System</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Choose your role to access the appropriate interface for creating or taking examinations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Teacher Card */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Teacher Portal</h3>
                <p className="text-slate-600 mb-6">
                  Create, manage, and grade examinations. Access student performance analytics and export results.
                </p>
                <ul className="text-left text-slate-600 mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Create new exams
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Multiple question types
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Grade management
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Analytics dashboard
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation('/teacher')}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl"
                >
                  Access Teacher Portal
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Student Card */}
          <Card className="p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
            <CardContent className="pt-0">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <Users className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Student Portal</h3>
                <p className="text-slate-600 mb-6">
                  Take examinations, view results, and track your academic progress in a user-friendly interface.
                </p>
                <ul className="text-left text-slate-600 mb-8 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Take examinations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Timer-based tests
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Instant results
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Progress tracking
                  </li>
                </ul>
                <Button 
                  onClick={() => setLocation('/student')}
                  className="w-full bg-blue-600 hover:bg-primary text-white font-semibold py-3 px-6 rounded-xl"
                >
                  Access Student Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
