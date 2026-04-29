import { useState, useEffect, useRef } from "react"
import useGameScale from "../../../hooks/useGameScale"

const BASE_SIZE = 390

export default function Game2({ onExit, onWin }) {
  const rawScale = useGameScale(BASE_SIZE, BASE_SIZE)
  const scale = Math.min(rawScale * 0.9, 1)

  const [level, setLevel] = useState(1)
  const [gridSize, setGridSize] = useState(3)
  const [pattern, setPattern] = useState([])
  const [playerSequence, setPlayerSequence] = useState([])

  const [lives, setLives] = useState(3)
  const [timeLeft, setTimeLeft] = useState(10)
  const [score, setScore] = useState(0)

  const [activeClick, setActiveClick] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const [currentStep, setCurrentStep] = useState(-1)
  const [isShowingPattern, setIsShowingPattern] = useState(false)

  const lastInputRef = useRef(null)

  const getGridSize = (level) => Math.min(3 + Math.floor(level / 2), 8)

  const getPatternLength = (level, gridSize) =>
    Math.min(2 + level, gridSize * 2)

  const generatePattern = (size, length) => {
    return Array.from({ length }, () => ({
      x: Math.floor(Math.random() * size),
      y: Math.floor(Math.random() * size)
    }))
  }

  const playPattern = (pattern, level) => {
    setIsShowingPattern(true)
    setCurrentStep(-1)

    const speed = Math.max(600 - level * 30, 220)

    pattern.forEach((_, index) => {
      setTimeout(() => {
        setCurrentStep(index)

        setTimeout(() => {
          setCurrentStep(-1)
        }, speed / 2)
      }, index * speed)
    })

    setTimeout(() => {
      setIsShowingPattern(false)
      setCurrentStep(-1)
    }, pattern.length * speed)
  }

  useEffect(() => {
    const size = getGridSize(level)
    const length = getPatternLength(level, size)

    const newPattern = generatePattern(size, length)

    setGridSize(size)
    setPattern(newPattern)
    setPlayerSequence([])
    setTimeLeft(10)

    playPattern(newPattern, level)
  }, [level])

  useEffect(() => {
    if (isShowingPattern) return
    if (timeLeft <= 0) {
      handleFail()
      return
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, isShowingPattern])

  const handleFail = () => {
    setLives((prev) => {
      const newLives = prev - 1

      if (newLives <= 0) {
        onWin("game2", score)
        onExit()
      } else {
        setPlayerSequence([])
        setTimeLeft(10)
        playPattern(pattern, level)
      }

      return newLives
    })
  }

  const handleInput = (x, y) => {
    if (isShowingPattern) return

    const key = `${x}-${y}`
    const now = Date.now()

    if (
      lastInputRef.current &&
      lastInputRef.current.key === key &&
      now - lastInputRef.current.time < 120
    ) {
      return
    }

    lastInputRef.current = { key, time: now }

    setActiveClick(key)
    setTimeout(() => setActiveClick(null), 140)

    const newSequence = [...playerSequence, { x, y }]
    setPlayerSequence(newSequence)

    const index = newSequence.length - 1
    const correct = pattern[index]

    if (!correct || x !== correct.x || y !== correct.y) {
      handleFail()
      return
    }

    if (newSequence.length === pattern.length) {
      handleWin()
    }
  }

  const handleWin = () => {
    const gained = level * 5
    setScore((prev) => prev + gained)
    setLevel((prev) => prev + 1)
  }

  const renderGrid = () => {
    const cells = []

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const key = `${x}-${y}`

        const isPattern =
          currentStep !== -1 &&
          pattern[currentStep]?.x === x &&
          pattern[currentStep]?.y === y

        const isClicked = activeClick === key

        cells.push(
          <div
            key={key}
            data-key={key}
            className={`cell ${isPattern ? "active" : ""} ${
              isClicked ? "clicked" : ""
            }`}
            onPointerDown={() => {
              setIsDrawing(true)
              handleInput(x, y)
            }}
            onPointerEnter={() => {
              if (isDrawing) handleInput(x, y)
            }}
            onPointerUp={() => setIsDrawing(false)}
          />
        )
      }
    }

    return cells
  }

  return (
    <div className="game-fullscreen">
      <div
        className="pattern-game"
        style={{
          width: BASE_SIZE,
          transform: `scale(${scale})`
        }}
      >
        <h2>Nivel {level}</h2>
        <p>❤️ {lives} | ⭐ {score}</p>
        {!isShowingPattern && <p>⏱ {timeLeft}s</p>}

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`
          }}
        >
          {renderGrid()}
        </div>

        <p>{isShowingPattern ? "Mirá el patrón..." : "Repetilo"}</p>

        <button onClick={() => { onWin("game2", score); onExit() }}>
          Salir
        </button>
      </div>
    </div>
  )
}