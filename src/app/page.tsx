"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import QuestionCard from '@/components/quiz/QuestionCard';
import ScoreDisplay from '@/components/quiz/ScoreDisplay';
import FeedbackIndicator from '@/components/quiz/FeedbackIndicator';
import ResultsDisplay from '@/components/quiz/ResultsDisplay';
import { sampleQuestions } from '@/lib/quiz-data';
import type { Question } from '@/types';
import { ArrowRight, Brain } from 'lucide-react';

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    // Shuffle questions for variety each time, can be enabled if desired
    // setQuestions(sampleQuestions.sort(() => Math.random() - 0.5));
    setQuestions(sampleQuestions); // For now, use fixed order
  }, []);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setQuizEnded(false);
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return; // Prevent changing answer after feedback is shown

    setSelectedAnswer(answer);
    const correct = questions[currentQuestionIndex].correctAnswer === answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setQuizEnded(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false); // Go back to the start screen
    // States will be reset by handleStartQuiz when user clicks "Start Quiz"
  };

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
        <Card className="w-full max-w-md text-center shadow-2xl rounded-xl p-8 transform transition-all hover:scale-105 duration-300">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-6 shadow-lg">
            <Brain className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-extrabold text-primary mb-4">QuizWhiz</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Test your knowledge and become a QuizWhiz!
          </p>
          <Button onClick={handleStartQuiz} size="lg" className="w-full text-xl py-7 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            Start Quiz <ArrowRight className="ml-2 h-6 w-6" />
          </Button>
        </Card>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <ResultsDisplay
        score={score}
        totalQuestions={questions.length}
        onRestart={handleRestart}
      />
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-bold text-center text-primary flex items-center justify-center">
          <Brain className="mr-3 h-10 w-10" /> QuizWhiz
        </h1>
        
        <Card className="shadow-xl rounded-xl overflow-hidden">
          <CardContent className="p-6">
            <ScoreDisplay
              score={score}
              totalQuestions={questions.length}
              currentQuestionIndex={currentQuestionIndex}
            />

            {currentQuestion && (
              <QuestionCard
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                disabled={showFeedback}
              />
            )}

            {showFeedback && currentQuestion && (
              <FeedbackIndicator
                isCorrect={isCorrect!}
                correctAnswer={currentQuestion.correctAnswer}
                userAnswer={selectedAnswer!}
              />
            )}
          </CardContent>
        </Card>

        {showFeedback && !quizEnded && (
          <Button onClick={handleNextQuestion} className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            Next Question <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
         {!selectedAnswer && !showFeedback && ( // Placeholder for button area if needed, or remove
          <div className="h-[60px]"> {/* Approx height of the button */}
          </div>
        )}
      </div>
    </div>
  );
}
