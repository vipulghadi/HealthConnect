'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PatternCanvas from './PatternCanvas';
import DrawingCanvas from './DrawingCanvas';
import Timer from './Timer';
import Controls from './Controls';

// Predefined patterns (array of point arrays)
const patterns = [
  [[200, 50], [250, 150], [150, 150], [200, 50]], // Triangle
  [[100, 100], [300, 100], [300, 200], [100, 200], [100, 100]], // Square
  [[200, 50], [250, 150], [150, 150], [200, 250], [200, 50]], // Star-like
  [[100, 50], [300, 50], [200, 150], [100, 50]], // Shape
  [[150, 50], [250, 50], [200, 150], [150, 250], [150, 50]], // Pattern 5
  [[100, 100], [200, 50], [300, 100], [200, 150], [100, 100]], // Pattern 6
  [[200, 50], [300, 150], [200, 250], [100, 150], [200, 50]], // Pattern 7
  [[100, 50], [300, 50], [300, 250], [100, 250], [100, 50]], // Pattern 8
];

const PatternTest = () => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [userPoints, setUserPoints] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLimit, setTimeLimit] = useState(120); // 2 minutes for patterns 1-4

  // Evaluate drawing
  const evaluateDrawing = () => {
    const originalPoints = patterns[currentPattern];
    if (userPoints.length < 2) {
      setScore(0);
      return;
    }
    const minLen = Math.min(originalPoints.length, userPoints.length);
    let totalDistance = 0;
    for (let i = 0; i < minLen; i++) {
      const [x1, y1] = originalPoints[i % originalPoints.length];
      const [x2, y2] = userPoints[Math.floor(i * userPoints.length / minLen)];
      totalDistance += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    const avgDistance = totalDistance / minLen;
    const newScore = Math.max(0, 100 - Math.round(avgDistance / 2));
    setScore(newScore);
  };

  // Handle start drawing
  const handleStart = () => {
    setDrawing(true);
    setUserPoints([]);
    setScore(null);
    console.log("Drawing started");
    
  };

  // Handle submit
  const handleSubmit = () => {
    setDrawing(false);
    evaluateDrawing();
  };

  // Handle next pattern
  const handleNext = () => {
    const nextPattern = currentPattern + 1;
    if (nextPattern >= patterns.length) {
      alert('Test completed!');
      setCurrentPattern(0);
      setTimeLimit(120);
    } else {
      setCurrentPattern(nextPattern);
      setTimeLimit(nextPattern >= 4 ? 180 : 120); // 3 minutes for patterns 5-8
    }
    setDrawing(false);
    setUserPoints([]);
    setScore(null);
  };

  return (
    <Card className="max-w-3xl w-full mx-auto bg-gradient-to-br from-gray-50 to-gray-100 shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-extrabold text-gray-800 text-center">
          Pattern Drawing Test
        </CardTitle>
        <p className="text-center text-gray-600 text-lg">
          Pattern {currentPattern + 1} of {patterns.length}
        </p>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentPattern + 1) / patterns.length) * 100}%` }}
          ></div>
        </div>

        {/* Timer */}
        <Timer
          timeLimit={timeLimit}
          drawing={drawing}
          onTimeUp={() => {
            setDrawing(false);
            evaluateDrawing();
          }}
        />

        {/* Canvases */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-8">
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-gray-500 mb-2">Reference Pattern</p>
            <PatternCanvas pattern={patterns[currentPattern]} />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-gray-500 mb-2">Your Drawing</p>
            <DrawingCanvas
              drawing={drawing}
              setDrawing={setDrawing}
              userPoints={userPoints}
              setUserPoints={setUserPoints}
            />
          </div>
        </div>

        {/* Controls */}
        <Controls
          drawing={drawing}
          onStart={handleStart}
          onSubmit={handleSubmit}
          onNext={handleNext}
          canSubmit={userPoints.length > 0 && !drawing}
          canGoNext={score !== null}
        />

        {/* Score */}
        <p className="text-center mt-6 text-lg font-semibold text-gray-700">
          Score: <span className="text-blue-600">{score !== null ? score : '-'}</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default PatternTest;