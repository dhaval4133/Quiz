
"use client";

import type React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'; // Added AlertTriangle for timeout
import { cn } from '@/lib/utils';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer?: string | null; // Can be null if timed out
  timedOut?: boolean;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, correctAnswer, userAnswer, timedOut }) => {
  let message = "";
  let IconComponent = isCorrect ? CheckCircle2 : XCircle;
  let bgColor = isCorrect ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground";

  if (timedOut) {
    message = "Time's up!";
    IconComponent = AlertTriangle;
    // bgColor can remain destructive or be a specific timeout color e.g. bg-yellow-500 if themed
  } else if (isCorrect) {
    message = "Correct!";
  } else {
    message = "Incorrect!";
  }

  return (
    <div
      className={cn(
        "mt-4 p-4 rounded-lg flex items-start space-x-3 animate-scale-in shadow-md",
        bgColor
      )}
    >
      <IconComponent className="h-6 w-6 mt-0.5 shrink-0" />
      <div>
        <p className="font-semibold">{message}</p>
        {!isCorrect && userAnswer && !timedOut && (
          <p className="text-sm">
            You answered: "{userAnswer}". The correct answer is: "{correctAnswer}".
          </p>
        )}
        {timedOut && (
          <p className="text-sm">
            The correct answer was: "{correctAnswer}".
          </p>
        )}
         {!isCorrect && !userAnswer && !timedOut && (
          <p className="text-sm">
            The correct answer is: "{correctAnswer}".
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackIndicator;

