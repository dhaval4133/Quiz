import type { Question } from '@/types';

export const sampleQuestions: Question[] = [
  {
    id: '1',
    text: 'What is the capital of France?',
    options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
    correctAnswer: 'Paris',
  },
  {
    id: '2',
    text: 'Which HTML tag is used to define an internal style sheet?',
    options: ['<script>', '<css>', '<style>', '<link>'],
    correctAnswer: '<style>',
  },
  {
    id: '3',
    text: 'What does CSS stand for?',
    options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Computer Style Sheets', 'Colorful Style Sheets'],
    correctAnswer: 'Cascading Style Sheets',
  },
  {
    id: '4',
    text: 'Which JavaScript keyword is used to declare a variable that cannot be reassigned?',
    options: ['var', 'let', 'const', 'static'],
    correctAnswer: 'const',
  },
  {
    id: '5',
    text: 'What is the default port for HTTP?',
    options: ['80', '443', '21', '8080'],
    correctAnswer: '80',
  },
];
