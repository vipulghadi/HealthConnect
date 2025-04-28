'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Timer } from '@/components/client/common/timer';
import toast, { Toaster } from 'react-hot-toast';
import { Progress } from '@/components/ui/progress';

const images = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
    name: 'Book',
    difficulty: 'easy',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d',
    name: 'City',
    difficulty: 'easy',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d',
    name: 'Forest',
    difficulty: 'medium',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
    name: 'Mountain',
    difficulty: 'hard',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1429087969512-1e85aab2683d',
    name: 'Beach',
    difficulty: 'hard',
  },
];

const GRID_SIZES = [2, 3, 3, 4, 4]; // Grid sizes for levels 1-5
const TIME_LIMITS = [60, 90, 120, 180, 240]; // Time limits for levels 1-5

function PictureConstructionTest() {
  const [level, setLevel] = useState(0);
  const [gridSize, setGridSize] = useState(GRID_SIZES[0]);
  const [puzzle, setPuzzle] = useState([]);
  const [solved, setSolved] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [pendingScore, setPendingScore] = useState(null); // Store score until Next is clicked

  // Initialize localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Clear existing key if it exists
      localStorage.removeItem('PictureConstructionTest');
      // Initialize with default data
      const initialData = {
        gameName: 'Picture Construction Test',
        totalScore: 0,
        totalTimeTaken: 0,
        questions: [],
      };
      localStorage.setItem('PictureConstructionTest', JSON.stringify(initialData));
      setTotalScore(0);
    }
  }, []);

  // Load score and responses from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('PictureConstructionTest');
      if (savedData) {
        try {
          const testData = JSON.parse(savedData);
          setTotalScore(testData.totalScore || 0);
          // Optionally, load current level's score if resuming
          const currentLevelResponse = testData.questions.find(
            (q) => q.questionId === level + 1
          );
          if (currentLevelResponse) {
            setCurrentScore(currentLevelResponse.score || 0);
          } else {
            setCurrentScore(0);
          }
        } catch (error) {
          console.error('Error reading localStorage:', error);
        }
      }
    }
  }, [level]);

  // Initialize puzzle when level changes
  useEffect(() => {
    setGridSize(GRID_SIZES[level]);

    if (gameActive) return;

    const totalPieces = GRID_SIZES[level] * GRID_SIZES[level];
    const pieces = Array.from({ length: totalPieces - 1 }, (_, i) => i + 1);
    pieces.push(null);

    const shuffled = shuffle([...pieces]);
    setPuzzle(shuffled);
    setSolved(false);
    setCurrentScore(0);
    setProgress(0);
    setPendingScore(null);
  }, [level, gameActive]);

  // Check if puzzle is solved
  useEffect(() => {
    if (!gameActive) return;

    const isPuzzleSolved = checkSolved(puzzle);
    if (isPuzzleSolved) {
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const score = calculateScore(elapsedTime);
      setCurrentScore(score);
      setPendingScore({
        questionId: level + 1,
        isCorrect: true,
        responseTime: elapsedTime,
        score: score,
      });

      setGameActive(false);
      setSolved(true);

      toast.success(
        `Level ${level + 1} completed! You earned ${score} points.`,
        {
          position: 'top-center',
        }
      );
    } else {
      // Update progress
      const correctPieces = puzzle.filter((p, i) => p === i + 1).length;
      const totalPieces = puzzle.length - 1;
      setProgress(Math.floor((correctPieces / totalPieces) * 100));
    }
  }, [puzzle, gameActive]);

  // Time management
  useEffect(() => {
    if (gameActive) {
      setTimeLeft(TIME_LIMITS[level]);
      setStartTime(Date.now());

      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setGameActive(false);
            setPendingScore({
              questionId: level + 1,
              isCorrect: false,
              responseTime: TIME_LIMITS[level],
              score: 0,
            });
            toast.error("Time's up! Try again!", {
              position: 'top-center',
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [gameActive, level]);

  // Save score to localStorage
  const saveScore = (scoreData) => {
    if (typeof window !== 'undefined') {
      try {
        const savedData = localStorage.getItem('PictureConstructionTest');
        let testData = savedData
          ? JSON.parse(savedData)
          : {
              gameName: 'Picture Construction Test',
              totalScore: 0,
              totalTimeTaken: 0,
              questions: [],
            };

        const existingIndex = testData.questions.findIndex(
          (q) => q.questionId === scoreData.questionId
        );
        if (existingIndex !== -1) {
          testData.questions[existingIndex] = scoreData;
        } else {
          testData.questions.push(scoreData);
        }

        testData.totalScore = testData.questions.reduce((sum, q) => sum + q.score, 0);
        testData.totalTimeTaken = testData.questions.reduce(
          (sum, q) => sum + q.responseTime,
          0
        );

        localStorage.setItem('PictureConstructionTest', JSON.stringify(testData));
        setTotalScore(testData.totalScore);
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        toast.error('Failed to save score');
      }
    }
  };

  const calculateScore = (elapsedSeconds) => {
    const timeLimit = TIME_LIMITS[level];
    const timePercentage = 1 - elapsedSeconds / timeLimit;

    // Base score based on level (higher levels give more points)
    const baseScore = (level + 1) * 5;

    // Score is baseScore multiplied by time percentage (faster completion = higher score)
    const score = Math.max(1, Math.floor(baseScore * timePercentage));

    return score;
  };

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
    setCurrentScore(0);
    setProgress(0);
    setPendingScore(null);

    toast(`Level ${level + 1} started!`, {
      position: 'top-center',
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

  const handleNextLevel = () => {
    if (pendingScore) {
      saveScore(pendingScore);
      setPendingScore(null);
    } else if (solved) {
      // If puzzle was solved but no pending score (edge case), save a default score
      const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
      const score = calculateScore(elapsedTime);
      const scoreData = {
        questionId: level + 1,
        isCorrect: true,
        responseTime: elapsedTime,
        score: score,
      };
      saveScore(scoreData);
    }

    if (level < images.length - 1) {
      setLevel((prev) => prev + 1);
      setGameActive(false);
      setSolved(false);
    } else {
      // Optionally, reset to level 0 or show a completion screen
      setLevel(0);
      setGameActive(false);
      setSolved(false);
      toast.success('All levels completed! Starting over.', {
        position: 'top-center',
      });
    }
  };

  const resetGame = () => {
    setLevel(0);
    setTotalScore(0);
    setCurrentScore(0);
    setGameActive(false);
    setSolved(false);
    setPendingScore(null);
    localStorage.removeItem('PictureConstructionTest');
    // Re-initialize localStorage
    const initialData = {
      gameName: 'Picture Construction Test',
      totalScore: 0,
      totalTimeTaken: 0,
      questions: [],
    };
    localStorage.setItem('PictureConstructionTest', JSON.stringify(initialData));
    toast.success('Game reset successfully!', {
      position: 'top-center',
    });
  };

  return (
    <div className="flex flex-col min-h-screen p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <Toaster />

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center flex-grow">
        {/* Target Image on Left */}
        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold text-center mb-2">
              Level {level + 1}: {images[level].name}
            </h2>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-4 border-primary">
              <Image
                src={images[level].src}
                alt="Complete puzzle reference"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Difficulty: {images[level].difficulty}
              </p>
              <p className="text-sm text-gray-600">
                Grid: {gridSize}x{gridSize}
              </p>
            </div>
          </div>
        </div>

        {/* Game Board on Right */}
        <div className="w-full lg:w-2/3 flex flex-col items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-2xl font-bold">Puzzle Game</h1>
                <p className="text-sm text-gray-600">
                  Complete the puzzle to advance to the next level!
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">
                  Score: <span className="text-primary">{totalScore}</span>
                </div>
                {gameActive && (
                  <Timer timeLeft={timeLeft} totalTime={TIME_LIMITS[level]} />
                )}
              </div>
            </div>

            <div className="mb-4">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Progress: {progress}%</span>
                {gameActive && <span>Time left: {timeLeft}s</span>}
              </div>
            </div>

            <div
              className="relative mx-auto bg-gray-100 rounded-lg overflow-hidden"
              style={{
                width: '100%',
                aspectRatio: '1/1',
                maxWidth: '500px',
              }}
            >
              <div
                className="grid h-full w-full gap-1"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`,
                }}
              >
                {puzzle.map((piece, index) => (
                  <motion.div
                    key={index}
                    className={`relative ${
                      piece === null ? 'invisible' : 'cursor-pointer'
                    }`}
                    onClick={() => movePiece(index)}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    whileHover={{
                      scale: !gameActive || piece === null ? 1 : 1.05,
                    }}
                  >
                    {piece !== null && (
                      <div className="w-full h-full relative overflow-hidden border border-gray-300 rounded-sm">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: `url(${images[level].src})`,
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
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 font-bold text-white bg-repeat:no-repeat">
                            {piece}
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-center gap-4">
              <Button
                onClick={startGame}
                disabled={gameActive && !solved}
                className="px-6 py-3"
              >
                {solved ? 'Restart Level' : 'Start Game'}
              </Button>
              {solved && (
                <Button
                  onClick={handleNextLevel}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700"
                >
                  {level < images.length - 1 ? 'Next Level' : 'Play Again'}
                </Button>
              )}
              <Button
                onClick={resetGame}
                variant="outline"
                className="px-6 py-3"
              >
                Reset Game
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Score and Level Progress at Bottom */}
      <div className="mt-8 bg-white p-4 rounded-xl shadow-lg max-w-4xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold">Current Level Progress</h3>
            <div className="flex items-center gap-2">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    idx <= level
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Total Score</h3>
            <div className="text-3xl font-bold text-primary">{totalScore}</div>
          </div>
          <div className="text-center sm:text-right">
            <h3 className="font-semibold">Level {level + 1} Score</h3>
            <div className="text-2xl font-bold text-blue-600">
              +{currentScore}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PictureConstructionTest;