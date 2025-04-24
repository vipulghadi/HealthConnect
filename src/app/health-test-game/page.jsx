"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import KohTest from "@/components/kohs/KohsTest";
import ImmediateMemoryTestPage from "@/components/memoryTest/MemoryTest";
import PassAlongTest from "@/components/passalong/PassAlongTest";
import Result from "@/components/TestResult/Result"; // Assuming Result component is here

const GAMES = {
  kohs: <KohTest />,
  imt: <ImmediateMemoryTestPage />,
  pat: <PassAlongTest />,
  // Add other game components here
};

export default function StartTestPage() {
  const [currTest, setCurrTest] = useState(""); // Start with the first game
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [testResults, setTestResults] = useState([]);
  const [isTestCompleted, setIsTestCompleted] = useState(false); // Track if all games are completed

  const games = ["kohs", "imt", "pat"]; // Add all game identifiers in sequence

  const handleStart = () => {
    if (name && age) {
      localStorage.setItem("userDetails", JSON.stringify({ name, age }));
      localStorage.setItem("testResponses", JSON.stringify([]));
      setCurrTest(games[0]); // Start with the first game
    }
  };

  const handleNextGame = (gameResult) => {
    // Save the result of the current game
    const newResults = [...testResults, gameResult];
    setTestResults(newResults);
    localStorage.setItem("testResponses", JSON.stringify(newResults));

    // Move to the next game
    const nextGameIndex = currentGameIndex + 1;
    if (nextGameIndex < games.length) {
      setCurrTest(games[nextGameIndex]); // Start next game
      setCurrentGameIndex(nextGameIndex);
    } else {
      setIsTestCompleted(true); // Mark the test as completed
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white px-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center">
            🧠 Bhatia Battery Test
          </h1>

          {currTest === "" ? (
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                The Bhatia Battery Test is a series of tests used to evaluate
                intelligence and cognitive functions. It is widely applied in
                clinical and educational settings in India.
              </p>
              <ul className="list-disc list-inside ml-2">
                <li>
                  Includes 5 sub-tests evaluating different cognitive abilities
                </li>
                <li>Each game is timed and tracks your response accuracy</li>
                <li>Your final IQ score will be calculated at the end</li>
                <li>Ensure you're in a quiet environment for optimal focus</li>
              </ul>
              <p className="mt-2">Please enter your name and age to begin:</p>
              <div className="space-y-3">
                <Input
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Your Age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>

              <div className="flex justify-center">
                <Button
                  className="mt-4 w-full"
                  onClick={handleStart}
                  disabled={!name || !age}
                >
                  Start Test
                </Button>
              </div>
            </div>
          ) : isTestCompleted ? (
            <Result testResults={testResults} />
          ) : (
            <div>
              {/* Render the current game component */}
              <div>{GAMES[currTest]}</div>

              {/* Provide a "Next Game" button */}
              <div className="flex justify-center mt-4">
                <Button
                  className="w-full"
                  onClick={() =>
                    handleNextGame({ gameId: currTest, timestamp: new Date() })
                  }
                >
                  Next Game
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
