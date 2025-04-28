'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Check, ArrowLeft, ArrowRight, Trophy, Clock } from 'lucide-react';

// Predefined patterns
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

// PatternCanvas Component
const PatternCanvas = ({ pattern }) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    pattern.forEach(([x, y], index) => {
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.closePath();
    ctx.stroke();

    ctx.fillStyle = '#3B82F6';
    pattern.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  }, [pattern]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className="border border-gray-200 rounded-lg shadow-md transition-transform hover:scale-105 bg-white"
      role="img"
      aria-label="Reference pattern canvas"
    />
  );
};

// DrawingCanvas Component
const DrawingCanvas = ({ drawing, setDrawing, userPoints, setUserPoints }) => {
  const canvasRef = React.useRef(null);
  const isDrawing = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userPoints.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      userPoints.forEach(([x, y], index) => {
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();

      ctx.fillStyle = '#EF4444';
      userPoints.forEach(([x, y]) => {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [userPoints]);

  const startDrawing = (e) => {
    if (!drawing) return;
    isDrawing.current = true;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setUserPoints((prev) => [...prev, [x, y]]);
  };

  const draw = (e) => {
    if (!isDrawing.current || !drawing) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setUserPoints((prev) => [...prev, [x, y]]);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      className={`border border-gray-200 rounded-lg shadow-md transition-transform hover:scale-105 bg-white ${
        drawing ? 'cursor-crosshair' : 'cursor-not-allowed'
      }`}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseOut={stopDrawing}
      role="img"
      aria-label="Drawing canvas"
    />
  );
};

// Timer Component
const Timer = ({ timeLimit, drawing, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = React.useState(timeLimit);

  React.useEffect(() => {
    setTimeLeft(timeLimit);
  }, [timeLimit]);

  React.useEffect(() => {
    if (!drawing) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [drawing, onTimeUp]);

  return (
    <div className="flex items-center justify-center mb-6">
      <div className="bg-gradient-to-r from-blue-100 to-teal-100 p-4 rounded-full shadow-md">
        <p className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-blue-600" />
          Time Left:{' '}
          <span
            className={`${
              timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-600'
            } transition-colors font-bold`}
          >
            {Math.round(timeLeft)}s
          </span>
        </p>
      </div>
    </div>
  );
};

// Controls Component
const Controls = ({
  drawing,
  onStart,
  onSubmit,
  onNext,
  onPrevious,
  canSubmit,
  canGoNext,
  canGoPrevious,
}) => (
  <div className="flex justify-center gap-4 flex-wrap">
    {!drawing && (
      <Button
        onClick={onStart}
        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all transform hover:scale-105 shadow-md"
        aria-label="Start drawing"
      >
        <Play className="mr-2 h-5 w-5" /> Start
      </Button>
    )}
    {drawing && (
      <Button
        onClick={onSubmit}
        disabled={!canSubmit}
        className={`bg-gradient-to-r from-blue-500 to-blue-600 transition-all transform hover:scale-105 shadow-md ${
          !canSubmit ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
        }`}
        aria-label="Submit drawing"
      >
        <Check className="mr-2 h-5 w-5" /> Submit
      </Button>
    )}
    <Button
      onClick={onPrevious}
      disabled={!canGoPrevious}
      className={`bg-gradient-to-r from-gray-500 to-gray-600 transition-all transform hover:scale-105 shadow-md ${
        !canGoPrevious ? 'opacity-50 cursor-not-allowed' : 'hover:from-gray-600 hover:to-gray-700'
      }`}
      aria-label="Go to previous pattern"
    >
      <ArrowLeft className="mr-2 h-5 w-5" /> Previous
    </Button>
    <Button
      onClick={onNext}
      disabled={!canGoNext}
      className={`bg-gradient-to-r from-blue-500 to-blue-600 transition-all transform hover:scale-105 shadow-md ${
        !canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-600 hover:to-blue-700'
      }`}
      aria-label="Go to next pattern"
    >
      Next <ArrowRight className="ml-2 h-5 w-5" />
    </Button>
  </div>
);

// Main PatternTest Component
const PatternTest = () => {
  const [currentPattern, setCurrentPattern] = useState(0);
  const [drawing, setDrawing] = useState(false);
  const [userPoints, setUserPoints] = useState([]);
  const [score, setScore] = useState(null);
  const [timeLimit, setTimeLimit] = useState(120);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [responses, setResponses] = useState([]);
  const [gameState, setGameState] = useState('idle');
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [pendingResponse, setPendingResponse] = useState(null); // Store response until Submit or Next

  // Initialize localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('PatternTest');
      const initialData = {
        gameName: 'Pattern Test',
        totalScore: 0,
        totalTimeTaken: 0,
        questions: [],
      };
      localStorage.setItem('PatternTest', JSON.stringify(initialData));
      setResponses([]);
      setUserPoints([]);
      setScore(null);
      setElapsedTime(0);
      setDrawing(false);
      setGameState('idle');
    }
  }, []);

  // Load responses when changing patterns
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('PatternTest');
        if (savedData) {
          const testData = JSON.parse(savedData);
          setResponses(testData.questions || []);
          const currentResponse = testData.questions.find(
            (q) => q.questionId === currentPattern + 1
          );
          if (currentResponse && currentResponse.answer) {
            setUserPoints(currentResponse.answer);
            setScore(currentResponse.score);
            setElapsedTime(currentResponse.responseTime);
          } else {
            setUserPoints([]);
            setScore(null);
            setElapsedTime(0);
          }
        }
      } catch (error) {
        console.error('Error reading localStorage:', error);
        setResponses([]);
      }
    }
    setTimeLimit(currentPattern >= 4 ? 180 : 120);
    setDrawing(false);
    setGameState('idle');
    setPendingResponse(null); // Clear pending response when changing patterns
  }, [currentPattern]);

  // Save response to localStorage
  const saveResponse = (response) => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('PatternTest');
        let testData = savedData
          ? JSON.parse(savedData)
          : {
              gameName: 'Pattern Test',
              totalScore: 0,
              totalTimeTaken: 0,
              questions: [],
            };

        const existingIndex = testData.questions.findIndex(
          (q) => q.questionId === response.questionId
        );
        if (existingIndex !== -1) {
          testData.questions[existingIndex] = response;
        } else {
          testData.questions.push(response);
        }

        testData.totalScore = testData.questions.reduce((sum, q) => sum + (q.isCorrect ? q.score : 0), 0);
        testData.totalTimeTaken = testData.questions.reduce(
          (sum, q) => sum + q.responseTime,
          0
        );

        localStorage.setItem('PatternTest', JSON.stringify(testData));
        setResponses(testData.questions);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
      }
    }
  };

  // Evaluate drawing
  const evaluateDrawing = () => {
    const originalPoints = patterns[currentPattern];
    if (userPoints.length < 2) {
      const response = {
        questionId: currentPattern + 1,
        isCorrect: false,
        responseTime: elapsedTime,
        score: 0,
        
      };
      setPendingResponse(response);
      setScore(0);
      setIsCorrect(false);
      setShowResultPopup(true);
      return;
    }
    const minLen = Math.min(originalPoints.length, userPoints.length);
    let totalDistance = 0;
    for (let i = 0; i < minLen; i++) {
      const [x1, y1] = originalPoints[i % originalPoints.length];
      const [x2, y2] = userPoints[Math.floor((i * userPoints.length) / minLen)];
      totalDistance += Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    const avgDistance = totalDistance / minLen;
    const newScore = Math.max(0, 100 - Math.round(avgDistance / 2));
    const isCorrect = newScore >= 70;
    const response = {
      questionId: currentPattern + 1,
      isCorrect: isCorrect,
      responseTime: elapsedTime,
      score: newScore,
    
    };
    setPendingResponse(response);
    setScore(newScore);
    setIsCorrect(isCorrect);
    setShowResultPopup(true);
  };

  // Handle start drawing
  const handleStart = () => {
    setDrawing(true);
    setUserPoints([]);
    setScore(null);
    setElapsedTime(0);
    setGameState('drawing');
    setPendingResponse(null);
  };

  // Handle submit
  const handleSubmit = () => {
    setDrawing(false);
    evaluateDrawing();
    setGameState('idle');
    if (pendingResponse) {
      saveResponse(pendingResponse);
      setPendingResponse(null);
    }
  };

  // Handle previous pattern
  const handlePrevious = () => {
    if (currentPattern > 0) {
      const currentResponse = responses.find((q) => q.questionId === currentPattern + 1);
      if (!currentResponse && userPoints.length > 0) {
        const defaultResponse = {
          questionId: currentPattern + 1,
          isCorrect: false,
          responseTime: elapsedTime,
          score: 0,
          
        };
        saveResponse(defaultResponse);
      }
      setCurrentPattern(currentPattern - 1);
      setDrawing(false);
      setUserPoints([]);
      setScore(null);
      setElapsedTime(0);
      setGameState('idle');
      setShowResultPopup(false);
      setPendingResponse(null);
    }
  };

  // Handle next pattern
  const handleNext = () => {
    setShowResultPopup(false);
    if (pendingResponse) {
      saveResponse(pendingResponse);
      setPendingResponse(null);
    } else {
      const currentResponse = responses.find((q) => q.questionId === currentPattern + 1);
      if (!currentResponse && userPoints.length > 0) {
        const defaultResponse = {
          questionId: currentPattern + 1,
          isCorrect: false,
          responseTime: elapsedTime,
          score: 0,
    
        };
        saveResponse(defaultResponse);
      }
    }

    const nextPattern = currentPattern + 1;
    if (nextPattern >= patterns.length) {
      setGameState('completed');
    } else {
      setCurrentPattern(nextPattern);
      setDrawing(false);
      setUserPoints([]);
      setScore(null);
      setElapsedTime(0);
      setGameState('idle');
    }
  };

  // Handle retry
  const handleRetry = () => {
    setShowResultPopup(false);
    setUserPoints([]);
    setScore(null);
    setElapsedTime(0);
    setDrawing(true);
    setGameState('drawing');
    setPendingResponse(null);
  };

  // Timer effect for elapsed time
  useEffect(() => {
    let interval;
    if (drawing) {
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [drawing]);

  // Render completed state
  if (gameState === 'completed') {
    const testData = JSON.parse(localStorage.getItem('PatternTest') || '{}');
    const totalScore = testData.totalScore || 0;
    const totalTimeTaken = testData.totalTimeTaken || 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6">
            <CardTitle className="text-4xl font-bold text-center flex items-center justify-center gap-3">
              <Trophy className="h-8 w-8" /> Test Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-5xl animate-bounce">🎉</div>
            <h2 className="text-3xl font-semibold text-teal-600">Congratulations!</h2>
            <p className="text-gray-600 text-lg">
              You have completed the Pattern Drawing Test.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-lg font-semibold">Total Score:</p>
                <p className="text-2xl text-teal-600">{totalScore}</p>
              </div>
              <div>
                <p className="text-lg font-semibold">Total Time:</p>
                <p className="text-2xl text-teal-600">{totalTimeTaken.toFixed(1)}s</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-teal-100 flex items-center justify-center p-4 sm:p-8">
      <Card className="max-w-5xl w-full bg-white/90 backdrop-blur-sm shadow-2xl rounded-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-teal-500 text-white py-6">
          <CardTitle className="text-4xl font-bold text-center">
            Pattern Drawing Test
          </CardTitle>
          <CardDescription className="text-white/80 text-center text-lg mt-2">
            Pattern {currentPattern + 1} of {patterns.length} - Draw the reference pattern
          </CardDescription>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{Math.round(((currentPattern + 1) / patterns.length) * 100)}%</span>
            </div>
            <Progress
              value={((currentPattern + 1) / patterns.length) * 100}
              className="h-2 bg-white/30"
              indicatorClassName="bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <Timer
            timeLimit={timeLimit}
            drawing={drawing}
            onTimeUp={() => {
              setDrawing(false);
              evaluateDrawing();
              setGameState('idle');
            }}
          />
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-10">
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-600 mb-3">Reference Pattern</p>
              <PatternCanvas pattern={patterns[currentPattern]} />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm font-medium text-gray-600 mb-3">Your Drawing</p>
              <DrawingCanvas
                drawing={drawing}
                setDrawing={setDrawing}
                userPoints={userPoints}
                setUserPoints={setUserPoints}
              />
            </div>
          </div>
          <Controls
            drawing={drawing}
            onStart={handleStart}
            onSubmit={handleSubmit}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canSubmit={userPoints.length > 0 && drawing}
            canGoNext={true}
            canGoPrevious={currentPattern > 0}
          />
          {score !== null && (
            <p className="text-center mt-8 text-xl font-semibold text-gray-800">
              Score:{' '}
              <span className="text-teal-600 font-bold">{score}</span>
            </p>
          )}
          {showResultPopup && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
              aria-live="polite"
            >
              <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center gap-4 text-center max-w-sm w-full">
                {isCorrect ? (
                  <>
                    <Trophy className="h-16 w-16 text-yellow-500" />
                    <p className="text-xl text-gray-600">Score: {score}</p>
                    <Button
                      onClick={handleNext}
                      className="bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
                    >
                      {currentPattern < patterns.length - 1 ? 'Next Pattern' : 'Finish'}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-xl text-gray-600">Score: {score}</p>
                    <div className="flex gap-4">
                      <Button
                        onClick={handleRetry}
                        className="bg-teal-600 hover:bg-teal-700 transition-all transform hover:scale-105 shadow-md"
                      >
                        Retry
                      </Button>
                      <Button
                        onClick={handleNext}
                        className="bg-blue-600 hover:bg-blue-700 transition-all transform hover:scale-105 shadow-md"
                      >
                        {currentPattern < patterns.length - 1 ? 'Next Pattern' : 'Finish'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternTest;