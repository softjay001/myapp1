import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Question, QuestionType } from "@/lib/exam-types";
import { ExamUtils } from "@/lib/exam-utils";
import { useToast } from "@/hooks/use-toast";

interface QuestionBuilderProps {
  onSave: (question: Question) => void;
  onCancel: () => void;
  initialQuestion?: Question | null;
}

export default function QuestionBuilder({ onSave, onCancel, initialQuestion }: QuestionBuilderProps) {
  const { toast } = useToast();
  const [questionType, setQuestionType] = useState<QuestionType>(initialQuestion?.type || 'mcq');
  const [questionText, setQuestionText] = useState(initialQuestion?.text || '');
  const [options, setOptions] = useState(initialQuestion?.options || ['', '', '', '']);
  const [correctAnswers, setCorrectAnswers] = useState<string[]>(initialQuestion?.correctAnswers || []);
  const [points, setPoints] = useState(initialQuestion?.points || 1);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSave = () => {
    if (!questionText.trim()) {
      toast({
        title: "Error",
        description: "Please enter the question text",
        variant: "destructive"
      });
      return;
    }

    if (correctAnswers.length === 0) {
      toast({
        title: "Error", 
        description: "Please specify at least one correct answer",
        variant: "destructive"
      });
      return;
    }

    const question: Question = {
      id: initialQuestion?.id || ExamUtils.generateId(),
      type: questionType,
      text: questionText,
      options: needsOptions() ? options.filter(opt => opt.trim()) : undefined,
      correctAnswers,
      points,
      image: imageFile ? URL.createObjectURL(imageFile) : (initialQuestion?.image || undefined)
    };

    onSave(question);
    resetForm();
  };

  const needsOptions = () => {
    return ['mcq', 'checkbox', 'image'].includes(questionType);
  };

  const resetForm = () => {
    setQuestionText('');
    setOptions(['', '', '', '']);
    setCorrectAnswers([]);
    setPoints(1);
    setImageFile(null);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectAnswerChange = (value: string) => {
    if (questionType === 'checkbox') {
      setCorrectAnswers(prev => 
        prev.includes(value) 
          ? prev.filter(a => a !== value)
          : [...prev, value]
      );
    } else {
      setCorrectAnswers([value]);
    }
  };

  const renderAnswerInput = () => {
    switch (questionType) {
      case 'mcq':
      case 'image':
        return (
          <div>
            <Label>Answer Options</Label>
            <RadioGroup
              value={correctAnswers[0] || ''}
              onValueChange={(value) => setCorrectAnswers([value])}
              className="mt-2"
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'true-false':
        return (
          <div>
            <Label>Correct Answer</Label>
            <RadioGroup
              value={correctAnswers[0] || ''}
              onValueChange={(value) => setCorrectAnswers([value])}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="true" />
                <Label htmlFor="true">True</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="false" />
                <Label htmlFor="false">False</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        return (
          <div>
            <Label>Answer Options (Select all correct answers)</Label>
            <div className="mt-2 space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Checkbox
                    checked={correctAnswers.includes(option)}
                    onCheckedChange={() => handleCorrectAnswerChange(option)}
                  />
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'fill-blank':
      case 'subjective':
        return (
          <div>
            <Label>Correct Answer</Label>
            <Input
              value={correctAnswers[0] || ''}
              onChange={(e) => setCorrectAnswers([e.target.value])}
              placeholder="Enter the correct answer"
              className="mt-2"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-slate-800">Add Question</h3>
          <span className="text-sm text-slate-600">Question Builder</span>
        </div>
        
        <div className="space-y-6">
          <div>
            <Label>Question Type</Label>
            <Select value={questionType} onValueChange={(value: QuestionType) => setQuestionType(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice Question (MCQ)</SelectItem>
                <SelectItem value="true-false">True/False</SelectItem>
                <SelectItem value="fill-blank">Fill in the Blank</SelectItem>
                <SelectItem value="checkbox">Checkbox (Multiple Answers)</SelectItem>
                <SelectItem value="image">Image Question</SelectItem>
                <SelectItem value="subjective">Subjective (Text)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Question Text</Label>
            <Textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question here..."
              rows={3}
              className="mt-2"
            />
          </div>

          {questionType === 'image' && (
            <div>
              <Label>Upload Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="mt-2"
              />
            </div>
          )}
          
          {renderAnswerInput()}
          
          <div>
            <Label>Points</Label>
            <Input
              type="number"
              min="1"
              value={points}
              onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
              className="mt-2 w-24"
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-blue-700">
              {initialQuestion ? 'Update Question' : 'Add Question'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
