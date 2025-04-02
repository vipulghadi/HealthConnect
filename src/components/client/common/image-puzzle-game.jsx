"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Timer } from "@/components/client/common/timer";
import toast, { Toaster } from "react-hot-toast"; // Correct import

const images = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1742812174810-c7525d200248?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    difficulty: "easy",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1742812174810-c7525d200248?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    difficulty: "easy",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1742812174810-c7525d200248?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    difficulty: "easy",
  },
  {
    id: 4,
    src: "https://unsplash.com/photos/a-lighthouse-stands-on-a-sandy-beach-PVeR1AyEyNY",

    difficulty: "easy",
  },
  {
    id: 5,
    src: "https://unsplash.com/photos/palm-tree-stands-tall-against-a-blue-sky-cLQSOLGkhSk",
    difficulty: "hard",
  },
  {
    id: 6,
    src: "https://unsplash.com/photos/palm-tree-stands-tall-against-a-blue-sky-cLQSOLGkhSk",
    difficulty: "hard",
  },
  {
    id: 7,
    src: "https://unsplash.com/photos/palm-tree-stands-tall-against-a-blue-sky-cLQSOLGkhSk",
    difficulty: "hard",
  },
  {
    id: 8,
    src: "https://source.unsplash.com/random/800x800?pattern",
    difficulty: "hard",
  },
];

export function ImagePuzzleGame() {
  const [imageIndex, setImageIndex] = useState(0);
  const [gridSize, setGridSize] = useState(3);
  const [puzzle, setPuzzle] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  // Initialize puzzle
  useEffect(() => {
    if (gameActive) return;

    const totalPieces = gridSize * gridSize;
    const pieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    pieces.push(null);

    const shuffled = shuffle([...pieces]);
    setPuzzle(shuffled);
    setSolved(false);
  }, [gridSize, imageIndex, gameActive]);

  // Check if puzzle is solved
  useEffect(() => {
    if (!gameActive) return;

    const isPuzzleSolved = checkSolved(puzzle);
    if (isPuzzleSolved) {
      setGameActive(false);
      setSolved(true);
      toast.success("Congratulations! Puzzle solved!", {
        position: "top-center",
      });
    }
  }, [puzzle, gameActive]);

  // Time management
  useEffect(() => {
    const currentImage = images[imageIndex];
    const initialTime = currentImage.difficulty === "easy" ? 120 : 300;

    if (gameActive) {
      setTimeLeft(initialTime);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameActive(false);
            toast.error("Time's up! Game over!", {
              position: "top-center",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameActive, imageIndex]);

  const movePiece = (index) => {
    if (!gameActive || solved) return;

    const emptyIndex = puzzle.indexOf(null);
    if (!isValidMove(index, emptyIndex)) return;

    const newPuzzle = [...puzzle];
    newPuzzle[emptyIndex] = newPuzzle[index];
    newPuzzle[index] = null;
    setPuzzle(newPuzzle);
  };

  const isValidMove = (pieceIndex, emptyIndex) => {
    const pieceRow = Math.floor(pieceIndex / gridSize);
    const pieceCol = pieceIndex % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    return (
      (pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) ||
      (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1)
    );
  };

  const startGame = () => {
    const totalPieces = gridSize * gridSize;
    const pieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    pieces.push(null);

    const shuffled = shuffle([...pieces]);
    setPuzzle(shuffled);
    setSolved(false);
    setGameActive(true);
    toast("Game started! Good luck!", {
      position: "top-center",
    });
  };

  const shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    const result = [...array];

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = result[currentIndex];
      result[currentIndex] = result[randomIndex];
      result[randomIndex] = temporaryValue;
    }

    if (
      !isSolvable(result, gridSize) &&
      result.indexOf(null) !== result.length - 1
    ) {
      const temp = result[0];
      result[0] = result[1];
      result[1] = temp;
    }

    return result;
  };

  const isSolvable = (puzzle, size) => {
    let inversions = 0;
    const puzzleWithoutNull = puzzle.filter((p) => p !== null);

    for (let i = 0; i < puzzleWithoutNull.length; i++) {
      for (let j = i + 1; j < puzzleWithoutNull.length; j++) {
        if (puzzleWithoutNull[i] > puzzleWithoutNull[j]) {
          inversions++;
        }
      }
    }

    const emptyRow = Math.floor(puzzle.indexOf(null) / size);
    if (size % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      return (inversions + (size - emptyRow)) % 2 === 1;
    }
  };

  const checkSolved = (puzzle) => {
    for (let i = 0; i < puzzle.length - 1; i++) {
      if (puzzle[i] !== i + 1) return false;
    }
    return puzzle[puzzle.length - 1] === null;
  };

  const nextQuestion = () => {
    setImageIndex((prev) => (prev + 1) % images.length);
    setGameActive(false);
    toast("Moving to next image!", {
      position: "top-center",
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
      <Toaster /> {/* Add Toaster component */}
      <div className="w-full lg:w-1/2 space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">
              Question {imageIndex + 1}:{" "}
              {images[imageIndex].difficulty.charAt(0).toUpperCase() +
                images[imageIndex].difficulty.slice(1)}{" "}
              Level
            </h2>
            {gameActive && <Timer timeLeft={timeLeft} />}
          </div>

          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm font-medium">
              Grid Size: {gridSize}x{gridSize}
            </span>
            <Slider
              className="w-32"
              min={2}
              max={5}
              step={1}
              value={[gridSize]}
              onValueChange={(values) => setGridSize(values[0])}
              disabled={gameActive}
            />
          </div>

          <div className="space-x-2">
            <Button onClick={startGame} disabled={gameActive}>
              {solved ? "Play Again" : "Start Game"}
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={gameActive && !solved}
              variant="outline"
            >
              Next Image
            </Button>
          </div>
        </div>

        <div
          className="relative border-2 border-primary rounded-lg overflow-hidden"
          style={{
            width: "min(100%, 500px)",
            height: "min(100vw, 500px)",
            margin: "0 auto",
          }}
        >
          <div
            className="grid gap-1 bg-muted h-full w-full"
            style={{
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
              gridTemplateRows: `repeat(${gridSize}, 1fr)`,
            }}
          >
            {puzzle.map((piece, index) => (
              <motion.div
                key={index}
                className={`relative ${
                  piece === null ? "invisible" : "cursor-pointer"
                }`}
                onClick={() => movePiece(index)}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                whileHover={{ scale: !gameActive || piece === null ? 1 : 1.05 }}
              >
                {piece !== null && (
                  <div className="w-full h-full relative overflow-hidden border border-border">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${images[imageIndex].src})`,
                        backgroundSize: `${gridSize * 100}%`,
                        backgroundPosition: `${
                          (((piece - 1) % gridSize) / (gridSize - 1)) * 100
                        }% ${
                          (Math.floor((piece - 1) / gridSize) /
                            (gridSize - 1)) *
                          100
                        }%`,
                      }}
                    />
                    {!gameActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50 font-bold text-lg">
                        {piece}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex justify-center">
        <div
          className="relative border-2 border-primary rounded-lg overflow-hidden"
          style={{ width: "min(100%, 500px)", height: "min(100vw, 500px)" }}
        >
          <Image
            src={images[imageIndex].src || "/placeholder.svg"}
            alt="Complete puzzle reference"
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </div>
  );
}
