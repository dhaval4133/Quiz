"use client";

import type React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackIndicatorProps {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer?: string;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, correctAnswer, userAnswer }) => {
  return (
    <div
      className={cn(
        "mt-4 p-4 rounded-lg flex items-center space-x-3 animate-scale-in shadow-md",
        isCorrect ? "bg-accent text-accent-foreground" : "bg-destructive text-destructive-foreground"
      )}
    >
      {isCorrect ? (
        <CheckCircle2 className="h-6 w-6" />
      ) : (
        <XCircle className="h-6 w-6" />
      )}
      <div>
        <p className="font-semibold">{isCorrect ? "Correct!" : "Incorrect!"}</p>
        {!isCorrect && userAnswer && (
          <p className="text-sm">
            You answered: {userAnswer}. The correct answer is: {correctAnswer}.
          </p>
        )}
         {!isCorrect && !userAnswer && ( // Case where time runs out or no answer given (future enhancement)
          <p className="text-sm">
            The correct answer is: {correctAnswer}.
          </p>
        )}
      </div>
    </div>
  );
};

export default FeedbackIndicator;
