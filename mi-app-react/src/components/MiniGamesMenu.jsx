import { useRef, useState } from "react"

import Game1 from "./games/game1/Game"
import Game2 from "./games/game2/Game2"
import Game3 from "./games/game3/Game3"

export default function MiniGamesMenu({ onClose, onReward }) {
  const [activeGame, setActiveGame] = useState(null)

  const startX = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)

  const velocity = useRef(0)
  const currentX = useRef(0)

  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [closing, setClosing] = useState(false)

  const EDGE_SIZE = 25
  const CLOSE_DISTANCE = 120
  const PREDICTION_FACTOR = 220

  const handleStart = (x) => {
    if (activeGame) return
    if (x > EDGE_SIZE) return

    startX.current = x
    lastX.current = x
    lastTime.current = Date.now()

    velocity.current = 0
    setIsDragging(true)
  }

  const handleMove = (x) => {
    if (!isDragging) return

    const now = Date.now()
    const dx = x - lastX.current
    const dt = now - lastTime.current || 1

    velocity.current = dx / dt

    lastX.current = x
    lastTime.current = now

    let delta = x - startX.current
    if (delta <= 0) return

    const resistance = delta * 0.6

    currentX.current = resistance
    setDragX(resistance)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const projected =
      currentX.current + velocity.current * PREDICTION_FACTOR

    const shouldClose = projected > CLOSE_DISTANCE

    if (shouldClose) {
      setClosing(true)
      setDragX(window.innerWidth)

      setTimeout(() => {
        onClose()
      }, 200)
    } else {
      setDragX(0)
    }

    currentX.current = 0
  }

  if (activeGame === "game1") {
    return (
      <Game1
        onExit={() => setActiveGame(null)}
        onReward={onReward}
      />
    )
  }

  if (activeGame === "game2") {
    return (
      <Game2
        onExit={() => setActiveGame(null)}
        onWin={onReward}
      />
    )
  }

  if (activeGame === "game3") {
    return (
      <Game3
        onExit={() => setActiveGame(null)}
        onReward={onReward}
      />
    )
  }

  return (
    <div
      className="swipe-container"
      onTouchStart={(e) => handleStart(e.touches[0].clientX)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div
        className="swipe-shadow"
        style={{ opacity: dragX > 10 ? 1 : 0 }}
      />

      <div
        className={`swipe-content ${closing ? "swipe-closing" : ""}`}
        style={{
          transform: `translateX(${dragX}px)`
        }}
      >
        <div className="menu-overlay modal-enter">
          <h2>Minijuegos 🎮</h2>

          <button onClick={() => setActiveGame("game1")}>
            🏃 Juego 1
          </button>

          <button onClick={() => setActiveGame("game2")}>
            🧩 Match 3
          </button>

          <button onClick={() => setActiveGame("game3")}>
            ☁️ Plataformas
          </button>

          <button onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}