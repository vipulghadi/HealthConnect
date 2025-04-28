"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Volume2,
  ChevronRight,
  RotateCcw,
  Award,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9).toString());
}

export default function ImmediateMemoryTestPage() {
  // Game state
  const [stage, setStage] = useState("intro");
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [level, setLevel] = useState(3);
  const [showSequence, setShowSequence] = useState(false);
  const [testMode, setTestMode] = useState("forward");
  const [mistakes, setMistakes] = useState(0);
  const [scores, setScores] = useState({ forward: 0, reverse: 0 });
  const [showDemo, setShowDemo] = useState(false);
  const [lastAction, setLastAction] = useState(null);
  const [showTransition, setShowTransition] = useState(false);
  const [transitionDirection, setTransitionDirection] = useState("forward");
  const [questionId, setQuestionId] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const timerRef = useRef(null);

  // Game configuration
  const gameConfig = {
    forward: {
      maxDigits: 9,
      title: "Forward Recall",
      instruction: "Enter numbers in order",
      icon: <ArrowRight className="h-5 w-5" />,
    },
    reverse: {
      maxDigits: 6,
      title: "Reverse Recall",
      instruction: "Enter numbers in reverse",
      icon: <ArrowLeft className="h-5 w-5" />,
    },
  };

  // Initialize from localStorage and clear memoryTest
  useEffect(() => {
    // Clear existing memoryTest data and reset state variables
    localStorage.removeItem("memoryTest");

    // Reset scores to default values or retrieve from localStorage if available
    const savedData = localStorage.getItem("memoryGameScores");
    if (savedData) {
      setScores(JSON.parse(savedData));
    } else {
      setScores({ forward: 0, reverse: 0 }); // Default scores
    }

    // Ensure other states are reset to initial values
    setSequence([]);
    setUserInput("");
    setLevel(3);
    setMistakes(0);
    setStage("intro");
    setTestMode("forward");
    setShowSequence(false);
    setShowDemo(false);
    setLastAction(null);
    setShowTransition(false);
    setTransitionDirection("forward");
    setQuestionId(0);
    setStartTime(null);

    // Cleanup function to clear the timer
    return () => clearTimeout(timerRef.current);
  }, []); // Empty dependency array ensures this only runs once on component mount

  // Save scores
  const saveScores = () => {
    localStorage.setItem("memoryGameScores", JSON.stringify(scores));
  };

  // Update localStorage with question data
  const updateQuestionStorage = (isCorrect) => {
    const responseTime = startTime ? Date.now() - startTime : 0;
    const totalScore = scores.forward + scores.reverse;

    const questionData = {
      questionId,
      isCorrect,
      score: isCorrect ? sequence.length : 0,
      testMode,
      totalScore,
      responseTime,
      timestamp: new Date().toISOString(),
    };

    // Get existing questions or initialize new array
    const existingData = localStorage.getItem("memoryTestQuestions");
    const questions = existingData ? JSON.parse(existingData) : {};

    // Add new question data to the appropriate question (with questionId as key)
    if (!questions[questionId]) {
      questions[questionId] = [];
    }
    questions[questionId].push(questionData);

    // Save to localStorage
    localStorage.setItem("memoryTestQuestions", JSON.stringify(questions));
  };

  // Play sequence with speech
  const playSequence = (length, isDemo = false) => {
    const seq = generateSequence(length);
    setSequence(seq);
    setShowSequence(true);
    setUserInput("");
    setStartTime(Date.now());

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(
        isDemo ? `Demo: ${seq.join(" ")}` : seq.join(" ")
      );
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }

    timerRef.current = setTimeout(() => setShowSequence(false), 3000);
  };

  // Show mode transition animation
  const showModeTransition = (newMode) => {
    setTransitionDirection(newMode);
    setShowTransition(true);
    setTimeout(() => {
      setShowTransition(false);
      startGame(newMode);
    }, 1500);
  };

  // Start game flow
  const startGame = (mode) => {
    setTestMode(mode);
    setStage("playing");
    setLevel(3);
    setMistakes(0);
    setQuestionId(0);
    playSequence(3);
  };

  // Handle answer submission
  const handleSubmit = () => {
    const isCorrect =
      testMode === "forward"
        ? userInput === sequence.join("")
        : userInput === [...sequence].reverse().join("");

    setLastAction(isCorrect ? "correct" : "wrong");
    setQuestionId((prev) => prev + 1);

    // Update localStorage with question data
    updateQuestionStorage(isCorrect);

    if (isCorrect) {
      // Update score if this is the longest sequence remembered
      if (sequence.length > scores[testMode]) {
        const newScores = { ...scores, [testMode]: sequence.length };
        setScores(newScores);
        saveScores();
      }

      // Increase difficulty or switch modes
      if (level < gameConfig[testMode].maxDigits) {
        setLevel(level + 1);
        playSequence(level + 1);
      } else {
        if (testMode === "forward") {
          // Show demo before switching to reverse
          setStage("reverseDemo");
          playSequence(3, true);
        } else {
          setStage("completed");
        }
      }
    } else {
      setMistakes(mistakes + 1);
      if (mistakes >= 1) {
        // End after 2 mistakes
        if (testMode === "forward" && scores.forward < 9) {
          setStage("reverseDemo");
          playSequence(3, true);
        } else {
          setStage("completed");
        }
      } else {
        playSequence(level); // Retry same level
      }
    }
  };

  // Digit animation variants
  const digitVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Immediate Memory Test
          </CardTitle>
          <div className="flex justify-between text-sm mt-2">
            <span>Forward: {scores.forward}/9</span>
            <span>Reverse: {scores.reverse}/6</span>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Transition Animation */}
          <AnimatePresence>
            {showTransition && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black/50 z-10"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  className="bg-white p-8 rounded-xl text-center"
                >
                  <motion.div
                    animate={{
                      x:
                        transitionDirection === "forward"
                          ? [0, 20, 0]
                          : [0, -20, 0],
                      transition: { repeat: 2, duration: 0.5 },
                    }}
                    className="text-4xl font-bold mb-4"
                  >
                    {gameConfig[transitionDirection].icon}
                  </motion.div>
                  <h3 className="text-xl font-bold">
                    Switching to {gameConfig[transitionDirection].title}
                  </h3>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Introduction Screen */}
          {stage === "intro" && (
            <div className="space-y-6 text-center">
              <CardDescription>
                Listen to numbers being spoken and then repeat them back either
                in the same order or in reverse order.
              </CardDescription>
              <div className="flex justify-center gap-4">
                <Button onClick={() => startGame("forward")}>Start Forward</Button>
                <Button onClick={() => startGame("reverse")}>Start Reverse</Button>
              </div>
            </div>
          )}

          {/* Playing Screen */}
          {stage === "playing" && (
            <div className="space-y-6 text-center">
              {showSequence && (
                <div className="text-4xl font-bold">{sequence.join(" ")}</div>
              )}
              {!showSequence && (
                <div>
                  <h3 className="text-lg mb-4">Enter numbers:</h3>
                  <Input
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    type="text"
                    placeholder="Type your answer"
                  />
                  <Button className="mt-4" onClick={handleSubmit}>
                    Submit Answer
                  </Button>
                </div>
              )}
              <div className="flex justify-center mt-4">
                <Progress
                  value={(level / gameConfig[testMode].maxDigits) * 100}
                  className="w-2/3"
                />
              </div>
            </div>
          )}

          {/* Demo Screen */}
          {stage === "reverseDemo" && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold">Demo: Reverse Recall</h3>
              <div className="text-4xl font-bold">{sequence.join(" ")}</div>
              <Button
                className="mt-4"
                onClick={() => startGame("reverse")}
              >
                Start Reverse Recall
              </Button>
            </div>
          )}

          {/* Completed Screen */}
          {stage === "completed" && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold">Test Complete</h3>
              <div className="space-x-4">
                <Button onClick={() => setStage("intro")}>Retry</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
