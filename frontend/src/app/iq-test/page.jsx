"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import KohTest from "@/components/kohs/KohsTest";
import ImmediateMemoryTestPage from "@/components/memoryTest/MemoryTest";
import PassAlongTest from "@/components/passalong/PassAlongTest";
import PatternTest from "@/components/patternTest/PatternTest";

// CustomSelect component remains unchanged
const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {value
          ? options.find((o) => o.value === value)?.label
          : "Select an option"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 opacity-50"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md border-indigo-200 animate-in fade-in-80">
          <div className="p-1">
            {options.map((option) => (
              <div
                key={option.value}
                className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-indigo-100 focus:bg-indigo-100"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const GAMES = {
  kohs: <KohTest />,
  imt: <ImmediateMemoryTestPage />,
  pat: <PassAlongTest />,
  patternTest: <PatternTest />,
};

export default function StartTestPage() {
  const [currTest, setCurrTest] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [iqScore, setIqScore] = useState(null);
  const [extraTestData, setExtraTestData] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const games = ["kohs", "imt", "pat", "patternTest"];
  const educationOptions = [
    { value: "literate", label: "Literate" },
    { value: "illiterate", label: "Illiterate" },
  ];

  const handleStart = () => {
    if (name && age && educationLevel) {
      setIsAnimating(true);
      setTimeout(() => {
        localStorage.setItem(
          "userDetails",
          JSON.stringify({ name, age, educationLevel })
        );
        localStorage.setItem("testResponses", JSON.stringify([]));
        setCurrTest(games[0]);
        setIsAnimating(false);
      }, 1000);
    }
  };

  const fetchExtraTestData = () => {
    const testKeys = [
      "KohsTest",
      "PassAlongTest",
      "PatternTest",
      "PictureConstructionTest",
      "MemoryTest",
      "userDetails",
    ];
    const data = {};

    testKeys.forEach((key) => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        try {
          data[key] = JSON.parse(storedData);
        } catch (error) {
          console.error(`Error parsing ${key} from localStorage:`, error);
          data[key] = null;
        }
      } else {
        data[key] = null;
      }
    });

    console.log("Extra Test Data from localStorage:", data);
    return data;
  };

  const calculateIQScore = (testData, userAge, userEducation) => {
    try {
      let kohsScore = 0;
      let passAlongScore = 0;
      let patternScore = 0;

      // KohsTest: Score based on correct answers
      if (testData.KohsTest && testData.KohsTest.questions) {
        kohsScore =
          (testData.KohsTest.questions.filter((q) => q.isCorrect).length /
            testData.KohsTest.questions.length) *
          100;
      }

      // PassAlongTest: Sum of scores, normalized
      if (testData.PassAlongTest && testData.PassAlongTest.questions) {
        const maxScorePerQuestion = 5; // Assumption
        const totalPossibleScore =
          testData.PassAlongTest.questions.length * maxScorePerQuestion;
        passAlongScore =
          (testData.PassAlongTest.questions.reduce(
            (sum, q) => sum + (q.score || 0),
            0
          ) / totalPossibleScore) * 100;
      }

      // PatternTest: Use score directly, normalized
      if (testData.PatternTest && testData.PatternTest.questions) {
        patternScore =
          (testData.PatternTest.questions.reduce(
            (sum, q) => sum + (q.score || 0),
            0
          ) / 50) * 100; // Assuming max score of 50
      }

      // Age adjustment
      const ageAdjustment = userAge <= 12 ? 0.95 : 1.0; // Slightly lower for younger ages
      // Education adjustment
      const educationAdjustment = userEducation === "illiterate" ? 0.9 : 1.0;

      // Weighted total score
      const totalScore =
        (kohsScore * 0.3 + passAlongScore * 0.3 + patternScore * 0.4) *
        ageAdjustment *
        educationAdjustment;

      // Convert to IQ (70–130 range)
      const iq = Math.round((totalScore / 100) * 60 + 70);

      // Detailed output if IQ is 50
      if (iq === 50) {
        console.log({
          message: "IQ Score is exactly 50",
          kohsScore,
          passAlongScore,
          patternScore,
          totalScore,
          ageAdjustment,
          educationAdjustment,
          reason:
            "This may indicate very low performance across all tests or missing data.",
          testData,
        });
      }

      return iq;
    } catch (error) {
      console.error("Error calculating IQ score:", error);
      return null;
    }
  };

  const handleNextGame = (gameResult) => {
    const newResults = [...testResults, gameResult];
    setTestResults(newResults);
    localStorage.setItem("testResponses", JSON.stringify(newResults));

    const nextGameIndex = currentGameIndex + 1;
    if (nextGameIndex < games.length) {
      setCurrTest(games[nextGameIndex]);
      setCurrentGameIndex(nextGameIndex);
    } else {
      const extraData = fetchExtraTestData();
      setExtraTestData(extraData);
      setIsTestCompleted(true);

      // Calculate IQ score
      setIsLoading(true);
      setError(null);
      try {
        const iq = calculateIQScore(
          extraData,
          parseInt(age),
          educationLevel
        );
        if (iq !== null) {
          setIqScore(iq);
        } else {
          setError("Unable to calculate IQ score due to invalid data.");
        }
      } catch (error) {
        console.error("Error in IQ calculation:", error);
        setError("Failed to calculate IQ score. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const calculateTotalScore = (newResults) => {
    try {
      let totalScore = 0;
      newResults.forEach((gameResult) => {
        const { questions } = gameResult;
        if (questions) {
          questions.forEach((question) => {
            if (question.score) {
              totalScore += question.score;
            }
          });
        }
      });
      return totalScore;
    } catch (error) {
      console.error("Error calculating total score:", error);
      return 0;
    }
  };

  const handleRetry = () => {
    setIsTestCompleted(false);
    setTestResults([]);
    setIqScore(null);
    setExtraTestData({});
    setError(null);
    setCurrentGameIndex(0);
    setCurrTest(games[0]);
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="w-full shadow-xl rounded-2xl border-2 border-indigo-300 bg-gradient-to-b from-indigo-50 to-white">
          <CardContent className="p-6 space-y-6">
            <motion.div
              animate={{
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
              }}
              className="flex justify-center"
            >
              <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                🧠 Real Time IQ Test 🚀
              </h1>
            </motion.div>

            {currTest === "" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: isAnimating ? 0 : 1 }}
                className="space-y-6"
              >
                <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                  <p className="text-indigo-800 font-medium">
                    🎮 Welcome to the IQ Test! 🎮
                  </p>
                  <p className="mt-2 text-indigo-700">
                    Complete these mental quests to unlock your brain's potential!
                  </p>
                </div>

                <div className="space-y-4">
                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-1">
                    <label className="block text-sm font-medium text-indigo-700">
                      👤 Player Name
                    </label>
                    <Input
                      placeholder="Enter your hero name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-1">
                    <label className="block text-sm font-medium text-indigo-700">
                      🎂 Player Age
                    </label>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="border-indigo-300 focus:ring-2 focus:ring-indigo-200"
                    />
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} className="space-y-1">
                    <label className="block text-sm font-medium text-indigo-700">
                      🎓 Education Level
                    </label>
                    <CustomSelect
                      value={educationLevel}
                      onChange={setEducationLevel}
                      options={educationOptions}
                    />
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col gap-4"
                >
                  <Button
                    className={`w-full py-6 text-lg font-bold transition-all ${
                      !name || !age || !educationLevel
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
                    }`}
                    onClick={handleStart}
                    disabled={!name || !age || !educationLevel}
                  >
                    {isAnimating ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          ⚡
                        </motion.span>
                        Loading Adventure...
                      </span>
                    ) : (
                      "🚀 Start IQ Test!"
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            ) : isTestCompleted ? (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-indigo-800">
                  🎉 Test Completed! 🎉
                </h2>
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : isLoading ? (
                  <p className="text-xl flex items-center justify-center">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mr-2"
                    >
                      ⚙️
                    </motion.span>
                    Calculating IQ Score...
                  </p>
                ) : (
                  <p className="text-xl">
                    Your IQ Score: {iqScore | "50"}
                  </p>
                )}
        
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleRetry}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg"
                  >
                    Retry Test
                  </Button>
                  <Button
                    onClick={handleGoHome}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <div>{GAMES[currTest]}</div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    className="w-full mt-4 py-6 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg"
                    onClick={() =>
                      handleNextGame({
                        gameId: currTest,
                        timestamp: new Date(),
                        questions: [], // Replace with actual questions data
                      })
                    }
                  >
                    ⏭️ Next Challenge
                  </Button>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}