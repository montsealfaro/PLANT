import { useEffect, useRef, useState } from "react"
import Player from "./Player"
import Platform from "./Platform"
import { updatePlayer } from "./physics"
import { useGameLoop } from "./useGameLoop"
import useNeeds from "../../../hooks/useNeeds"
import useGameScale from "../../../hooks/useGameScale"
import Clouds from "./Clouds"
import Particles from "./Particles"

const BASE_WIDTH = 390
const BASE_HEIGHT = 800
const PLAYER_SIZE = 28

export default function Game3({ onExit, onReward }) {
  const scale = useGameScale(BASE_WIDTH, BASE_HEIGHT)
  const needs = useNeeds()

  const addEnergy =
    typeof needs?.addEnergy === "function" ? needs.addEnergy : () => {}

  const [player, setPlayer] = useState({
    x: 140,
    y: 320,
    vy: -10,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE
  })

  const [platforms, setPlatforms] = useState(generateInitialPlatforms())
  const [score, setScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const playerRef = useRef(player)
  const platformsRef = useRef(platforms)
  const scoreRef = useRef(score)
  const gameOverRef = useRef(gameOver)

  const input = useRef({ left: false, right: false })
  const targetXRef = useRef(player.x)

  useEffect(() => { playerRef.current = player }, [player])
  useEffect(() => { platformsRef.current = platforms }, [platforms])
  useEffect(() => { scoreRef.current = score }, [score])
  useEffect(() => { gameOverRef.current = gameOver }, [gameOver])

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

  const handlePointerMove = e => {
    if (gameOverRef.current) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    if (clientX == null) return

    targetXRef.current = (clientX - rect.left) / scale - PLAYER_SIZE / 2
  }

function handleGameOver(scoreValue) {
  if (gameOverRef.current) return

  gameOverRef.current = true
  setFinalScore(scoreValue)
  setGameOver(true)

  const energy = Math.floor(scoreValue / 1000)
  if (energy > 0) addEnergy(energy)

  setTimeout(() => {
    onReward?.("game3", scoreValue)
  }, 0)
}

  useGameLoop(() => {
    if (gameOverRef.current) return

    let newPlayer = updatePlayer(
      {
        ...playerRef.current,
        x: playerRef.current.x + (targetXRef.current - playerRef.current.x) * 0.18
      },
      platformsRef.current,
      input.current
    )

    if (newPlayer.y < BASE_HEIGHT * 0.4) {
      const diff = BASE_HEIGHT * 0.4 - newPlayer.y
      newPlayer.y = BASE_HEIGHT * 0.4

      let movedPlatforms = platformsRef.current
        .map(p => ({ ...p, y: p.y + diff }))
        .filter(p => p.y < BASE_HEIGHT)

      if (scoreRef.current > 120) {
        movedPlatforms = movedPlatforms.filter(p => !p.isBase)
      }

      const updatedPlatforms = spawnPlatforms(movedPlatforms, scoreRef.current)

      setPlatforms(updatedPlatforms)
      platformsRef.current = updatedPlatforms

      const newScore = scoreRef.current + Math.floor(diff)
      setScore(newScore)
      scoreRef.current = newScore
    }

    const currentPlatforms = platformsRef.current
    const lowestPlatformY =
      currentPlatforms.length > 0
        ? Math.max(...currentPlatforms.map(p => p.y))
        : BASE_HEIGHT

    if (
      newPlayer.y > BASE_HEIGHT + 20 ||
      (newPlayer.vy > 0 && newPlayer.y > lowestPlatformY + 80)
    ) {
      handleGameOver(scoreRef.current)
      return
    }

    setPlayer(newPlayer)
  })

  function resetGame() {
    const freshPlayer = {
      x: 140,
      y: 320,
      vy: -10,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE
    }

    const freshPlatforms = generateInitialPlatforms()

    playerRef.current = freshPlayer
    platformsRef.current = freshPlatforms
    scoreRef.current = 0
    gameOverRef.current = false
    targetXRef.current = freshPlayer.x
    input.current = { left: false, right: false }

    setPlayer(freshPlayer)
    setPlatforms(freshPlatforms)
    setScore(0)
    setFinalScore(0)
    setGameOver(false)
  }

  return (
    <div className="game-fullscreen">
      <div
        onMouseMove={handlePointerMove}
        onTouchMove={handlePointerMove}
        className="game3-container"
        style={{ width: BASE_WIDTH, height: BASE_HEIGHT }}
      >
        <Clouds />
        <Particles />

        {platforms.map((p, i) =>
          !p.broken ? <Platform key={i} {...p} isBase={p.isBase} /> : null
        )}

        <Player x={player.x} y={player.y} />

        <div className="score-ui">Score: {score}</div>

        {gameOver && (
          <div className="gameover-overlay">
            <div className="gameover-card">
              <h2>¡Perdiste!</h2>
              <p>Score: {finalScore}</p>
              <p>Energía ganada: {Math.floor(finalScore / 1000)}</p>
              <button onClick={resetGame}>Reintentar</button>
              <button onClick={onExit}>Salir</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function generateInitialPlatforms() {
  return [
    { x: 0, y: 790, width: 390, height: 40, breakable: false, broken: false, isBase: true },
    { x: 160, y: 650, width: 90, height: 14, breakable: false, broken: false },
    { x: 70, y: 500, width: 90, height: 14, breakable: false, broken: false }
  ]
}

function spawnPlatforms(prev, score) {
  let arr = [...prev]

  while (arr.length < 10) {
    const highestY = Math.min(...arr.map(p => p.y))
    const difficulty = Math.min(score / 4000, 1)

    arr.push({
      x: Math.random() * 300,
      y: highestY - (100 + Math.random() * 80),
      width: 90,
      height: 14,
      breakable: Math.random() < 0.2 + difficulty * 0.3,
      broken: false
    })
  }

  return arr
}