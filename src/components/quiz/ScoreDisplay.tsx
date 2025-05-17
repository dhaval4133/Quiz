"use client";

import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ScoreDisplayProps {
  score: number;
  totalQuestions: number;
  currentQuestionIndex: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, totalQuestions, currentQuestionIndex }) => {
  return (
    <div className="flex justify-between items-center text-lg font-medium text-foreground mb-4">
      <p>Score: <span className="text-primary font-bold">{score}</span></p>
      <p>Question: <span className="text-primary font-bold">{Math.min(currentQuestionIndex + 1, totalQuestions)}</span>/{totalQuestions}</p>
    </div>
  );
};

export default ScoreDisplay;
