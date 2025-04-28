"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Check, RotateCcw, Award, Brain, Clock, Target, ChevronRight } from "lucide-react";
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
  const [isRunning, setIsRunning] = useState(true);
  const [responses, setResponses] = useState([]);
  const [score, setScore] = useState(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameState, setGameState] = useState("running");

  // Initialize 3x3 grid with blocks
  function createInitialGrid() {
    return [
      ["blue", "blue", "red"],
      ["red", "empty", "blue"],
      ["red", "red", "blue"],
    ];
  }

  // Initialize localStorage and reset game state
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Clear existing data to start fresh
      localStorage.removeItem("PassAlong Test");

      // Initialize localStorage with default structure
      const initialData = {
        gameName: "PassAlong Test",
        totalScore: 0,
        totalTimeTaken: 0,
        questions: [],
      };
      localStorage.setItem("PassAlong Test", JSON.stringify(initialData));
      setResponses([]);
      setGrid(createInitialGrid());
      setScore(null);
    }

    // Start timer for new design
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsRunning(true);
  }, []); // Run only on mount

  // Load responses when changing designs
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("PassAlong Test");
      if (savedData) {
        const testData = JSON.parse(savedData);
        setResponses(testData.questions || []);
        const currentResponse = testData.questions.find(q => q.questionId === currentDesign + 1);
        if (currentResponse && currentResponse.answer) {
          setGrid(currentResponse.answer);
          setScore(currentResponse.score);
        } else {
          setGrid(createInitialGrid());
          setScore(null);
        }
      }
    }
    // Reset timer for new design
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsRunning(true);
  }, [currentDesign]);

  // Save response to localStorage
  function saveResponse(response) {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("PassAlong Test");
      let testData = savedData
        ? JSON.parse(savedData)
        : {
            gameName: "PassAlong Test",
            totalScore: 0,
            totalTimeTaken: 0,
            questions: [],
          };

      // Update or add response
      const existingIndex = testData.questions.findIndex(q => q.questionId === response.questionId);
      if (existingIndex !== -1) {
        testData.questions[existingIndex] = response;
      } else {
        testData.questions.push(response);
      }

      // Update totals
      testData.totalScore = testData.questions.reduce((sum, q) => sum + (q.isCorrect ? q.score : 0), 0);
      testData.totalTimeTaken = testData.questions.reduce((sum, q) => sum + q.responseTime, 0);

      // Save to localStorage
      localStorage.setItem("PassAlong Test", JSON.stringify(testData));
      setResponses(testData.questions);
    }
  }

  // Submit answer for the current question
  function handleSubmit() {
    setIsRunning(false);
    const timeTaken = elapsedTime / 1000; // seconds
    const maxTime = currentDesign < 4 ? 120 : 180; // 2 or 3 minutes
    const isCorrect = checkSolution(grid, designs[currentDesign]);
    let score = 0;

    if (isCorrect) {
      if (currentDesign < 4) {
        score = timeTaken <= 60 ? 2 : timeTaken <= 120 ? 1 : 0;
      } else {
        score = timeTaken <= 60 ? 3 : timeTaken <= 120 ? 2 : timeTaken <= 180 ? 1 : 0;
      }
    }

    const response = {
      questionId: currentDesign + 1,
      isCorrect: isCorrect,
      responseTime: timeTaken,
      score: score,
      answer: grid.map(row => [...row]), // Deep copy of the grid
    };

    // Save response
    saveResponse(response);
    setScore(score);
    setIsCorrect(isCorrect);
    setShowResultPopup(true);

    // If correct, auto-move to next after popup
    if (isCorrect) {
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  }

  // Reset grid and timer
  function handleReset() {
    setGrid(createInitialGrid());
    setElapsedTime(0);
    setIsRunning(true);
    setStartTime(Date.now());
    setScore(null);
    setShowResultPopup(false);
  }

  // Move to next design
  function handleNext() {
    setShowResultPopup(false);

    // Save current state as incorrect if not submitted
    const currentResponse = responses.find(q => q.questionId === currentDesign + 1);
    if (!currentResponse) {
      const defaultResponse = {
        questionId: currentDesign + 1,
        isCorrect: false,
        responseTime: elapsedTime / 1000,
        score: 0,
        answer: grid.map(row => [...row]), // Save current grid state
      };
      saveResponse(defaultResponse);
    }

    if (currentDesign < designs.length - 1) {
      setCurrentDesign(currentDesign + 1);
      setGrid(createInitialGrid());
      setScore(null);
      setElapsedTime(0);
      setIsRunning(true);
      setStartTime(Date.now());
    } else {
      setGameState("completed");
    }
  }

  // Retry current design
  function handleRetry() {
    setShowResultPopup(false);
    setGrid(createInitialGrid());
    setElapsedTime(0);
    setIsRunning(true);
    setStartTime(Date.now());
    setScore(null);
  }

  // Check if grid matches target design
  function checkSolution(grid, target) {
    return grid.every((row, i) => row.every((cell, j) => cell === target[i][j]));
  }

  // Update grid on move
  function handleMove(from, to) {
    const newGrid = grid.map(row => [...row]);
    const temp = newGrid[to.row][to.col];
    newGrid[to.row][to.col] = newGrid[from.row][from.col];
    newGrid[from.row][from.col] = temp;
    setGrid(newGrid);
  }

  // Timer effect
  useEffect(() => {
    let interval;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  // Calculate overall progress
  const overallProgress = (responses.length / designs.length) * 100;

  // Render completed state
  if (gameState === "completed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 p-4 sm:p-8 flex items-center justify-center">
        <Card className="w-full max-w-5xl bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
            <CardTitle className="text-3xl font-bold flex items-center gap-3">
              <Award className="h-8 w-8" /> Test Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 sm:p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-purple-700">Congratulations!</h2>
              <p className="text-gray-600">You have completed the Pass-Along Test.</p>
              <Results responses={responses} />

            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-white to-pink-100 p-4 sm:p-8 flex items-center justify-center">
      <Card className="w-full max-w-5xl bg-white/90 backdrop-blur-sm shadow-xl rounded-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold flex items-center gap-3">
                <Brain className="h-8 w-8" /> Pass-Along Test
              </CardTitle>
              <CardDescription className="text-white/80 mt-2">
                Match the target pattern by rearranging the blocks
              </CardDescription>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2 flex items-center gap-2">
              <span className="font-medium">Design</span>
              <span className="bg-white text-purple-700 font-bold rounded-full h-8 w-8 flex items-center justify-center">
                {currentDesign + 1}
              </span>
              <span className="text-white/80">of 8</span>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 bg-white/30" indicatorClassName="bg-white" />
          </div>
        </CardHeader>

        <CardContent className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Target Pattern Section */}
            <div className="space-y-4 order-2 md:order-1">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
                <Target className="h-5 w-5" /> Target Pattern
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm border border-purple-100">
                <DesignCard design={designs[currentDesign]} />
              </div>
            </div>

            {/* Test Pattern Section */}
            <div className="space-y-6 order-1 md:order-2">
              <h3 className="text-xl font-semibold flex items-center gap-2 text-purple-700">
                <Clock className="h-5 w-5" /> Your Solution
              </h3>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl shadow-sm border border-purple-100">
                <Tray grid={grid} onMove={handleMove} isRunning={isRunning} />
              </div>

              {/* Timer */}
              <Timer elapsedTime={elapsedTime} maxTime={currentDesign < 4 ? 120 : 180} />

              {/* Controls */}
              <div className="flex flex-wrap gap-3 justify-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleSubmit}
                        disabled={!isRunning}
                        className="hover:bg-rose-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Submit the answer"
                      >
                        <Check className="mr-2 h-5 w-5" /> Submit
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">Submit your solution</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleNext}
                        className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all shadow-md rounded-lg"
                        aria-label="Move to next design"
                      >
                        <ChevronRight className="mr-2 h-5 w-5" /> Next
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-md shadow-md">Go to the next design</TooltipContent>
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
                    <TooltipContent className="rounded-md shadow-md">Restart the current design</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {score !== null && (
                <div className="flex items-center justify-center gap-3 text-xl bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg animate-fade-in">
                  <Award className="h-6 w-6 text-yellow-500" />
                  <p className="text-gray-800">
                    Score: <span className="font-bold text-purple-700">{score}</span> {score === 1 ? "point" : "points"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <Results responses={responses} />
          </div>

          {/* Result Popup */}
          {showResultPopup && (
            <div
              className="fixed inset-0 flex items-center justify-center z-50 animate-fade-in backdrop-blur-sm"
              aria-live="polite"
            >
              <div className="bg-white px-8 py-6 rounded-lg shadow-lg flex flex-col items-center gap-4 text-center">
                {isCorrect ? (
                  <>
                    <Award className="h-16 w-16 text-yellow-500" />
                    <p className="text-3xl font-bold text-emerald-700">Success!</p>
                    <p className="text-xl text-gray-600">Pattern Matched Correctly</p>
                  </>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-rose-700">Incorrect</p>
                    <p className="text-xl text-gray-600">Pattern does not match.</p>
                  </>
                )}
                {!isCorrect && (
                  <div className="flex gap-4">
                    <Button
                      onClick={handleRetry}
                      className="bg-gray-600 hover:bg-gray-700 hover:scale-105 transition-all shadow-md rounded-lg"
                    >
                      Retry
                    </Button>
                    <Button
                      onClick={handleNext}
                      className="bg-purple-600 hover:bg-purple-700 hover:scale-105 transition-all shadow-md rounded-lg"
                    >
                      {currentDesign < designs.length - 1 ? "Next Design" : "Finish"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}