import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Question, StudentAnswer } from "@/lib/exam-types";

interface ExamNavigationProps {
  questions: Question[];
  answers: StudentAnswer[];
  currentQuestionIndex: number;
  onQuestionSelect: (index: number) => void;
}

export default function ExamNavigation({ 
  questions, 
  answers, 
  currentQuestionIndex, 
  onQuestionSelect 
}: ExamNavigationProps) {
  const getQuestionStatus = (index: number) => {
    const question = questions[index];
    const hasAnswer = answers.some(a => a.questionId === question.id);
    
    if (index === currentQuestionIndex) return 'current';
    if (hasAnswer) return 'answered';
    return 'not-visited';
  };

  const getButtonClass = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-primary text-white';
      case 'answered':
        return 'bg-green-500 text-white';
      default:
        return 'bg-slate-100 hover:bg-slate-200 text-slate-700';
    }
  };

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-800 mb-4">Question Navigator</h3>
        <div className="grid grid-cols-5 gap-2 mb-6">
          {questions.map((_, index) => {
            const status = getQuestionStatus(index);
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => onQuestionSelect(index)}
                className={`w-8 h-8 text-sm font-medium rounded ${getButtonClass(status)}`}
              >
                {index + 1}
              </Button>
            );
          })}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded"></div>
            <span className="text-slate-600">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-slate-600">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-slate-200 rounded"></div>
            <span className="text-slate-600">Not Visited</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
