'use client'
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import PatternDisplay from './PatternDisplay';
import InteractiveGrid from './InteractiveGrid';
import BlockPalette from './BlockPalette';
import Controls from './Controls';
import HelpDialog from './HelpDialog';
import StartDialog from './StartDialog';
import { PATTERNS } from './constant';
import { 
  rotateBlock, 
  compareGrids, 
  calculateScore, 
  createEmptyGrid 
} from './testLogic';

// Interface for score data contract (per question)
const KohsScore = {
  id: Number,
  user_response: Array,
  response_time: Number, // Time taken to solve the pattern in seconds
  timestamp: String,
  is_correct: Boolean,
  score: Number,
  accuracy: Number,
};

// Interface for localStorage data contract
const KohsTestData = {
  id: String,
  questions: Array,
  user_score: {
    total_score: Number,
    total_accuracy: Number,
    total_time_seconds: Number,
  },
};

// Stub ResultModal component (replace with actual implementation)
const ResultModal = ({ isOpen, onClose, onNextPattern, hasNextPattern }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Pattern Submitted</h2>
        <p className="mb-4">Your pattern has been submitted successfully.</p>
        <div className="flex justify-end space-x-4">
          {hasNextPattern && (
            <button
              className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              onClick={onNextPattern}
            >
              Next Pattern
            </button>
          )}
          <button
            className="bg-gray-600 text-white p-2 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
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
  const [showResults, setShowResults] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (isStarted) {
      // Initialize fresh localStorage data
      const initialData = {
        id: userId,
        questions: [],
        user_score: {
          total_score: 0,
          total_accuracy: 0,
          total_time_seconds: 0,
        },
      };
      localStorage.setItem('kohs_scores', JSON.stringify(initialData));
      startTimer();
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [isStarted, userId]);

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
      // Validate scoreData
      const requiredFields = ['id', 'user_response', 'response_time', 'timestamp', 'is_correct', 'score', 'accuracy'];
      const isValid = requiredFields.every(field => field in scoreData && scoreData[field] !== undefined);
      if (!isValid) {
        throw new Error('Invalid score data');
      }

      const existingData = localStorage.getItem('kohs_scores');
      let testData = existingData ? JSON.parse(existingData) : {
        id: userId,
        questions: [],
        user_score: {
          total_score: 0,
          total_accuracy: 0,
          total_time_seconds: 0,
        },
      };

      // Add new question score
      testData.questions.push(scoreData);

      // Update user_score
      const totalScore = testData.questions.reduce((sum, q) => sum + q.score, 0);
      const totalMaxScore = testData.questions.reduce((sum, q) => sum + q.score / (q.accuracy / 100), 0);
      const totalTimeSeconds = testData.questions.reduce((sum, q) => sum + q.response_time, 0);
      testData.user_score = {
        total_score: totalScore,
        total_accuracy: totalMaxScore ? (totalScore / totalMaxScore * 100) : 0,
        total_time_seconds: totalTimeSeconds,
      };

      localStorage.setItem('kohs_scores', JSON.stringify(testData));
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
        
        toast.info("Block rotated");
      }
    } else {
      toast.warning("Select a block to rotate");
    }
  };

  const handleReset = () => {
    const rows = currentPattern.grid.length || 4;
    const cols = currentPattern.grid[0]?.length || 4;
    setUserGrid(createEmptyGrid(rows, cols));
    setSelectedCell(null);
    startTimer();
    toast.info("Grid reset");
  };

  const isGridEmpty = () => {
    return userGrid.every(row => row.every(cell => cell === null));
  };

  const handleSubmit = () => {
    stopTimer();
    
    const responseTime = timeElapsed;
    const isCorrect = compareGrids(userGrid, currentPattern.grid);
    
    const { score, maxScore, accuracy } = calculateScore(
      userGrid,
      currentPattern.grid,
      responseTime
    );
    
    const scoreData = {
      id: currentPattern.id || 0,
      user_response: userGrid.map(row => [...row]), // Deep copy to avoid mutations
      response_time: responseTime,
      timestamp: new Date().toISOString(),
      is_correct: isCorrect,
      score: score || 0,
      accuracy: accuracy || 0,
    };
    
    setScores((prevScores) => [...prevScores, scoreData]);
    saveScoreToLocalStorage(scoreData);
    setShowResults(true);
  };

  const handleNextPattern = () => {
    if (currentPatternIndex < PATTERNS.length - 1) {
      setCurrentPatternIndex(currentPatternIndex + 1);
      setShowResults(false);
    } else {
      setShowReportCard(true);
    }
  };

  const handleStartGame = () => {
    // Clear existing kohs_scores if it exists
    localStorage.removeItem('kohs_scores');
    setIsStarted(true);
    startTimer();
  };

  const ReportCard = () => {
    const testData = JSON.parse(localStorage.getItem('kohs_scores') || '{}');
    const questions = testData.questions || [];
    const userScore = testData.user_score || {
      total_score: 0,
      total_accuracy: 0,
      total_time_seconds: 0,
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
          <h2 className="text-2xl font-bold mb-4 text-center">Kohs Test Report Card</h2>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Overall Results</h3>
            <p>Total Score: {userScore.total_score} / {questions.reduce((sum, q) => sum + q.score / (q.accuracy / 100), 0).toFixed(2)}</p>
            <p>Overall Accuracy: {userScore.total_accuracy.toFixed(2)}%</p>
            <p>Total Time: {userScore.total_time_seconds.toFixed(2)} seconds</p>
          </div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Pattern Results</h3>
            {questions.length ? (
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="p-2">Pattern ID</th>
                    <th className="p-2">Correct</th>
                    <th className="p-2">Score</th>
                    <th className="p-2">Accuracy</th>
                    <th className="p-2">Time (s)</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((question, index) => (
                    <tr key={index}>
                      <td className="p-2">{question.id}</td>
                      <td className="p-2">{question.is_correct ? 'Yes' : 'No'}</td>
                      <td className="p-2">{question.score}</td>
                      <td className="p-2">{question.accuracy}%</td>
                      <td className="p-2">{question.response_time.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No scores recorded.</p>
            )}
          </div>
          <button
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            onClick={() => {
              setShowReportCard(false);
              setIsStarted(false);
              setCurrentPatternIndex(0);
              setScores([]);
              localStorage.removeItem('kohs_scores');
            }}
          >
            Restart Test
          </button>
        </div>
      </div>
    );
  };

  if (!isStarted) {
    return <StartDialog isOpen={true} onStart={handleStartGame} />;
  }

  return (
    <div className="flex flex-col items-center max-w-4xl w-full mx-auto">
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Time: {timeElapsed} seconds
      </div>
      
      <PatternDisplay 
        pattern={currentPattern} 
        className="mb-6" 
      />
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md w-full">
        <h3 className="text-sm font-medium text-center mb-3">Block Palette</h3>
        <BlockPalette />
      </div>
      
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md w-full">
        <h3 className="text-sm font-medium text-center mb-3">Your Design</h3>
        <div className="flex justify-center">
          <InteractiveGrid 
            grid={userGrid} 
            onBlockPlace={handleBlockPlace}
            onBlockClick={handleBlockClick}
          />
        </div>
      </div>
      
      <Controls 
        onRotate={handleRotate}
        onReset={handleReset}
        onSubmit={handleSubmit}
        onHelp={() => setShowHelp(true)}
        isGridEmpty={isGridEmpty()}
        className="mb-4"
      />
      
      <ResultModal 
        isOpen={showResults}
        onClose={() => setShowResults(false)}
        onNextPattern={handleNextPattern}
        hasNextPattern={currentPatternIndex < PATTERNS.length - 1}
      />
      
      <HelpDialog 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
      
      {showReportCard && <ReportCard />}
    </div>
  );
};

export default KohTest;