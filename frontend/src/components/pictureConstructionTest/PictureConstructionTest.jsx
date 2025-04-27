"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowRight,
  Clock,
  Award,
  RefreshCcw,
  Info,
  ArrowLeft,
  X,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const STORAGE_KEY = "pictureConstructionTest";

const images = [
  {
    id: 1,
    src: "/images/puzzle-1.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1742812174810-c7525d200248?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieceCount: 2,
    grid: { rows: 2, cols: 1 },
    timeLimit: 60,
    title: "Simple Pattern",
  },
  {
    id: 2,
    src: "/images/puzzle-2.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1742812174810-c7525d200248?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    pieceCount: 4,
    grid: { rows: 2, cols: 2 },
    timeLimit: 120,
    title: "Basic Pattern",
  },
  {
    id: 3,
    src: "/images/puzzle-3.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?q=80&w=1374&auto=format&fit=crop",
    pieceCount: 6,
    grid: { rows: 3, cols: 2 },
    timeLimit: 180,
    title: "Lighthouse",
  },
  {
    id: 4,
    src: "/images/puzzle-4.jpg",
    fallbackSrc:
      "https://images.unsplash.com/photo-1545135067-ddb9525f443f?q=80&w=1470&auto=format&fit=crop",
    pieceCount: 8,
    grid: { rows: 4, cols: 2 },
    timeLimit: 240,
    title: "Palm Tree",
  },
  {
    id: 5,
    src: "/images/puzzle-5.jpg",
    fallbackSrc: "https://source.unsplash.com/random/800x800?pattern",
    pieceCount: 12,
    grid: { rows: 4, cols: 3 },
    timeLimit: 300,
    title: "Complex Pattern",
  },
];

// Timer component with progress bar
const Timer = ({ timeLimit, timeLeft, isActive }) => {
  const progress = (timeLeft / timeLimit) * 100;

  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between text-sm">
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{timeLeft} seconds remaining</span>
        </div>
        <span>{Math.floor(progress)}%</span>
      </div>
      <Progress
        value={progress}
        className="h-2"
        aria-label={`${timeLeft} seconds remaining`}
      />
    </div>
  );
};

export function PictureConstructionTest() {
  const [imageIndex, setImageIndex] = useState(0);
  const [puzzle, setPuzzle] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [results, setResults] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [isKeyboardMode, setIsKeyboardMode] = useState(false);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState(null);

  const puzzleRef = useRef(null);

  // Load results from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setResults(parsed.results || []);
        setTotalScore(parsed.totalScore || 0);

        // Check if test was completed
        if (parsed.results && parsed.results.length === images.length) {
          setTestCompleted(true);
        }
      }

      // Show instructions on first visit
      if (!localStorage.getItem(`${STORAGE_KEY}_instructionsShown`)) {
        setShowInstructions(true);
        localStorage.setItem(`${STORAGE_KEY}_instructionsShown`, "true");
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
  }, []);

  // Save results to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ results, totalScore })
      );
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }, [results, totalScore]);

  // Initialize puzzle
  useEffect(() => {
    if (gameActive) return;

    const currentImage = images[imageIndex];
    const totalPieces = currentImage.pieceCount;
    const pieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    pieces.push(null);

    const shuffled = shuffle([...pieces], currentImage.grid);
    setPuzzle(shuffled);
    setSolved(false);
    setImgError(false);
    setSelectedPieceIndex(null);
  }, [imageIndex, gameActive]);

  // Time management
  useEffect(() => {
    let timer;
    if (gameActive) {
      const currentImage = images[imageIndex];
      setTimeLeft(currentImage.timeLimit);
      setStartTime(Date.now());

      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameActive(false);
            saveResult(false);
            toast.error("Time's up! Game over!", { position: "top-center" });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameActive, imageIndex]);

  // Check if puzzle is solved
  useEffect(() => {
    if (!gameActive) return;

    const isPuzzleSolved = checkSolved(puzzle);
    if (isPuzzleSolved) {
      setGameActive(false);
      setSolved(true);
      saveResult(true);
      toast.success("Congratulations! Puzzle solved!", {
        position: "top-center",
      });
    }
  }, [puzzle, gameActive]);

  // Keyboard navigation
  useEffect(() => {
    if (!gameActive || !isKeyboardMode) return;

    const handleKeyDown = (e) => {
      if (!gameActive) return;

      const emptyIndex = puzzle.indexOf(null);
      const grid = images[imageIndex].grid;
      const cols = grid.cols;

      let targetIndex = -1;

      // Arrow keys for navigating through puzzle pieces
      switch (e.key) {
        case "ArrowUp":
          targetIndex = emptyIndex + cols;
          break;
        case "ArrowDown":
          targetIndex = emptyIndex - cols;
          break;
        case "ArrowLeft":
          if (emptyIndex % cols !== cols - 1) targetIndex = emptyIndex + 1;
          break;
        case "ArrowRight":
          if (emptyIndex % cols !== 0) targetIndex = emptyIndex - 1;
          break;
        case "Escape":
          setIsKeyboardMode(false);
          setSelectedPieceIndex(null);
          break;
        default:
          return;
      }

      // Process move if target index is valid
      if (targetIndex >= 0 && targetIndex < puzzle.length) {
        if (isValidMove(targetIndex, emptyIndex, grid)) {
          movePiece(targetIndex);
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [gameActive, puzzle, imageIndex, isKeyboardMode]);

  // Focus trap for keyboard mode
  useEffect(() => {
    if (isKeyboardMode && puzzleRef.current) {
      puzzleRef.current.focus();
    }
  }, [isKeyboardMode]);

  const saveResult = (isCorrect) => {
    if (!startTime) return;

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const newResult = {
      imageId: images[imageIndex].id,
      pieceCount: images[imageIndex].pieceCount,
      isCorrect,
      timeTaken,
    };

    // Check if this result already exists (in case of replay)
    const existingIndex = results.findIndex(
      (r) => r.imageId === newResult.image劫

    )

    if (existingIndex !== -1) {
      // Replace existing result
      updatedResults = [...results];
      updatedResults[existingIndex] = newResult;
    } else {
      // Add new result
      updatedResults = [...results, newResult];
    }

    const newTotalScore = updatedResults.reduce(
      (sum, res) => sum + (res.isCorrect ? 10 : 0),
      0
    );

    setResults(updatedResults);
    setTotalScore(newTotalScore);

    // Check if test is complete
    if (updatedResults.length === images.length) {
      setTestCompleted(true);
    }
  };

  const movePiece = (index) => {
    if (!gameActive || solved) return;

    const emptyIndex = puzzle.indexOf(null);
    if (!isValidMove(index, emptyIndex, images[imageIndex].grid)) return;

    const newPuzzle = [...puzzle];
    newPuzzle[emptyIndex] = newPuzzle[index];
    newPuzzle[index] = null;
    setPuzzle(newPuzzle);

    // Update selected piece for keyboard mode
    if (isKeyboardMode) {
      setSelectedPieceIndex(emptyIndex);
    }
  };

  const isValidMove = (pieceIndex, emptyIndex, grid) => {
    const rows = grid.rows;
    const cols = grid.cols;
    const pieceRow = Math.floor(pieceIndex / cols);
    const pieceCol = pieceIndex % cols;
    const emptyRow = Math.floor(emptyIndex / cols);
    const emptyCol = emptyIndex % cols;

    return (
      (pieceRow === emptyRow && Math.abs(pieceCol - emptyCol) === 1) ||
      (pieceCol === emptyCol && Math.abs(pieceRow - emptyRow) === 1)
    );
  };

  const startGame = () => {
    const currentImage = images[imageIndex];
    const totalPieces = currentImage.pieceCount;
    const pieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    pieces.push(null);

    const shuffled = shuffle([...pieces], currentImage.grid);
    setPuzzle(shuffled);
    setSolved(false);
    setGameActive(true);
    toast("Game started! Good luck!", { position: "top-center" });
  };

  const shuffle = (array, grid) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    const result = [...array];

    // Standard Fisher-Yates shuffle
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = result[currentIndex];
      result[currentIndex] = result[randomIndex];
      result[randomIndex] = temporaryValue;
    }

    // Make sure the puzzle is solvable
    if (!isSolvable(result, grid.rows, grid.cols)) {
      // Swap first two non-empty pieces to ensure solvability
      const firstNonEmptyIndex = result.findIndex((p) => p !== null);
      const secondNonEmptyIndex = result.findIndex(
        (p, i) => p !== null && i > firstNonEmptyIndex
      );

      if (firstNonEmptyIndex !== -1 && secondNonEmptyIndex !== -1) {
        const temp = result[firstNonEmptyIndex];
        result[firstNonEmptyIndex] = result[secondNonEmptyIndex];
        result[secondNonEmptyIndex] = temp;
      }
    }

    return result;
  };

  const isSolvable = (puzzle, rows, cols) => {
    // Count inversions
    let inversions = 0;
    const puzzleWithoutNull = puzzle.filter((p) => p !== null);

    for (let i = 0; i < puzzleWithoutNull.length; i++) {
      for (let j = i + 1; j < puzzleWithoutNull.length; j++) {
        if (puzzleWithoutNull[i] > puzzleWithoutNull[j]) {
          inversions++;
        }
      }
    }

    const emptyIndex = puzzle.indexOf(null);
    const emptyRow = Math.floor(emptyIndex / cols);

    // For puzzles with odd width, number of inversions must be even
    if (cols % 2 === 1) {
      return inversions % 2 === 0;
    }
    // For puzzles with even width, number of inversions + row of empty square from bottom must be odd
    else {
      return (inversions + (rows - 1 - emptyRow)) % 2 === 1;
    }
  };

  const checkSolved = (puzzle) => {
    for (let i = 0; i < puzzle.length - 1; i++) {
      if (puzzle[i] !== i + 1) return false;
    }
    return puzzle[puzzle.length - 1] === null;
  };

  const nextQuestion = () => {
    if (imageIndex + 1 < images.length) {
      setImageIndex((prev) => prev + 1);
      setGameActive(false);
      toast("Moving to next image!", { position: "top-center" });
    } else {
      setShowResults(true);
      toast("Test completed!", { position: "top-center" });
    }
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const resetAllData = () => {
    setResults([]);
    setTotalScore(0);
    setImageIndex(0);
    setGameActive(false);
    setSolved(false);
    setTestCompleted(false);
    setShowConfirmReset(false);
    localStorage.removeItem(STORAGE_KEY);
    toast.success("All data has been reset", { position: "top-center" });
  };

  const toggleKeyboardMode = () => {
    setIsKeyboardMode((prev) => !prev);
    if (!isKeyboardMode) {
      setSelectedPieceIndex(null);
      toast.success(
        "Keyboard mode enabled. Use arrow keys to move pieces.",
        { position: "top-center" }
      );
    } else {
      toast("Keyboard mode disabled", { position: "top-center" });
    }
  };

  const renderResultSummary = () => {
    const resultsByQuestion = Array(images.length).fill(null);
    results.forEach((result) => {
      const index = images.findIndex((img) => img.id === result.imageId);
      if (index !== -1) {
        resultsByQuestion[index] = result;
      }
    });

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test Results</h3>
        <div className="grid gap-3">
          {resultsByQuestion.map((result, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-md flex items-center justify-between ${
                result?.isCorrect
                  ? "bg-green-100 dark:bg-green-900/20"
                  : "bg-red-100 dark:bg-red-900/20"
              }`}
            >
              <div>
                <p className="font-medium">
                  Question {idx + 1}: {images[idx].title}
                </p>
                <p className="text-sm text-muted-foreground">
                  {images[idx].pieceCount} pieces
                </p>
              </div>
              <div className="text-right">
                {result ? (
                  <>
                    <div className="flex items-center gap-2">
                      {result.isCorrect ? (
                        <Badge variant="success" className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" /> Solved
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <X className="h-3 w-3 mr-1" /> Unsolved
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm">Time: {result.timeTaken}s</p>
                    <p className="text-sm">
                      Score: {result.isCorrect ? 10 : 0}
                    </p>
                  </>
                ) : (
                  <Badge variant="outline">Not attempted</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="pt-4 border-t mt-4">
          <div className="flex justify-between items-center">
            <p className="font-medium">Total Score:</p>
            <p className="text-xl font-bold">{totalScore} / 50</p>
          </div>
          <div className="mt-2 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setImageIndex(0);
                setShowResults(false);
              }}
            >
              Restart Test
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const currentImage = images[imageIndex];
  const imageSrc = imgError ? currentImage.fallbackSrc : currentImage.src;
  const progress = (imageIndex / images.length) * 100;

  // Determine if Next button should be enabled
  const isNextEnabled =
    solved ||
    results.some((r) => r.imageId === currentImage.id) ||
    imageIndex < results.length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <Toaster />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Picture Construction Test</h1>
          <p className="text-muted-foreground">
            Bhatia Battery of Performance Tests of Intelligence
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInstructions(true)}
          >
            <Info className="h-4 w-4 mr-1" /> Instructions
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResults(true)}
            disabled={results.length === 0}
          >
            <Award className="h-4 w-4 mr-1" /> Results
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfirmReset(true)}
            disabled={results.length === 0}
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mb-6 space-y-1">
        <div className="flex justify-between text-sm">
          <span>
            Question {imageIndex + 1} of {images.length}
          </span>
          <span>{Math.floor(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main content */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Puzzle section */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Question {imageIndex + 1}: {currentImage.pieceCount} Pieces
              </CardTitle>
              {gameActive && (
                <Badge
                  variant={timeLeft < 30 ? "destructive" : "outline"}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {timeLeft}s
                </Badge>
              )}
            </div>
            {gameActive && (
              <Timer
                timeLimit={currentImage.timeLimit}
                timeLeft={timeLeft}
                isActive={gameActive}
              />
            )}
          </CardHeader>

          <CardContent className="flex justify-center">
            <div
              className="relative border-2 border-primary rounded-lg overflow-hidden"
              style={{
                width: "min(100%, 400px)",
                height: "min(100vw, 400px)",
              }}
              ref={puzzleRef}
              tabIndex={isKeyboardMode ? 0 : -1}
              aria-label="Puzzle grid"
              role="grid"
            >
              <div
                className="grid gap-1 bg-gray-100 dark:bg-gray-800 h-full w-full"
                style={{
                  gridTemplateColumns: `repeat(${currentImage.grid.cols}, 1fr)`,
                  gridTemplateRows: `repeat(${currentImage.grid.rows}, 1fr)`,
                }}
              >
                {puzzle.map((piece, index) => (
                  <motion.div
                    key={index}
                    className={`relative 
                      ${piece === null ? "invisible" : "cursor-pointer"} 
                      ${
                        isKeyboardMode && index === selectedPieceIndex
                          ? "ring-2 ring-blue-500"
                          : ""
                      } 
                      ${
                        isKeyboardMode &&
                        selectedPieceIndex === null &&
                        isValidMove(
                          index,
                          puzzle.indexOf(null),
                          currentImage.grid
                        )
                          ? "ring-2 ring-green-500"
                          : ""
                      }
                    `}
                    onClick={() => movePiece(index)}
                    layout
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    whileHover={{
                      scale: !gameActive || piece === null ? 1 : 1.05,
                    }}
                    role="gridcell"
                    aria-label={
                      piece ? `Piece ${piece}` : "Empty space"
                    }
                    aria-disabled={
                      !gameActive ||
                      !isValidMove(
                        index,
                        puzzle.indexOf(null),
                        currentImage.grid
                      )
                    }
                  >
                    {piece !== null && (
                      <div className="w-full h-full relative overflow-hidden border border-gray-300 rounded-sm">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${imageSrc})`,
                            backgroundSize: `${
                              currentImage.grid.cols * 100
                            }% ${currentImage.grid.rows * 100}%`,
                            backgroundPosition: `${
                              (((piece - 1) % currentImage.grid.cols) /
                                (currentImage.grid.cols - 1)) *
                              100
                            }% ${
                              (Math.floor(
                                (piece - 1) / currentImage.grid.cols
                              ) /
                                (currentImage.grid.rows - 1)) *
                              100
                            }%`,
                          }}
                        />
                        {!gameActive && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white font-bold text-lg">
                            {piece}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button onClick={startGame} disabled={gameActive}>
                {solved ? "Play Again" : "Start Game"}
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleKeyboardMode}
                      disabled={!gameActive}
                    >
                      <kbd className="font-mono font-medium">
                        {isKeyboardMode ? "⌨️" : "⌨"}
                      </kbd>
                      <span className="sr-only">
                        {isKeyboardMode ? "Disable" : "Enable"} keyboard navigation
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isKeyboardMode ? "Disable" : "Enable"} keyboard navigation
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button
              onClick={nextQuestion}
              disabled={gameActive || !isNextEnabled}
              variant="outline"
            >
              {imageIndex + 1 < images.length ? (
                <>
                  Next Image <ArrowRight className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Finish Test <Check className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Reference image section */}
        <Card className="w-full lg:w-1/2">
          <CardHeader>
            <CardTitle>Reference Image: {currentImage.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div
              className="relative border-2 border-primary rounded-lg overflow-hidden"
              style={{ width: "min(100%, 400px)", height: "min(100vw, 400px)" }}
            >
              <Image
                src={imageSrc || "/api/placeholder/400/400"}
                alt={`Complete reference image of ${currentImage.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
                priority
                onError={handleImageError}
              />
            </div>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Difficulty Level</p>
                  <div className="flex mt-1">
                    {Array.from({ length: Math.ceil(currentImage.pieceCount / 2) }).map(
                      (_, i) => (
                        <span
                          key={i}
                          className={`w-2 h-2 mr-1 rounded-full ${
                            i < Math.ceil(imageIndex / 1)
                              ? "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="font-medium">{totalScore} / 50</p>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                  disabled={imageIndex === 0 || gameActive}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setImageIndex((i) => Math.min(images.length - 1, i + 1))
                  }
                  disabled={imageIndex === images.length - 1 || gameActive}
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Instructions Dialog */}
      <Dialog open={showInstructions} onOpenChange={setShowInstructions}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to Play</DialogTitle>
            <DialogDescription>
              Instructions for the Picture Construction Test
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <p>
              The Picture Construction Test is part of the Bhatia Battery of
              Performance Tests of Intelligence. Your goal is to arrange puzzle
              pieces to match the reference image within the time limit.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Start the Game:</strong> Click the "Start Game" button to
                shuffle the puzzle pieces and begin.
              </li>
              <li>
                <strong>Move Pieces:</strong> Click on a puzzle piece adjacent to
                the empty space to move it into that space. Alternatively, enable
                keyboard mode (⌨ button) and use arrow keys to move pieces.
              </li>
              <li>
                <strong>Time Limit:</strong> Each puzzle has a specific time limit.
                The timer starts when you begin the game. If time runs out, the
                game ends, and the puzzle is marked as unsolved.
              </li>
              <li>
                <strong>Solving the Puzzle:</strong> Arrange the pieces to match
                the reference image exactly. The puzzle is solved when all pieces
                are in their correct positions.
              </li>
              <li>
                <strong>Scoring:</strong> You earn 10 points for each correctly
                solved puzzle, with a maximum score of 50 points for all 5
                puzzles.
              </li>
              <li>
                <strong>Navigation:</strong> Use the "Next" and "Previous" buttons
                to move between puzzles. You can only proceed to the next puzzle
                if the current one is solved or has been attempted.
              </li>
              <li>
                <strong>Results:</strong> View your results at any time by
                clicking the "Results" button. Results are saved automatically.
              </li>
              <li>
                <strong>Reset:</strong> To start over, click the "Reset" button to
                clear all progress.
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button
              variant="default"
              onClick={() => setShowInstructions(false)}
            >
              Got It!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Your Results</DialogTitle>
            <DialogDescription>
              Summary of your performance in the Picture Construction Test
            </DialogDescription>
          </DialogHeader>
          {renderResultSummary()}
        </DialogContent>
      </Dialog>

      {/* Confirm Reset Dialog */}
      <AlertDialog
        open={showConfirmReset}
        onOpenChange={setShowConfirmReset}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset All Progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your results and scores. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={resetAllData}
              className="bg-destructive text-destructive-foreground"
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}