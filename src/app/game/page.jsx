"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, Timer, Award, ArrowRight } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function ColorMemoryChallenge() {
  const [gameState, setGameState] = useState("start") 
    const [currentRound, setCurrentRound] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(5)
  const [grid, setGrid] = useState([])
  const [userGrid, setUserGrid] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState({})
  const [userAnswer, setUserAnswer] = useState("")
  const [selectedColor, setSelectedColor] = useState("#FF0000")
  const [gridSize, setGridSize] = useState(2) // Default 2x2
  const [questionsAttempted, setQuestionsAttempted] = useState(0)
  const [maxQuestions, setMaxQuestions] = useState(10)

  // Fixed colors as requested
  const colorOptions = [
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Pink
  ]

  const colorNames = {
    "#FF0000": "Red",
    "#00FF00": "Green",
    "#0000FF": "Blue",
    "#FFFF00": "Yellow",
    "#FF00FF": "Pink",
  }

  const questions = [
    { text: "How many RED squares were in the grid?", type: "count", color: "#FF0000" },
    { text: "How many BLUE squares were in the grid?", type: "count", color: "#0000FF" },
    { text: "How many GREEN squares were in the grid?", type: "count", color: "#00FF00" },
    { text: "How many YELLOW squares were in the grid?", type: "count", color: "#FFFF00" },
    { text: "How many PINK squares were in the grid?", type: "count", color: "#FF00FF" },
    {
      text: "What color was in the CENTER of the grid?",
      type: "position",
      position: (gridSize, grid) => Math.floor(grid.length / 2),
    },
    { text: "What color was in the TOP-LEFT corner?", type: "position", position: () => 0 },
    { text: "What color was in the TOP-RIGHT corner?", type: "position", position: (gridSize) => gridSize - 1 },
    {
      text: "What color was in the BOTTOM-LEFT corner?",
      type: "position",
      position: (gridSize, grid) => grid.length - gridSize,
    },
    {
      text: "What color was in the BOTTOM-RIGHT corner?",
      type: "position",
      position: (gridSize, grid) => grid.length - 1,
    },
  ]

  // Generate a random grid of colors
  const generateGrid = () => {
    const newGrid = []
    for (let i = 0; i < gridSize * gridSize; i++) {
      const randomIndex = Math.floor(Math.random() * colorOptions.length)
      newGrid.push(colorOptions[randomIndex])
    }
    return newGrid
  }

  // Select a random question
  const selectQuestion = (grid) => {
    // For 1x1 grid, only ask about the color
    if (gridSize === 1) {
      return {
        text: "What color was shown in the grid?",
        type: "position",
        position: 0,
        answer: grid[0],
      }
    }

    const randomIndex = Math.floor(Math.random() * questions.length)
    const question = questions[randomIndex]

    if (question.type === "count") {
      // Count how many squares match the color
      const count = grid.filter((color) => color === question.color).length
      return { ...question, answer: count.toString() }
    } else if (question.type === "position") {
      // Get the color at the specified position
      const pos = typeof question.position === "function" ? question.position(gridSize, grid) : question.position

      // Make sure position is valid for current grid size
      const validPos = Math.min(pos, grid.length - 1)
      return { ...question, answer: grid[validPos], position: validPos }
    }

    return question
  }

  // Start a new round
  const startNewRound = () => {
    const newGrid = generateGrid()
    const newQuestion = selectQuestion(newGrid)

    setGrid(newGrid)
    setUserGrid(Array(gridSize * gridSize).fill(""))
    setCurrentQuestion(newQuestion)
    setUserAnswer("")
    setTimeLeft(5)
    setGameState("memorize")

    // Start the timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setGameState("answer")
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Check the user's answer
  const checkAnswer = () => {
    // Check question answer
    let questionCorrect = false

    if (currentQuestion.type === "count") {
      questionCorrect = userAnswer === currentQuestion.answer
    } else if (currentQuestion.type === "position") {
      questionCorrect = userGrid[currentQuestion.position] === currentQuestion.answer
    }

    // Check grid recreation accuracy
    let gridCorrect = 0
    const totalCells = grid.length

    for (let i = 0; i < totalCells; i++) {
      if (userGrid[i] === grid[i]) {
        gridCorrect++
      }
    }

    const gridAccuracy = gridCorrect / totalCells

    // Calculate round score (50% for question, 50% for grid accuracy)
    const roundScore = (questionCorrect ? 0.5 : 0) + gridAccuracy * 0.5

    // Add to total score
    setScore(score + roundScore)

    // Increment questions attempted
    setQuestionsAttempted(questionsAttempted + 1)

    setGameState("feedback")
  }

  // Handle next round or end game
  const handleNext = () => {
    if (questionsAttempted < maxQuestions - 1) {
      setCurrentRound(currentRound + 1)
      startNewRound()
    } else {
      setGameState("results")
    }
  }

  // Start the game
  const startGame = () => {
    setGameState("setup")
  }

  // Setup the game with selected options
  const setupGame = () => {
    setScore(0)
    setCurrentRound(0)
    setQuestionsAttempted(0)
    startNewRound()
  }

  // Update a cell in the user's grid
  const updateUserGrid = (index) => {
    const newUserGrid = [...userGrid]
    newUserGrid[index] = selectedColor
    setUserGrid(newUserGrid)
  }

  // Calculate grid accuracy percentage
  const calculateGridAccuracy = () => {
    let correct = 0
    for (let i = 0; i < grid.length; i++) {
      if (userGrid[i] === grid[i]) {
        correct++
      }
    }
    return Math.round((correct / grid.length) * 100)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">🧠 Color Memory Challenge 🎨</h1>

          {gameState !== "start" && gameState !== "setup" && gameState !== "results" && (
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm font-medium">
                Question: {questionsAttempted + 1}/{maxQuestions}
              </div>
              <div className="text-sm font-medium">
                Score: {score.toFixed(1)}/{maxQuestions}
              </div>
              <div className="text-sm font-medium">
                Grid: {gridSize}x{gridSize}
              </div>
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {gameState === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="mb-6">
                Test your memory and attention to detail! You'll be shown a grid of colored squares. Memorize the
                colors, then recreate the entire grid AND answer a question about it. You can choose different grid
                sizes for varying difficulty!
              </p>
              <Button onClick={startGame} className="w-full">
                Start Game
              </Button>
            </motion.div>
          )}

          {gameState === "setup" && (
            <motion.div
              key="setup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold mb-4">Game Setup</h2>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Select Grid Size:</h3>
                <RadioGroup
                  value={gridSize.toString()}
                  onValueChange={(value) => setGridSize(Number.parseInt(value))}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="grid-1" />
                    <Label htmlFor="grid-1">1x1 (Easy)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="grid-2" />
                    <Label htmlFor="grid-2">2x2 (Medium)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="grid-3" />
                    <Label htmlFor="grid-3">3x3 (Hard)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="grid-4" />
                    <Label htmlFor="grid-4">4x4 (Expert)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Available Colors:</h3>
                <div className="flex justify-center gap-2 flex-wrap">
                  {colorOptions.map((color) => (
                    <div key={color} className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-md border" style={{ backgroundColor: color }} />
                      <span className="text-xs mt-1">{colorNames[color]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={setupGame} className="w-full">
                Start Challenge
              </Button>
            </motion.div>
          )}

          {gameState === "memorize" && (
            <motion.div
              key="memorize"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Memorize the colors!</h2>
                <p className="text-sm mb-4">You'll need to recreate this grid AND answer: {currentQuestion.text}</p>

                <div className="flex items-center gap-2 mb-2">
                  <Timer className="h-4 w-4" />
                  <span className="text-sm font-medium">{timeLeft} seconds</span>
                </div>
                <Progress value={(timeLeft / 5) * 100} className="h-2 mb-4" />
              </div>

              <div
                className="grid gap-2 mb-6 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  maxWidth: `${gridSize * 60}px`,
                }}
              >
                {grid.map((color, index) => (
                  <div key={index} className="aspect-square rounded-md" style={{ backgroundColor: color }} />
                ))}
              </div>
            </motion.div>
          )}

          {gameState === "answer" && (
            <motion.div
              key="answer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold mb-2">Recreate the grid</h2>
              <p className="text-sm mb-4">And answer: {currentQuestion.text}</p>

              {/* Color Selection */}
              <div className="mb-6 p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Select a color:</h3>
                <div className="flex justify-center gap-3 flex-wrap">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className={`flex flex-col items-center ${selectedColor === color ? "scale-110" : ""}`}
                      onClick={() => setSelectedColor(color)}
                    >
                      <div
                        className={`w-10 h-10 rounded-md border-2 transition-all ${selectedColor === color ? "border-primary" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-xs mt-1">{colorNames[color]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* User Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Recreate the grid:</h3>
                <div
                  className="grid gap-2 mb-6 mx-auto"
                  style={{
                    gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                    maxWidth: `${gridSize * 60}px`,
                  }}
                >
                  {userGrid.map((color, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-md border border-gray-300 cursor-pointer"
                      style={{ backgroundColor: color || "transparent" }}
                      onClick={() => updateUserGrid(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Question Answer */}
              {currentQuestion.type === "count" && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Answer the question:</h3>
                  <input
                    type="number"
                    min="0"
                    max="16"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    className="w-full p-2 border rounded-md text-center text-lg"
                    placeholder="Enter number"
                  />
                </div>
              )}

              <Button onClick={checkAnswer} className="w-full">
                Submit Answer
              </Button>
            </motion.div>
          )}

          {gameState === "feedback" && (
            <motion.div
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold mb-4">Round Results</h2>

              {/* Question Feedback */}
              <div className="mb-4 p-3 border rounded-md">
                <h3 className="font-medium mb-2">Question:</h3>
                <p className="text-sm mb-2">{currentQuestion.text}</p>

                {currentQuestion.type === "count" && (
                  <div className="flex items-center justify-center gap-2">
                    {userAnswer === currentQuestion.answer ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                    <span className="text-sm">
                      Your answer: {userAnswer} | Correct: {currentQuestion.answer}
                    </span>
                  </div>
                )}

                {currentQuestion.type === "position" && (
                  <div className="flex items-center justify-center gap-2">
                    {userGrid[currentQuestion.position] === currentQuestion.answer ? (
                      <CheckCircle className="text-green-500 h-5 w-5" />
                    ) : (
                      <XCircle className="text-red-500 h-5 w-5" />
                    )}
                    <span className="text-sm">
                      {userGrid[currentQuestion.position] === currentQuestion.answer
                        ? "Correct!"
                        : `Incorrect! The correct color was ${colorNames[currentQuestion.answer]}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Grid Accuracy */}
              <div className="mb-4 p-3 border rounded-md">
                <h3 className="font-medium mb-2">Grid Accuracy: {calculateGridAccuracy()}%</h3>

                <div className="flex gap-4 justify-center">
                  <div>
                    <h4 className="text-sm font-medium mb-1">Original:</h4>
                    <div
                      className="grid gap-1 mx-auto"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        maxWidth: `${gridSize * 40}px`,
                      }}
                    >
                      {grid.map((color, index) => (
                        <div key={index} className="aspect-square rounded-sm" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="h-5 w-5 self-center" />

                  <div>
                    <h4 className="text-sm font-medium mb-1">Your Grid:</h4>
                    <div
                      className="grid gap-1 mx-auto"
                      style={{
                        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                        maxWidth: `${gridSize * 40}px`,
                      }}
                    >
                      {userGrid.map((color, index) => (
                        <div
                          key={index}
                          className="aspect-square rounded-sm"
                          style={{ backgroundColor: color || "transparent" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full">
                {questionsAttempted < maxQuestions - 1 ? "Next Question" : "See Results"}
              </Button>
            </motion.div>
          )}

          {gameState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <Award className="h-16 w-16 text-yellow-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
              <p className="text-xl mb-6">
                Your final score: {score.toFixed(1)}/{maxQuestions}
              </p>

              <div className="mb-6">
                {score >= maxQuestions * 0.9 && (
                  <p className="font-medium text-green-500">Amazing! You have an exceptional memory!</p>
                )}
                {score >= maxQuestions * 0.7 && score < maxQuestions * 0.9 && (
                  <p className="font-medium text-blue-500">Great job! Your memory is quite good!</p>
                )}
                {score >= maxQuestions * 0.5 && score < maxQuestions * 0.7 && (
                  <p className="font-medium text-amber-500">Good effort! Keep practicing!</p>
                )}
                {score < maxQuestions * 0.5 && (
                  <p className="font-medium text-orange-500">Keep practicing to improve your memory!</p>
                )}
              </div>

              <Button onClick={startGame} className="w-full">
                Play Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  )
}

