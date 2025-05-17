
"use client";
import type React from 'react';
import { Clock } from 'lucide-react';

interface TimerDisplayProps {
  timeLeft: number;
  initialTime: number;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeft, initialTime }) => {
  const percentage = initialTime > 0 ? (timeLeft / initialTime) * 100 : 0;
  
  let progressColor = "bg-primary"; // Default color
  if (percentage <= 25) {
    progressColor = "bg-destructive"; // Red when time is low
  } else if (percentage <= 50) {
    // Using accent for 50% or less, as yellow-500 isn't standard in theme
    // You could add yellow to your tailwind.config.ts if needed
    progressColor = "bg-accent"; // Green (accent) for medium time
  }


  return (
    <div className="mb-4">
      <div className="flex justify-between items-center text-sm text-muted-foreground mb-1">
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1.5" />
          <span>Time Left</span>
        </div>
        <span className="font-semibold text-foreground">{timeLeft}s</span>
      </div>
      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${progressColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
