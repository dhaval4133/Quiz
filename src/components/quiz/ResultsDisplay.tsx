"use client";

import type React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, RefreshCw } from 'lucide-react';

interface ResultsDisplayProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  let message = "";
  if (percentage >= 80) {
    message = "Excellent work! You're a QuizWhiz!";
  } else if (percentage >= 50) {
    message = "Good job! Keep practicing to improve.";
  } else {
    message = "Keep learning and try again!";
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md text-center shadow-xl rounded-xl">
        <CardHeader>
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
            <Award className="h-10 w-10" />
          </div>
          <CardTitle className="text-3xl font-bold text-primary">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg pt-2">{message}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-5xl font-bold text-foreground">
            {score} / {totalQuestions}
          </p>
          <p className="text-2xl text-accent font-semibold">{percentage}%</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onRestart} className="w-full text-lg py-6" size="lg">
            <RefreshCw className="mr-2 h-5 w-5" />
            Play Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResultsDisplay;
