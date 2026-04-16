import { useState, useEffect } from "react"
import useGameScale from "../../../hooks/useGameScale"

const BASE_SIZE = 280

export default function Game2({ onExit, onWin }) {
  const rawScale = useGameScale(BASE_SIZE, BASE_SIZE)
    const scale = rawScale * 0.65

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

  // 📈 DIFICULTAD
  const getGridSize = (level) => {
    return Math.min(3 + Math.floor(level / 2), 10)
  }

  const getPatternLength = (level, gridSize) => {
    return Math.min(2 + level, gridSize * 2)
  }

  // 🎲 GENERAR PATRÓN
  const generatePattern = (size, length) => {
    const newPattern = []
    for (let i = 0; i < length; i++) {
      newPattern.push({
        x: Math.floor(Math.random() * size),
        y: Math.floor(Math.random() * size)
      })
    }
    return newPattern
  }

  // 🎬 MOSTRAR PATRÓN
  const playPattern = (pattern, level) => {
    setIsShowingPattern(true)
    setCurrentStep(-1)

    const speed = Math.max(600 - level * 30, 200)

    pattern.forEach((step, index) => {
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

  // 🔁 NUEVO NIVEL
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

  // ⏱ TIMER
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

  // ❌ FALLAR
  const handleFail = () => {
    setLives((prev) => {
      const newLives = prev - 1

      if (newLives <= 0) {
        alert(`Game Over - Puntaje: ${score}`)
        onWin(score)
        onExit()
      } else {
        setPlayerSequence([])
        setTimeLeft(10)
        playPattern(pattern, level)
      }

      return newLives
    })
  }

  // 🎯 INPUT
  const handleInput = (x, y) => {
    if (isShowingPattern) return

    const last = playerSequence[playerSequence.length - 1]
    if (last && last.x === x && last.y === y) return

    const key = `${x}-${y}`

    setActiveClick(key)
    setTimeout(() => setActiveClick(null), 150)

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

  // 🏆 GANAR
  const handleWin = () => {
    const gained = level * 5
    setScore((prev) => prev + gained)
    setLevel((prev) => prev + 1)
  }

  // 🎨 GRID
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
            className={`cell ${isPattern ? "active" : ""} ${isClicked ? "clicked" : ""}`}
            onMouseDown={() => {
              setIsDrawing(true)
              handleInput(x, y)
            }}
            onMouseEnter={() => {
              if (isDrawing) handleInput(x, y)
            }}
            onMouseUp={() => setIsDrawing(false)}
            onTouchStart={() => {
              setIsDrawing(true)
              handleInput(x, y)
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0]
              const el = document.elementFromPoint(touch.clientX, touch.clientY)

              if (el && el.dataset.key) {
                const [tx, ty] = el.dataset.key.split("-").map(Number)
                handleInput(tx, ty)
              }
            }}
            onTouchEnd={() => setIsDrawing(false)}
          />
        )
      }
    }

    return cells
  }

  return (
    <div className="game-fullscreen">
      <div
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          transform: `scale(${scale})`,
          transformOrigin: "center center"
        }}
        className="pattern-game"
        onMouseUp={() => setIsDrawing(false)}
        onTouchEnd={() => setIsDrawing(false)}
      >
        <h2>Nivel {level}</h2>
        <p>❤️ Vidas: {lives}</p>
        <p>⭐ Puntaje: {score}</p>
        {!isShowingPattern && <p>⏱ Tiempo: {timeLeft}s</p>}

        <div
          className="grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`
          }}
        >
          {renderGrid()}
        </div>

        {isShowingPattern && <p>Mirá el patrón...</p>}
        {!isShowingPattern && <p>Repetilo</p>}

        <button
          onClick={() => {
            onWin(score)
            onExit()
          }}
        >
          Salir
        </button>
      </div>
    </div>
  )
}