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

  // Calculate if 70% of time is consumed (30% remaining)
  const timeConsumedPercentage = ((initialTime - timeLeft) / initialTime) * 100;
  const isTimeRunningOut = timeConsumedPercentage >= 70;

  // Dynamic color classes
  const colorClass = isTimeRunningOut ? "text-red-600" : "text-green-600";
  
  return (
    <span className={`${colorClass} ${className}`}>
      {ExamUtils.formatTime(timeLeft)}
    </span>
  );
}
