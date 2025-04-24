"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Carousel, CarouselItem } from "@/components/ui/carousel";

function generateSequence(length) {
  const nums = [];
  for (let i = 0; i < length; i++) {
    nums.push(Math.floor(Math.random() * 9).toString());
  }
  return nums;
}

export default function ImmediateMemoryTestPage() {
  const [stage, setStage] = useState("intro"); // intro | demo | sample | test | result
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);
  const [showSequence, setShowSequence] = useState(true);

  useEffect(() => {
    const storedScore = localStorage.getItem("memoryTestScore");
    if (storedScore) setScore(parseInt(storedScore));
  }, []);

  const nextSlide = () => {
    if (carouselIndex < 2) setCarouselIndex(carouselIndex + 1);
    else setStage("sample");
  };

  const startSequence = (len = 5) => {
    const seq = generateSequence(len);
    setSequence(seq);
    setShowSequence(true);
    setUserInput("");
    speakSequence(seq);
    setTimeout(() => setShowSequence(false), 3000);
  };

  const speakSequence = (seq) => {
    if ("speechSynthesis" in window) {
      const utter = new SpeechSynthesisUtterance(seq.join(" "));
      utter.rate = 0.9;
      utter.pitch = 1;
      speechSynthesis.speak(utter);
    }
  };

  const startSample = () => {
    startSequence(3);
  };

  const startTest = () => {
    startSequence(level + 2);
    setStage("test");
  };

  const handleSubmit = () => {
    const isCorrect = userInput.trim() === sequence.join("");

    if (isCorrect) {
      const newScore = score + 1;
      const newLevel = level + 1;
      setScore(newScore);
      setLevel(newLevel);
      localStorage.setItem("memoryTestScore", newScore);
    } else {
      const newIncorrectAttempts = incorrectAttempts + 1;
      setIncorrectAttempts(newIncorrectAttempts);
      if (newIncorrectAttempts >= 2) {
        setStage("result");
      }
    }

    if (incorrectAttempts < 2) {
      startSequence(level + 2); // Increase difficulty for next round
    } else {
      setStage("result"); // Show result after 2 incorrect attempts
    }
  };

  const reset = () => {
    setStage("intro");
    setCarouselIndex(0);
    setLevel(1);
    setIncorrectAttempts(0);
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
                A direct measure of <strong>auditory short-term memory</strong>.
                This test involves hearing or reading digit sequences and
                immediately repeating them. It becomes more difficult with
                longer sequences. It evaluates{" "}
                <strong>attention span, retention</strong>, and the ability to
                recall data under cognitive pressure—key traits of{" "}
                <strong>intelligence</strong> and{" "}
                <strong>mental alertness</strong>.
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
                  👂 You’ll hear a short sequence of numbers.
                </CarouselItem>
                <CarouselItem>
                  ⌛ Remember them quickly—only 3 seconds!
                </CarouselItem>
                <CarouselItem>
                  🎯 Type them in order. Levels increase if correct!
                </CarouselItem>
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
              <h2 className="text-xl font-bold">🎉 Result</h2>
              <p className="text-base">Score: {score}</p>
              <p className="text-sm text-gray-600">Level: {level}</p>
              <p className="text-sm mt-2">
                Correct Sequence:{" "}
                <span className="font-mono">{sequence.join("")}</span>
              </p>
              <div className="mt-4 space-x-2">
                <Button onClick={reset}>Restart Game</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
