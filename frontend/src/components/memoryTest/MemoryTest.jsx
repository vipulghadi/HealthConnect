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

// Function to calculate IQ score based on correct answers
function calculateIQScore(correctAnswers, totalQuestions) {
  const percentage = correctAnswers / totalQuestions;
  // Simplified IQ mapping: 50% correct = IQ 100, each 10% above/below adjusts by 15 points
  const iq = Math.round(100 + (percentage - 0.5) * 150);
  return Math.max(70, Math.min(130, iq)); // Cap IQ between 70 and 130
}

// Function to generate suggestions based on performance
function generateSuggestions(correctAnswers, totalQuestions, testMode) {
  const percentage = correctAnswers / totalQuestions;
  if (percentage >= 0.8) {
    return `Excellent performance in ${testMode} recall! To further enhance your skills, try increasing the sequence length or practicing with distractions.`;
  } else if (percentage >= 0.5) {
    return `Good effort in ${testMode} recall. Practice with similar sequences daily to improve accuracy and speed. Apps like Lumosity can help.`;
  } else {
    return `Your ${testMode} recall needs improvement. Start with shorter sequences and gradually increase difficulty. Focus on concentration techniques.`;
  }
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
  const [questionId, setQuestionId] = useState(1); // Start at 1 to match JSON format
  const [startTime, setStartTime] = useState(null);
  const [totalCorrect, setTotalCorrect] = useState(0); // Track correct answers
  const [totalQuestions, setTotalQuestions] = useState(0); // Track total questions
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
    // Clear existing memoryTest data
    localStorage.removeItem("memoryTest");
    localStorage.removeItem("memoryTestQuestions");
    localStorage.removeItem("memoryGameScores");

    // Initialize KohsTest data
    const savedData = localStorage.getItem("kohsTestData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setScores({
        forward: parsedData.totalScore || 0,
        reverse: parsedData.totalScore || 0,
      });
      setTotalCorrect(parsedData.questions?.filter(q => q.isCorrect).length || 0);
      setTotalQuestions(parsedData.questions?.length || 0);
    } else {
      setScores({ forward: 0, reverse: 0 });
      setTotalCorrect(0);
      setTotalQuestions(0);
    }

    // Reset other states
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
    setQuestionId(1);
    setStartTime(null);

    // Cleanup timer
    return () => clearTimeout(timerRef.current);
  }, []);

  // Save KohsTest data to localStorage
  const saveKohsTestData = (newQuestion) => {
    const responseTime = startTime ? (Date.now() - startTime) / 1000 : 0; // Convert to seconds
    const existingData = localStorage.getItem("kohsTestData");
    let kohsTestData = existingData
      ? JSON.parse(existingData)
      : {
          gameName: "KohsTest",
          totalScore: 0,
          totalTimeTaken: 0,
          questions: [],
        };

    // Update question data
    kohsTestData.questions.push(newQuestion);
    kohsTestData.totalScore = kohsTestData.questions.filter(q => q.isCorrect).length;
    kohsTestData.totalTimeTaken = kohsTestData.questions.reduce(
      (sum, q) => sum + q.responseTime,
      0
    );

    // Calculate IQ score
    const correctAnswers = kohsTestData.questions.filter(q => q.isCorrect).length;
    const totalQuestions = kohsTestData.questions.length;
    kohsTestData.iqScore = calculateIQScore(correctAnswers, totalQuestions);

    // Add suggestions
    kohsTestData.suggestions = generateSuggestions(correctAnswers, totalQuestions, testMode);

    // Save to localStorage
    localStorage.setItem("kohsTestData", JSON.stringify(kohsTestData));
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
    setQuestionId(1);
    setTotalCorrect(0);
    setTotalQuestions(0);
    playSequence(3);
  };

  // Handle answer submission
  const handleSubmit = () => {
    const isCorrect =
      testMode === "forward"
        ? userInput === sequence.join("")
        : userInput === [...sequence].reverse().join("");

    setLastAction(isCorrect ? "correct" : "wrong");
    setTotalQuestions(prev => prev + 1);
    if (isCorrect) setTotalCorrect(prev => prev + 1);

    // Create question data
    const responseTime = startTime ? (Date.now() - startTime) / 1000 : 0; // Convert to seconds
    const questionData = {
      questionId,
      isCorrect,
      responseTime,
    };

    // Save to KohsTest data
    saveKohsTestData(questionData);

    setQuestionId(prev => prev + 1);

    if (isCorrect) {
      // Update score if this is the longest sequence remembered
      if (sequence.length > scores[testMode]) {
        const newScores = { ...scores, [testMode]: sequence.length };
        setScores(newScores);
      }

      // Increase difficulty or switch modes
      if (level < gameConfig[testMode].maxDigits) {
        setLevel(level + 1);
        playSequence(level + 1);
      } else {
        if (testMode === "forward") {
          setStage("reverseDemo");
          playSequence(3, true);
        } else {
          setStage("completed");
        }
      }
    } else {
      setMistakes(mistakes + 1);
      if (mistakes >= 1) {
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

  // Display results on completion
  const kohsTestData = JSON.parse(localStorage.getItem("kohsTestData") || "{}");
  const completedContent = (
    <div className="space-y-6 text-center">
      <h3 className="text-xl font-bold">Test Complete</h3>
      <div className="text-left">
        <p><strong>IQ Score:</strong> {kohsTestData.iqScore || "N/A"}</p>
        <p><strong>Total Score:</strong> {kohsTestData.totalScore || 0}</p>
        <p><strong>Total Time Taken:</strong> {kohsTestData.totalTimeTaken?.toFixed(2) || 0} seconds</p>
        <p><strong>Suggestions:</strong> {kohsTestData.suggestions || "No suggestions available."}</p>
      </div>
      <div className="space-x-4">
        <Button onClick={() => setStage("intro")}>Retry</Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <CardTitle className="text-2xl flex items-center gap-2">
            <Volume2 className="h-6 w-6" />
            Kohs Memory Test
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
          {stage === "completed" && completedContent}
        </CardContent>
      </Card>
    </div>
  );
}