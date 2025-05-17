"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question } from '@/types';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: Question;
  onAnswerSelect: (answer: string) => void;
  selectedAnswer: string | null;
  showFeedback: boolean;
  isCorrect: boolean | null;
  disabled: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onAnswerSelect,
  selectedAnswer,
  showFeedback,
  isCorrect,
  disabled,
}) => {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{question.text}</CardTitle>
        <CardDescription>Select the correct answer from the options below.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = question.correctAnswer === option;
            
            let buttonVariant: "default" | "outline" | "secondary" = "outline";
            let extraClasses = "";

            if (showFeedback) {
              if (isCorrectOption) {
                extraClasses = "bg-accent hover:bg-accent/90 text-accent-foreground";
              } else if (isSelected && !isCorrect) {
                extraClasses = "bg-destructive hover:bg-destructive/90 text-destructive-foreground";
              } else {
                 extraClasses = "opacity-70"; // Fade out non-selected, non-correct options
              }
            } else if (isSelected) {
               buttonVariant = "default"; // Highlight selected before feedback
            }

            return (
              <Button
                key={option}
                variant={buttonVariant}
                className={cn(
                  "w-full justify-start text-left h-auto py-3 px-4 whitespace-normal transition-all duration-200 ease-in-out transform hover:scale-[1.02]",
                  extraClasses
                )}
                onClick={() => onAnswerSelect(option)}
                disabled={disabled}
                aria-pressed={isSelected}
              >
                {option}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
