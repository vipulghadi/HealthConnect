"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Play, Pause, RotateCcw, CheckCircle, Award } from "lucide-react";
import Tray from "@/components/passalong/Tray";
import DesignCard from "@/components/passalong/DesignCard";
import Timer from "@/components/passalong/Timer";
import Results from "@/components/passalong/Results";

// Predefined design patterns (simplified as 3x3 grid states)
const designs = [
  [
    ["red", "red", "blue"],
    ["blue", "empty", "red"],
    ["blue", "red", "blue"],
  ],
  [
    ["blue", "red", "red"],
    ["red", "blue", "empty"],
    ["blue", "blue", "red"],
  ],
  [
    ["red", "blue", "red"],
    ["blue", "red", "blue"],
    ["empty", "red", "blue"],
  ],
  [
    ["blue", "red", "blue"],
    ["red", "blue", "red"],
    ["blue", "empty", "red"],
  ],
  [
    ["red", "blue", "empty"],
    ["blue", "red", "blue"],
    ["red", "blue", "red"],
  ],
  [
    ["blue", "red", "blue"],
    ["red", "empty", "red"],
    ["blue", "blue", "red"],
  ],
  [
    ["red", "blue", "red"],
    ["blue", "red", "blue"],
    ["red", "blue", "empty"],
  ],
  [
    ["blue", "red", "blue"],
    ["red", "blue", "red"],
    ["empty", "blue", "red"],
  ],
];

export default function PassAlongTest() {
  const [currentDesign, setCurrentDesign] = useState(0);
  const [grid, setGrid] = useState(createInitialGrid());
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize 3x3 grid with blocks
  function createInitialGrid() {
    return [
      ["blue", "blue", "red"],
      ["red", "empty", "blue"],
      ["red", "red", "blue"],
    ];
  }

  // Load responses from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedResponses = localStorage.getItem("passAlongResponses");
      setResponses(savedResponses ? JSON.parse(savedResponses) : []);
    }
  }, []);

  // Save response to localStorage (client-side only)
  function saveResponse(response) {
    if (typeof window !== "undefined") {
      const updatedResponses = [...responses, response];
      localStorage.setItem(
        "passAlongResponses",
        JSON.stringify(updatedResponses)
      );
      setResponses(updatedResponses);
    }
  }

  // Start test
  function handleStart() {
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsRunning(true);
    setScore(null);
    setShowSuccess(false);
  }

  // Stop test and calculate score
  function handleStop() {
    setIsRunning(false);
    const timeTaken = elapsedTime / 1000; // seconds
    const maxTime = currentDesign < 4 ? 120 : 180; // 2 or 3 minutes
    const isCorrect = checkSolution(grid, designs[currentDesign]);
    let score = 0;

    if (isCorrect) {
      if (currentDesign < 4) {
        score = timeTaken <= 60 ? 2 : timeTaken <= 120 ? 1 : 0;
      } else {
        score =
          timeTaken <= 60 ? 3 : timeTaken <= 120 ? 2 : timeTaken <= 180 ? 1 : 0;
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }

    const response = {
      design: currentDesign + 1,
      answer: grid,
      responseTime: timeTaken,
      timestamp: new Date().toISOString(),
      score,
    };

    saveResponse(response);
    setScore(score);
  }

  // Reset grid
  function handleReset() {
    setGrid(createInitialGrid());
    setElapsedTime(0);
    setIsRunning(false);
    setScore(null);
    setShowSuccess(false);
  }

  // Move to next design
  function handleNext() {
    if (currentDesign < designs.length - 1) {
      setCurrentDesign(currentDesign + 1);
      setGrid(createInitialGrid());
      setElapsedTime(0);
      setIsRunning(false);
      setScore(null);
      setShowSuccess(false);
    }
  }

  // Check if grid matches target design
  function checkSolution(grid, target) {
    return grid.every((row, i) =>
      row.every((cell, j) => cell === target[i][j])
    );
  }

  // Update grid on move
  function handleMove(from, to) {
    const newGrid = [...grid];
    const temp = newGrid[to.row][to.col];
    newGrid[to.row][to.col] = newGrid[from.row][from.col];
    newGrid[from.row][from.col] = temp;
    setGrid(newGrid);
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-red-100 p-4 sm:p-8 flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-white/80 backdrop-blur-sm shadow-lg rounded-xl animate-fade-in">
        <CardHeader className="border-b-2 border-gradient-to-r from-blue-200 to-red-200">
          <CardTitle className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            Pass-Along Test
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-sm animate-pulse">
              Design {currentDesign + 1}/8
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          {/* Reordered layout - Target pattern first */}
          <div className="grid grid-cols-1 gap-8">
            {/* Target Pattern Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-gray-700">
                Target Pattern
              </h3>
              <DesignCard design={designs[currentDesign]} />
            </div>

            {/* Test Pattern Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-center text-gray-700">
                Your Solution
              </h3>
              <Tray grid={grid} onMove={handleMove} isRunning={isRunning} />

              {/* Controls */}
              <div className="flex flex-wrap gap-3 justify-center bg-gray-100/90 p-4 rounded-lg shadow-sm">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleStart}
                        disabled={isRunning}
                        className="bg-green-600 hover:bg-green-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Start the test"
                      >
                        <Play className="mr-2 h-5 w-5" /> Start
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">
                      Begin the current design
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleStop}
                        disabled={!isRunning}
                        className="bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Stop the test"
                      >
                        <Pause className="mr-2 h-5 w-5" /> Stop
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">
                      Pause and submit your solution
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleReset}
                        className="bg-gray-600 hover:bg-gray-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Reset the grid"
                      >
                        <RotateCcw className="mr-2 h-5 w-5" /> Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">
                      Restart the current design
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleNext}
                        disabled={currentDesign >= designs.length - 1}
                        className="bg-blue-600 hover:bg-blue-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Move to next design"
                      >
                        <CheckCircle className="mr-2 h-5 w-5" /> Next
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">
                      Go to the next design
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Timer
                elapsedTime={elapsedTime}
                maxTime={currentDesign < 4 ? 120 : 180}
              />

              {score !== null && (
                <div className="flex items-center justify-center gap-3 text-xl animate-slide-up">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <p className="text-gray-800">
                    Score: <span className="font-bold">{score}</span>{" "}
                    {score === 1 ? "point" : "points"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div
              className="fixed inset-0 flex items-center justify-center bg-green-600/80 z-50 animate-fade-in"
              aria-live="polite"
            >
              <p className="text-3xl font-bold text-white bg-green-700/90 px-8 py-4 rounded-lg shadow-lg">
                Success! Pattern Matched!
              </p>
            </div>
          )}

          <Results responses={responses} />
        </CardContent>
      </Card>
    </div>
  );
}
