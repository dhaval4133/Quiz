
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QuestionCard from '@/components/quiz/QuestionCard';
import ScoreDisplay from '@/components/quiz/ScoreDisplay';
import FeedbackIndicator from '@/components/quiz/FeedbackIndicator';
import ResultsDisplay from '@/components/quiz/ResultsDisplay';
import TimerDisplay from '@/components/quiz/TimerDisplay'; // New import
import { sampleQuestions } from '@/lib/quiz-data';
import type { Question } from '@/types';
import { ArrowRight, Brain, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNewQuestions, type GenerateQuestionsInput } from '@/ai/flows/generate-questions-flow';

const INITIAL_TIME_PER_QUESTION = 20; // seconds
const QUESTION_COUNT_OPTIONS = [10, 20, 30, 40, 50];

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null | "TIMED_OUT">(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quizEnded, setQuizEnded] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const { toast } = useToast();

  const [numQuestions, setNumQuestions] = useState(QUESTION_COUNT_OPTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME_PER_QUESTION);
  const [quizStartTime, setQuizStartTime] = useState<number | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);

  const autoNextTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timeout on component unmount or if quiz state changes drastically
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
      }
    };
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (quizStarted && !quizEnded && !showFeedback && questions.length > 0 && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [quizStarted, quizEnded, showFeedback, questions, timeLeft]);

  // Handle timeout action when timeLeft hits 0
  useEffect(() => {
    if (quizStarted && !quizEnded && !showFeedback && questions.length > 0 && timeLeft === 0) {
      // Ensure this runs only once per timeout
      if (selectedAnswer !== "TIMED_OUT") {
        setSelectedAnswer("TIMED_OUT");
        setIsCorrect(false); // Timed out is treated as incorrect
        setShowFeedback(true);

        if (autoNextTimeoutRef.current) clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = setTimeout(() => {
          handleNextQuestion();
        }, 3000); // Auto-advance after 3 seconds
      }
    }
  }, [quizStarted, quizEnded, showFeedback, questions, timeLeft, selectedAnswer]);


  const handleStartQuiz = async () => {
    setLoadingQuestions(true);
    // Reset all quiz states
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(null);
    setQuizEnded(false);
    setTimeLeft(INITIAL_TIME_PER_QUESTION);
    setQuizStartTime(Date.now());
    setTotalTimeTaken(0);

    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    try {
      const input: GenerateQuestionsInput = { count: numQuestions, topic: 'General Knowledge' };
      const result = await generateNewQuestions(input);
      
      if (result && result.questions && result.questions.length > 0) {
        setQuestions(result.questions as Question[]);
        setQuizStarted(true);
      } else {
        toast({
          title: "Failed to generate questions",
          description: "Using sample questions as a fallback.",
          variant: "destructive",
        });
        setQuestions(sampleQuestions.slice(0, numQuestions)); 
        setQuizStarted(true);
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        title: "Error Generating Questions",
        description: "Could not fetch new questions. Using sample questions.",
        variant: "destructive",
      });
      setQuestions(sampleQuestions.slice(0, numQuestions));
      setQuizStarted(true); 
    } finally {
      setLoadingQuestions(false);
    }
  };
  
  const handleAnswerSelect = (answer: string) => {
    if (showFeedback || timeLeft === 0) return; 

    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    setSelectedAnswer(answer);
    const correct = questions[currentQuestionIndex].correctAnswer === answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((prevScore) => prevScore + 1);
    }
    setShowFeedback(true);
  };

  const handleNextQuestion = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }

    setShowFeedback(false);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setTimeLeft(INITIAL_TIME_PER_QUESTION);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      const endTime = Date.now();
      const duration = quizStartTime ? Math.round((endTime - quizStartTime) / 1000) : 0;
      setTotalTimeTaken(duration);
      setQuizEnded(true);
    }
  };

  const handleRestart = () => {
    setQuizStarted(false); 
    setQuestions([]); 
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
  };

  if (!quizStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 via-background to-background p-4">
        <Card className="w-full max-w-md text-center shadow-2xl rounded-xl p-8 transform transition-all hover:scale-105 duration-300">
          <div className="mx-auto bg-primary text-primary-foreground rounded-full p-4 w-fit mb-6 shadow-lg">
            <Brain className="h-12 w-12" />
          </div>
          <h1 className="text-5xl font-extrabold text-primary mb-4">QuizWhiz</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Test your knowledge and become a QuizWhiz!
          </p>
          <div className="mb-6 flex justify-center">
            <Select value={numQuestions.toString()} onValueChange={(value) => setNumQuestions(parseInt(value))}>
              <SelectTrigger className="w-[220px] text-lg py-6">
                <SelectValue placeholder="Number of Questions" />
              </SelectTrigger>
              <SelectContent>
                {QUESTION_COUNT_OPTIONS.map(count => (
                  <SelectItem key={count} value={count.toString()} className="text-lg">{count} Questions</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            onClick={handleStartQuiz} 
            size="lg" 
            className="w-full text-xl py-7 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            disabled={loadingQuestions}
          >
            {loadingQuestions ? (
              <>
                <Loader2 className="animate-spin mr-2 h-6 w-6" />
                Generating Questions...
              </>
            ) : (
              <>
                Start Quiz <ArrowRight className="ml-2 h-6 w-6" />
              </>
            )}
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
        totalTimeTaken={totalTimeTaken}
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
              <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIME_PER_QUESTION} />
            )}

            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                onAnswerSelect={handleAnswerSelect}
                selectedAnswer={selectedAnswer}
                showFeedback={showFeedback}
                isCorrect={isCorrect}
                disabled={showFeedback || timeLeft === 0}
              />
            ) : (
              <div className="text-center p-8">
                {questions.length === 0 && loadingQuestions ? (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Generating questions...</p>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading question...</p>
                  </>
                )}
              </div>
            )}

            {showFeedback && currentQuestion && (
              <FeedbackIndicator
                isCorrect={isCorrect!}
                correctAnswer={currentQuestion.correctAnswer}
                userAnswer={selectedAnswer === "TIMED_OUT" ? null : selectedAnswer} 
                timedOut={selectedAnswer === "TIMED_OUT"}
              />
            )}
          </CardContent>
        </Card>

        {showFeedback && !quizEnded && (
          <Button 
            onClick={handleNextQuestion} 
            className="w-full text-lg py-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            // Button might be clicked before auto-advance, which is fine
          >
            Next Question <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        )}
         {!selectedAnswer && !showFeedback && questions.length > 0 && ( 
          <div className="h-[60px]"> {/* Placeholder for button height consistency */}
          </div>
        )}
      </div>
    </div>
  );
}

