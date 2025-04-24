"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselItem } from "@/components/memoryTest/Caraousel";

function generateSequence(length) {
  return Array.from({ length }, () => Math.floor(Math.random() * 9).toString());
}

export default function ImmediateMemoryTestPage() {
  const [stage, setStage] = useState("intro");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showSequence, setShowSequence] = useState(true);
  const [responseStartTime, setResponseStartTime] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("memoryTestAttempts");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAttempts(parsed);
      setScore(parsed.filter((a) => a.isCorrect).length);
    }
  }, []);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev < 2 ? prev + 1 : prev));
    if (carouselIndex === 2) setStage("sample");
  };

  const startSequence = (len = 5) => {
    const seq = generateSequence(len);
    setSequence(seq);
    setShowSequence(true);
    setUserInput("");
    speakSequence(seq);

    setTimeout(() => {
      setShowSequence(false);
      setResponseStartTime(Date.now());
    }, 3000);
  };

  const speakSequence = (seq) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(seq.join(" "));
      utter.rate = 0.9;
      utter.pitch = 1;
      speechSynthesis.speak(utter);
    }
  };

  const startSample = () => startSequence(3);

  const startTest = () => {
    setStage("test");
    startSequence(level + 2);
  };

  const handleSubmit = () => {
    const now = Date.now();
    const responseTime = responseStartTime
      ? parseFloat(((now - responseStartTime) / 1000).toFixed(2))
      : 10.0;

    const isCorrect = userInput.trim() === sequence.join("");
    const newScore = isCorrect ? score + 1 : score;
    const totalAttempts = attempts.length + 1;
    const accuracy = parseFloat(((newScore / totalAttempts) * 100).toFixed(2));

    const newAttempt = {
      id: totalAttempts,
      isCorrect,
      response_time: responseTime,
      accuracy,
      timestamp: new Date().toISOString(),
    };

    const updatedAttempts = [...attempts, newAttempt];
    setAttempts(updatedAttempts);
    localStorage.setItem("memoryTestAttempts", JSON.stringify(updatedAttempts));
    setScore(newScore);

    if (isCorrect) {
      setLevel((prev) => prev + 1);
      startSequence(level + 3);
    } else {
      const newIncorrect = incorrectAttempts + 1;
      setIncorrectAttempts(newIncorrect);
      if (newIncorrect >= 2) {
        setStage("result");
      } else {
        startSequence(level + 2);
      }
    }

    setResponseStartTime(null);
    setUserInput("");
  };

  const reset = () => {
    setStage("intro");
    setCarouselIndex(0);
    setLevel(1);
    setScore(0);
    setIncorrectAttempts(0);
    setUserInput("");
    setAttempts([]);
    setResponseStartTime(null);

    localStorage.removeItem("memoryTestAttempts");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-blue-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-4 text-center">
          {stage === "intro" && (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                🎧 Auditory Memory Challenge
              </h2>
              <p className="text-sm text-gray-700">
                Test your <strong>auditory short-term memory</strong>. Hear
                numbers, recall quickly, and type them in. Challenge increases
                as you succeed!
              </p>
              <Button className="mt-4" onClick={() => setStage("demo")}>
                Start Demo
              </Button>
            </div>
          )}

          {stage === "demo" && (
            <div>
              <h2 className="text-xl font-bold mb-2">How It Works</h2>
              <Carousel activeIndex={carouselIndex}>
                <CarouselItem>
                  👂 Hear a short sequence of numbers.
                </CarouselItem>
                <CarouselItem>
                  ⏳ Remember quickly — just 3 seconds!
                </CarouselItem>
                <CarouselItem>✍️ Type them in. Levels get harder!</CarouselItem>
              </Carousel>
              <Button className="mt-4" onClick={nextSlide}>
                Next
              </Button>
            </div>
          )}

          {stage === "sample" && (
            <div>
              <h2 className="text-lg font-semibold">Sample Run</h2>
              {showSequence ? (
                <div className="text-3xl font-bold my-2">
                  {sequence.join(" ")}
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Type what you remember"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <Button className="mt-2" onClick={() => setStage("test")}>
                    Continue to Test
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                className="mt-2"
                onClick={startSample}
              >
                Replay Sample
              </Button>
            </div>
          )}

          {stage === "test" && (
            <div>
              <h2 className="text-lg font-semibold">Level {level}</h2>
              {showSequence ? (
                <div className="text-3xl font-bold my-2">
                  {sequence.join(" ")}
                </div>
              ) : (
                <>
                  <Input
                    type="text"
                    placeholder="Enter the digits"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                  />
                  <Button className="mt-2" onClick={handleSubmit}>
                    Submit
                  </Button>
                </>
              )}
            </div>
          )}

          {stage === "result" && (
            <div>
              <h2 className="text-xl font-bold">🎉 Final Result</h2>
              <p className="text-base font-semibold">Score: {score}</p>
              <p className="text-sm">Attempts: {attempts.length}</p>
              <p className="text-sm mb-2">
                Accuracy:{" "}
                {attempts.length > 0
                  ? ((score / attempts.length) * 100).toFixed(2)
                  : "0"}
                %
              </p>
              <div className="text-left max-h-48 overflow-y-auto text-sm bg-gray-100 p-2 rounded-md">
                {attempts.map((attempt) => (
                  <div key={attempt.id} className="mb-1">
                    <strong>Q{attempt.id}</strong>: ✅
                    {attempt.isCorrect ? "Correct" : "Wrong"} | ⏱{" "}
                    {attempt.response_time}s | 🎯 {attempt.accuracy}% | 🕒{" "}
                    {new Date(attempt.timestamp).toLocaleString()}
                  </div>
                ))}
              </div>
              <div className="mt-4 space-x-2">
                <Button onClick={reset}>Restart</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
