// components/patternTest/Timer.jsx
'use client';

import React, { useState, useEffect } from 'react';

const Timer = ({ timeLimit, drawing, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (!drawing) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [drawing, onTimeUp]);

  return (
    <p className="text-center mb-4">
      Time Remaining: <span className="font-bold">{timeLeft}</span>s
    </p>
  );
};

export default Timer;