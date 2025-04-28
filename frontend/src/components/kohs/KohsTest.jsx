'use client';
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import PatternDisplay from './PatternDisplay';
import InteractiveGrid from './InteractiveGrid';
import BlockPalette from './BlockPalette';
import HelpDialog from './HelpDialog';
import { PATTERNS } from './constant';
import { rotateBlock, compareGrids, calculateScore, createEmptyGrid } from './testLogic';

// Interfaces for score and test data contracts
const KohsScore = {
  questionId: Number,
  isCorrect: Boolean,
  responseTime: Number,
};

const KohsTestData = {
  gameName: String,
  totalScore: Number,
  totalTimeTaken: Number,
  questions: Array,
};

const KohTest = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [userId] = useState(() => crypto.randomUUID());
  const [scores, setScores] = useState([]);
  const [showReportCard, setShowReportCard] = useState(false);
  const currentPattern = PATTERNS[currentPatternIndex] || { grid: [], id: 0 };

  const [userGrid, setUserGrid] = useState(() => {
    const rows = currentPattern.grid.length || 4;
    const cols = currentPattern.grid[0]?.length || 4;
    return createEmptyGrid(rows, cols);
  });

  const [selectedCell, setSelectedCell] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef(null);
  const [showHelp, setShowHelp] = useState(false);

  // Initialize or clear localStorage when the component mounts
  useEffect(() => {
    const initialData = {
      gameName: 'KohsTest',
      totalScore: 0,
      totalTimeTaken: 0,
      questions: [],
    };
    localStorage.setItem('KohsTest', JSON.stringify(initialData));
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    if (isStarted) {
      startTimer();
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isStarted]);

  useEffect(() => {
    if (isStarted) {
      const rows = currentPattern.grid.length || 4;
      const cols = currentPattern.grid[0]?.length || 4;
      setUserGrid(createEmptyGrid(rows, cols));
      setSelectedCell(null);
      startTimer();
    }
  }, [currentPatternIndex, isStarted]);

  const startTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    const now = Date.now();
    setStartTime(now);
    setTimeElapsed(0);
    timerRef.current = window.setInterval(() => {
      if (startTime !== null) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setTimeElapsed(elapsed);
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const saveScoreToLocalStorage = (scoreData) => {
    try {
      const requiredFields = ['questionId', 'isCorrect', 'responseTime'];
      const isValid = requiredFields.every((field) => field in scoreData && scoreData[field] !== undefined);
      if (!isValid) {
        throw new Error('Invalid score data');
      }

      const existingData = localStorage.getItem('KohsTest');
      let testData = existingData
        ? JSON.parse(existingData)
        : {
            gameName: 'KohsTest',
            totalScore: 0,
            totalTimeTaken: 0,
            questions: [],
          };

      // Add or update question score
      const questionIndex = testData.questions.findIndex((q) => q.questionId === scoreData.questionId);
      if (questionIndex >= 0) {
        testData.questions[questionIndex] = scoreData;
      } else {
        testData.questions.push(scoreData);
      }

      // Update totals
      testData.totalScore = testData.questions.reduce((sum, q) => sum + (q.isCorrect ? 1 : 0), 0);
      testData.totalTimeTaken = testData.questions.reduce((sum, q) => sum + q.responseTime, 0);

      localStorage.setItem('KohsTest', JSON.stringify(testData));
      toast.success('Score saved successfully');
    } catch (error) {
      console.error('Error saving score to localStorage:', error);
      toast.error('Failed to save score');
    }
  };

  const handleBlockPlace = (rowIdx, colIdx, blockType) => {
    if (rowIdx < 0 || colIdx < 0 || !blockType) return;
    setUserGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[rowIdx] = [...newGrid[rowIdx]];
      newGrid[rowIdx][colIdx] = blockType;
      return newGrid;
    });
    if (startTime === null) {
      startTimer();
    }
    setSelectedCell({ row: rowIdx, col: colIdx });
  };

  const handleBlockClick = (rowIdx, colIdx) => {
    if (userGrid[rowIdx]?.[colIdx] !== null) {
      setSelectedCell({ row: rowIdx, col: colIdx });
    }
  };

  const handleRotate = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const blockType = userGrid[row]?.[col];
      if (blockType) {
        const rotatedType = rotateBlock(blockType);
        setUserGrid((prevGrid) => {
          const newGrid = [...prevGrid];
          newGrid[row] = [...newGrid[row]];
          newGrid[row][col] = rotatedType;
          return newGrid;
        });
        toast.info('Block rotated');
      }
    } else {
      toast.warning('Select a block to rotate');
    }
  };

  const handleReset = () => {
    const rows = currentPattern.grid.length || 4;
    const cols = currentPattern.grid[0]?.length || 4;
    setUserGrid(createEmptyGrid(rows, cols));
    setSelectedCell(null);
    startTimer();
    toast.info('Grid reset');
  };

  const isGridEmpty = () => {
    return userGrid.every((row) => row.every((cell) => cell === null));
  };

  const handleSubmit = () => {
    if (isGridEmpty()) {
      toast.warning('Please place at least one block before submitting');
      return;
    }

    stopTimer();
    const responseTime = timeElapsed;
    const isCorrect = compareGrids(userGrid, currentPattern.grid);

    const scoreData = {
      questionId: currentPattern.id || currentPatternIndex + 1,
      isCorrect: isCorrect,
      responseTime: responseTime,
    };

    setScores((prevScores) => {
      const updatedScores = [...prevScores.filter((s) => s.questionId !== scoreData.questionId), scoreData];
      return updatedScores;
    });
    saveScoreToLocalStorage(scoreData);
    toast.info(isCorrect ? 'Correct pattern!' : 'Incorrect pattern');
  };

  const handleNextPattern = () => {
    // Save default score if not submitted
    if (!scores.find((score) => score.questionId === (currentPattern.id || currentPatternIndex + 1))) {
      const defaultScoreData = {
        questionId: currentPattern.id || currentPatternIndex + 1,
        isCorrect: false,
        responseTime: 0,
      };
      setScores((prevScores) => [...prevScores, defaultScoreData]);
      saveScoreToLocalStorage(defaultScoreData);
      toast.info('Question skipped, saved with default score');
    }

    stopTimer();
    if (currentPatternIndex < PATTERNS.length - 1) {
      setCurrentPatternIndex(currentPatternIndex + 1);
      setUserGrid(
        createEmptyGrid(
          PATTERNS[currentPatternIndex + 1].grid.length || 4,
          PATTERNS[currentPatternIndex + 1].grid[0]?.length || 4
        )
      );
      setSelectedCell(null);
      startTimer();
    } else {
      // Ensure all questions have a score before showing report card
      PATTERNS.forEach((_, index) => {
        const questionId = index + 1;
        if (!scores.find((score) => score.questionId === questionId)) {
          const defaultScoreData = {
            questionId: questionId,
            isCorrect: false,
            responseTime: 0,
          };
          setScores((prevScores) => [...prevScores, defaultScoreData]);
          saveScoreToLocalStorage(defaultScoreData);
        }
      });
      setShowReportCard(true);
    }
  };

  const handleStartGame = () => {
    // Clear existing KohsTest key if it exists
    localStorage.removeItem('KohsTest');
    // Re-initialize localStorage
    const initialData = {
      gameName: 'KohsTest',
      totalScore: 0,
      totalTimeTaken: 0,
      questions: [],
    };
    localStorage.setItem('KohsTest', JSON.stringify(initialData));
    setIsStarted(true);
    setScores([]);
    setCurrentPatternIndex(0);
    startTimer();
  };

  const ReportCard = () => {
    const testData = JSON.parse(localStorage.getItem('KohsTest') || '{}');
    const questions = testData.questions || [];
    const { totalScore, totalTimeTaken } = testData;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Kohs Test Report Card</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Overall Results</h3>
            <p>Total Score: {totalScore || 0}</p>
            <p>Total Time: {(totalTimeTaken || 0).toFixed(2)} seconds</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Pattern Results</h3>
            {questions.length ? (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Pattern ID</th>
                    <th className="p-2">Correct</th>
                    <th className="p-2">Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td className="p-2">{question.questionId}</td>
                      <td className="p-2">{question.isCorrect ? 'Yes' : 'No'}</td>
                      <td className="p-2">{question.responseTime.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No scores recorded.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Controls Component
  const Controls = ({ onRotate, onReset, onSubmit, onNext, onHelp, isGridEmpty, className }) => {
    return (
      <div className={`flex justify-center gap-4 ${className}`}>
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={onRotate}>
          Rotate Block
        </button>
        <button className="bg-red-600 text-white p-2 rounded hover:bg-red-700" onClick={onReset}>
          Reset Grid
        </button>
        <button
          className={`bg-green-600 text-white p-2 rounded hover:bg-green-700 ${isGridEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={onSubmit}
          disabled={isGridEmpty}
        >
          Submit
        </button>
        <button className="bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700" onClick={onNext}>
          Next
        </button>
        <button className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700" onClick={onHelp}>
          Help
        </button>
      </div>
    );
  };

  if (!isStarted) {
    return (
      <div className="flex flex-col items-center max-w-4xl w-full mx-auto">
        <h2 className="text-2xl font-bold mb-4">Kohs Block Design Test</h2>
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700" onClick={handleStartGame}>
          Start Test
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-4xl w-full mx-auto">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">Time: {timeElapsed} seconds</div>
      <PatternDisplay pattern={currentPattern} className="mb-6" />
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md w-full">
        <h3 className="text-sm font-medium text-center mb-3">Block Palette</h3>
        <BlockPalette />
      </div>
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md w-full">
        <h3 className="text-sm font-medium text-center mb-3">Your Design</h3>
        <div className="flex justify-center">
          <InteractiveGrid grid={userGrid} onBlockPlace={handleBlockPlace} onBlockClick={handleBlockClick} />
        </div>
      </div>
      <Controls
        onRotate={handleRotate}
        onReset={handleReset}
        onSubmit={handleSubmit}
        onNext={handleNextPattern}
        onHelp={() => setShowHelp(true)}
        isGridEmpty={isGridEmpty()}
        className="mb-4"
      />
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />
      {showReportCard && <ReportCard />}
    </div>
  );
};

export default KohTest;