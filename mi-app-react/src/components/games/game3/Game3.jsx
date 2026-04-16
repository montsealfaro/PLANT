import { useEffect, useRef, useState } from "react"
import Player from "./Player"
import Platform from "./Platform"
import { updatePlayer } from "./physics"
import { useGameLoop } from "./useGameLoop"
import useNeeds from "../../../hooks/useNeeds"
import useGameScale from "../../../hooks/useGameScale"

const BASE_WIDTH = 300
const BASE_HEIGHT = 400
const PLAYER_SIZE = 20

export default function Game3({ onExit }) {
  const scale = useGameScale(BASE_WIDTH, BASE_HEIGHT)
  const { addEnergy } = useNeeds()

  const [player, setPlayer] = useState({
    x: 150,
    y: 300,
    vy: 0,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE
  })

  const [platforms, setPlatforms] = useState(generateInitialPlatforms())
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const playerRef = useRef(player)
  const platformsRef = useRef(platforms)
  const scoreRef = useRef(score)
  const input = useRef({ left: false, right: false })
  const targetXRef = useRef(player.x)

  useEffect(() => { playerRef.current = player }, [player])
  useEffect(() => { platformsRef.current = platforms }, [platforms])
  useEffect(() => { scoreRef.current = score }, [score])

  // 🎮 teclado
  useEffect(() => {
    const down = e => {
      if (e.key === "ArrowLeft") input.current.left = true
      if (e.key === "ArrowRight") input.current.right = true
    }
    const up = e => {
      if (e.key === "ArrowLeft") input.current.left = false
      if (e.key === "ArrowRight") input.current.right = false
    }

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  // 🖱️ + 📱 pointer
  const handlePointerMove = e => {
    if (gameOver) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    if (clientX == null) return

    targetXRef.current = clientX - rect.left - PLAYER_SIZE / 2
  }

  // 💀 GAME OVER
  function handleGameOver(finalScore) {
    if (gameOver) return

    const energy = Math.floor(finalScore / 1000)
    if (energy > 0) addEnergy(energy)

    setGameOver(true)
  }

  // 🔁 GAME LOOP
  useGameLoop(() => {
    if (gameOver) return

    try {
      const currentPlayer = playerRef.current

      const lerp = (a, b, t) => a + (b - a) * t
      const smoothX = lerp(currentPlayer.x, targetXRef.current, 0.2)

      let newPlayer = updatePlayer(
        { ...currentPlayer, x: smoothX },
        platformsRef.current,
        input.current
      )

      if (!Number.isFinite(newPlayer.y)) {
        handleGameOver(scoreRef.current)
        return
      }

      // scroll
      if (newPlayer.y < BASE_HEIGHT * 0.4) {
        const diff = BASE_HEIGHT * 0.4 - newPlayer.y
        newPlayer.y = BASE_HEIGHT * 0.4

        setPlatforms(prev =>
          prev
            .map(p => ({ ...p, y: p.y + diff }))
            .filter(p => Number.isFinite(p.y) && p.y < BASE_HEIGHT)
        )

        setScore(s => s + Math.floor(diff))
      }

      spawnPlatforms(scoreRef.current)

      if (newPlayer.y > BASE_HEIGHT) {
        handleGameOver(scoreRef.current)
        return
      }

      setPlayer(newPlayer)

    } catch (err) {
      console.error("Game crash prevented:", err)
      handleGameOver(scoreRef.current)
    }
  })

  // 🧠 plataformas
  function spawnPlatforms(score) {
    setPlatforms(prev => {
      let arr = prev.filter(p => Number.isFinite(p.y))

      if (arr.length === 0) return generateInitialPlatforms()

      const difficulty = Math.min(1 + score / 2000, 3)

      while (arr.length < 7) {
        const ys = arr.map(p => p.y).filter(y => Number.isFinite(y))
        const highestY = ys.length ? Math.min(...ys) : 300

        arr.push({
          x: Math.random() * (BASE_WIDTH - 60),
          y: highestY - (60 + Math.random() * 40 * difficulty),
          width: 60,
          height: 10,
          breakable: Math.random() < 0.2 + difficulty * 0.2,
          broken: false
        })
      }

      return arr
    })
  }

  function resetGame() {
    setPlayer({
      x: 150,
      y: 300,
      vy: 0,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    })
    setPlatforms(generateInitialPlatforms())
    setScore(0)
    setGameOver(false)
  }

  return (
    <div className="game-fullscreen">
      <div
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        style={{
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          background: "linear-gradient(#87CEEB, #ffffff)",
          position: "relative",
          overflow: "hidden",
          touchAction: "none"
        }}
      >
        <Player x={player.x} y={player.y} />

        {platforms.map((p, i) =>
          p.broken ? null : <Platform key={i} {...p} />
        )}

        <div style={{ position: "absolute", top: 10, left: 10 }}>
          Score: {score}
        </div>

        {gameOver && (
          <div style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            gap: "10px"
          }}>
            <h2>Game Over</h2>
            <p>Score: {score}</p>
            <p>Energía: {Math.floor(score / 1000)}</p>

            <button onClick={resetGame}>Reintentar</button>
            <button onClick={onExit}>Salir</button>
          </div>
        )}
      </div>
    </div>
  )
}

function generateInitialPlatforms() {
  let y = 350
  const arr = []

  for (let i = 0; i < 6; i++) {
    arr.push({
      x: Math.random() * 240,
      y,
      width: 60,
      height: 10,
      breakable: false,
      broken: false
    })
    y -= 70
  }

  return arr
}