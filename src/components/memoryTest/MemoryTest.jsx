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

  // Initialize from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("memoryGameScores");
    if (savedData) setScores(JSON.parse(savedData));
    return () => clearTimeout(timerRef.current);
  }, []);

  // Save scores
  const saveScores = () => {
    localStorage.setItem("memoryGameScores", JSON.stringify(scores));
  };

  // Play sequence with speech
  const playSequence = (length, isDemo = false) => {
    const seq = generateSequence(length);
    setSequence(seq);
    setShowSequence(true);
    setUserInput("");

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
    playSequence(3);
  };

  // Handle answer submission
  const handleSubmit = () => {
    const isCorrect =
      testMode === "forward"
        ? userInput === sequence.join("")
        : userInput === [...sequence].reverse().join("");

    setLastAction(isCorrect ? "correct" : "wrong");

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
            Memory Challenge
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
                Listen to numbers and recall them in order or reverse. Each
                correct sequence increases difficulty.
              </CardDescription>

              {showDemo && (
                <div className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="flex justify-center gap-2 mb-2">
                    <AnimatePresence mode="popLayout">
                      {[3, 7, 2].map((num, i) => (
                        <motion.span
                          key={i}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={digitVariants}
                          className="text-2xl font-mono bg-white p-2 rounded"
                        >
                          {num}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm text-gray-600">
                    {testMode === "forward" ? "Enter: 3 7 2" : "Enter: 2 7 3"}
                  </p>
                </div>
              )}

              <div className="space-y-3">
                <Button className="w-full" onClick={() => startGame("forward")}>
                  Start Forward Test
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowDemo(!showDemo)}
                >
                  {showDemo ? "Hide Demo" : "Show Demo"}
                </Button>
              </div>
            </div>
          )}

          {/* Reverse Recall Demo */}
          {stage === "reverseDemo" && (
            <div className="space-y-6 text-center">
              <h3 className="text-xl font-bold">Reverse Recall Demo</h3>
              <p className="text-gray-600">
                Now you'll need to enter the numbers in reverse order
              </p>

              {showSequence ? (
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-center gap-2 mb-2">
                    <AnimatePresence mode="popLayout">
                      {sequence.map((num, i) => (
                        <motion.span
                          key={i}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={digitVariants}
                          className="text-2xl font-mono bg-white p-2 rounded"
                        >
                          {num}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm text-gray-500">Listen carefully...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2 mb-4">
                    <AnimatePresence mode="popLayout">
                      {[...sequence].reverse().map((num, i) => (
                        <motion.span
                          key={i}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={digitVariants}
                          className="text-2xl font-mono bg-white p-2 rounded shadow"
                        >
                          {num}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm text-gray-600">
                    You should enter: {[...sequence].reverse().join(" ")}
                  </p>
                  <Button
                    onClick={() => showModeTransition("reverse")}
                    className="w-full"
                  >
                    Start Reverse Test
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Gameplay Screen */}
          {stage === "playing" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium flex items-center gap-2">
                  {gameConfig[testMode].icon}
                  {gameConfig[testMode].title}
                </h3>
                <div className="flex gap-2">
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Level: {level}
                  </span>
                  <span className="text-sm bg-rose-100 text-rose-800 px-2 py-1 rounded">
                    Mistakes: {mistakes}/2
                  </span>
                </div>
              </div>

              {showSequence ? (
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <div className="flex justify-center gap-2">
                    <AnimatePresence mode="popLayout">
                      {sequence.map((num, i) => (
                        <motion.span
                          key={i}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          variants={digitVariants}
                          className="text-4xl font-bold"
                        >
                          {num}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Listen carefully...
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder={gameConfig[testMode].instruction}
                    value={userInput}
                    onChange={(e) =>
                      setUserInput(e.target.value.replace(/\D/g, ""))
                    }
                    className="text-center text-lg py-6 font-mono"
                    maxLength={level}
                  />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => playSequence(level)}
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Replay
                    </Button>
                    <Button className="flex-1" onClick={handleSubmit}>
                      Submit
                    </Button>
                  </div>

                  {lastAction && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center font-medium ${
                        lastAction === "correct"
                          ? "text-green-600"
                          : "text-rose-600"
                      }`}
                    >
                      {lastAction === "correct" ? "✓ Correct!" : "✗ Try again"}
                    </motion.p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Completion Screen */}
          {stage === "completed" && (
            <div className="space-y-6 text-center">
              <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg">
                <Award className="h-12 w-12 mx-auto text-yellow-500 mb-2" />
                <h3 className="text-xl font-bold">Test Completed!</h3>
                <p className="text-gray-600">
                  You remembered {scores.forward} digits forward and{" "}
                  {scores.reverse} digits in reverse
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Forward</p>
                    <p className="text-2xl font-bold">{scores.forward}/9</p>
                    <Progress
                      value={(scores.forward / 9) * 100}
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="font-medium">Reverse</p>
                    <p className="text-2xl font-bold">{scores.reverse}/6</p>
                    <Progress
                      value={(scores.reverse / 6) * 100}
                      className="h-2 mt-2"
                    />
                  </CardContent>
                </Card>
              </div>

              <Button className="w-full">
                ⬇️ click on next Challenge{" "}
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
