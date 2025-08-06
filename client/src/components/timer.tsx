import { useState, useEffect } from "react";
import { ExamUtils } from "@/lib/exam-utils";

interface TimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  className?: string;
}

export default function Timer({ initialTime, onTimeUp, className = "" }: TimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          onTimeUp();
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

  return (
    <span className={className}>
      {ExamUtils.formatTime(timeLeft)}
    </span>
  );
}
