import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Question } from "@/lib/exam-types";

interface QuestionRendererProps {
  question: Question;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
}

export default function QuestionRenderer({ question, answer, onAnswerChange }: QuestionRendererProps) {
  const renderAnswerInput = () => {
    switch (question.type) {
      case 'mcq':
        return (
          <RadioGroup
            value={typeof answer === 'string' ? answer : ''}
            onValueChange={(value) => onAnswerChange(value)}
            className="space-y-4"
          >
            {question.options?.map((option, index) => (
              <Label
                key={index}
                className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <RadioGroupItem value={option} className="mr-4" />
                <span className="font-medium text-slate-700 mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-slate-700">{option}</span>
              </Label>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={typeof answer === 'string' ? answer : ''}
            onValueChange={(value) => onAnswerChange(value)}
            className="space-y-4"
          >
            <Label className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
              <RadioGroupItem value="true" className="mr-4" />
              <span className="text-slate-700">True</span>
            </Label>
            <Label className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors">
              <RadioGroupItem value="false" className="mr-4" />
              <span className="text-slate-700">False</span>
            </Label>
          </RadioGroup>
        );

      case 'checkbox':
        const selectedAnswers = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-4">
            {question.options?.map((option, index) => (
              <Label
                key={index}
                className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <Checkbox
                  checked={selectedAnswers.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswerChange([...selectedAnswers, option]);
                    } else {
                      onAnswerChange(selectedAnswers.filter(a => a !== option));
                    }
                  }}
                  className="mr-4"
                />
                <span className="font-medium text-slate-700 mr-2">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="text-slate-700">{option}</span>
              </Label>
            ))}
          </div>
        );

      case 'fill-blank':
        return (
          <Input
            value={typeof answer === 'string' ? answer : ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full px-4 py-3"
          />
        );

      case 'subjective':
        return (
          <Textarea
            value={typeof answer === 'string' ? answer : ''}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="Enter your answer..."
            rows={6}
            className="w-full px-4 py-3"
          />
        );

      case 'image':
        return (
          <div className="space-y-4">
            {question.image && (
              <img
                src={question.image}
                alt="Question image"
                className="max-w-full h-auto rounded-lg border border-slate-200"
              />
            )}
            <RadioGroup
              value={typeof answer === 'string' ? answer : ''}
              onValueChange={(value) => onAnswerChange(value)}
              className="space-y-4"
            >
              {question.options?.map((option, index) => (
                <Label
                  key={index}
                  className="flex items-center p-4 border border-slate-200 rounded-xl hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <RadioGroupItem value={option} className="mr-4" />
                  <span className="font-medium text-slate-700 mr-2">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="text-slate-700">{option}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        {question.text}
      </h3>
      {renderAnswerInput()}
    </div>
  );
}
