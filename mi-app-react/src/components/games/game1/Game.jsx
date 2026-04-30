import { useEffect, useState } from "react"
import Platform from "./Platform"
import Enemy from "./Enemy"
import Player from "./Player"
import useGameLoop from "./useGameLoop"
import { updatePlayer, updateEnemies } from "./physics"

const WIDTH = 390
const HEIGHT = 800
const biomeColors = {
  sky: "linear-gradient(#87CEEB, #e0f7ff)",
  forest: "linear-gradient(#2e8b57, #98fb98)",
  lava: "linear-gradient(#8b0000, #ff4500)"
}

function generateLevel(level) {
  const biomeTypes = ["sky", "forest", "lava"]
  const biome = biomeTypes[level % biomeTypes.length]

  const platforms = [
    { x: 0, y: 780, width: 2000, height: 60, type: "ground" }
  ]

  let x = 80
  let y = 720

  const totalPlatforms = 28 + level * 4

  const MIN_GAP_X = 100
const MAX_GAP_X = 180
const MIN_GAP_Y = 60
const MAX_GAP_Y = 120

const MIN_HEIGHT = 250 // nunca cerca del suelo

for (let i = 0; i < totalPlatforms; i++) {

  let attempts = 0
  let valid = false

  while (!valid && attempts < 20) {
    attempts++

    const newX = x + MIN_GAP_X + Math.random() * (MAX_GAP_X - MIN_GAP_X)

    let newY = y + (Math.random() > 0.5
      ? -(MIN_GAP_Y + Math.random() * (MAX_GAP_Y - MIN_GAP_Y))
      : (MIN_GAP_Y + Math.random() * (MAX_GAP_Y - MIN_GAP_Y))
    )

    newY = Math.max(MIN_HEIGHT, Math.min(760, newY))

    const width = 80 + Math.random() * 40

    // 👉 evitar solapamientos
    const collision = platforms.some(p =>
      newX < p.x + p.width + 20 &&
      newX + width > p.x - 20 &&
      newY < p.y + 30 &&
      newY + 20 > p.y - 30
    )

    if (!collision) {
      x = newX
      y = newY

      let type = "normal"
      const r = Math.random()
      if (r > 0.85) type = "moving"
      else if (r > 0.7) type = "falling"

      platforms.push({
        x,
        y,
        width,
        height: 20,
        type,
        baseX: x,
        range: 50 + Math.random() * 80,
        dir: Math.random() > 0.5 ? 1 : -1,
        falling: false,
        fallSpeed: 0
      })

      valid = true
    }
  }
}

  // 🪙 monedas (solo algunas)
  const coins = platforms
    .filter((p, i) => i !== 0 && Math.random() > 0.5)
    .map(p => ({
      x: p.x + p.width / 2 - 5,
      y: p.y - 35,
      collected: false
    }))

  // 🟥 enemigos (menos, mejor distribuidos)
  const enemies = platforms
    .filter((p, i) => i !== 0 && Math.random() > 0.8)
    .map(p => ({
      x: p.x + 10,
      y: p.y - 30,
      baseX: p.x + 10,
      width: 30,
      height: 30,
      dir: Math.random() > 0.5 ? 1 : -1,
      speed: 1 + level * 0.2,
      range: p.width - 20
    }))

  return {
    platforms,
    enemies,
    coins,
    biome,
    goal: { x: x + 200, y: y - 60 }
  }
}

export default function Game({ onExit, onReward }){
  const [levelIndex, setLevelIndex] = useState(0)
  const [level, setLevel] = useState(generateLevel(0))
  const [enemies, setEnemies] = useState(level.enemies)
  const [coins, setCoins] = useState(level.coins)

  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const [player, setPlayer] = useState({
    x: 50,
    y: 600,
    width: 40,
    height: 40,
    vx: 0,
    vy: 0,
    onGround: false
  })

  const [input, setInput] = useState({ left: false, right: false, jump: false })
  const [cameraX, setCameraX] = useState(0)

  // 🎮 INPUT
  useEffect(() => {
    const keys = {}

    const down = (e) => {
      keys[e.key.toLowerCase()] = true
      update()
    }

    const up = (e) => {
      keys[e.key.toLowerCase()] = false
      update()
    }

    const update = () => {
      setInput({
        left: keys["a"] || keys["arrowleft"],
        right: keys["d"] || keys["arrowright"],
        jump: keys[" "] || keys["w"] || keys["arrowup"]
      })
    }

    window.addEventListener("keydown", down)
    window.addEventListener("keyup", up)

    return () => {
      window.removeEventListener("keydown", down)
      window.removeEventListener("keyup", up)
    }
  }, [])

  useGameLoop(() => {
    if (gameOver) return

    // 🟪 plataformas dinámicas
setLevel(prevLevel => ({
  ...prevLevel,
  platforms: prevLevel.platforms.map(p => {

    if (p.type === "moving") {
      let newX = p.x + p.dir * 1.5

      if (newX > p.baseX + p.range || newX < p.baseX - p.range) {
        return { ...p, dir: -p.dir }
      }

      return { ...p, x: newX }
    }

    if (p.type === "falling" && p.falling) {
      return {
        ...p,
        y: p.y + p.fallSpeed,
        fallSpeed: p.fallSpeed + 0.5
      }
    }

    return p
  })
}))

    setPlayer(prev => {
      let updated = updatePlayer(prev, input, level.platforms)
      
      // 💀 caída al vacío
        if (updated.y > 900) {
          setLives(l => {
            const newLives = l - 1
            if (newLives <= 0) {
            onReward?.("game1", score)
            setGameOver(true)
          }
            return newLives
          })

          return {
            ...updated,
            x: 50,
            y: 600,
            vx: 0,
            vy: 0
          }
        }

      // 🪙 monedas
      setCoins(prevCoins =>
        prevCoins.map(c => {
          if (c.collected) return c

          const hit =
            updated.x < c.x + 20 &&
            updated.x + updated.width > c.x &&
            updated.y < c.y + 20 &&
            updated.y + updated.height > c.y

          if (hit) {
            setScore(s => s + 10)
            return { ...c, collected: true }
          }

          return c
        })
      )

      // 🟥 enemigos
      setEnemies(prevEnemies =>
        prevEnemies.map(e => {
          const hit =
            updated.x < e.x + e.width &&
            updated.x + updated.width > e.x &&
            updated.y < e.y + e.height &&
            updated.y + updated.height > e.y

          if (hit) {
            const stomp =
              prev.y + prev.height <= e.y + 5 &&
              updated.vy > 0

            if (stomp) {
              updated.vy = -10
              setScore(s => s + 20)
              return { ...e, dead: true }
            } else {
              setLives(l => {
                const newLives = l - 1
                if (newLives <= 0) setGameOver(true)
                return newLives
              })

              return e
            }
          }

          return e
        }).filter(e => !e.dead)
      )

      // 🟡 meta
      const g = level.goal
      const win =
        updated.x < g.x + 40 &&
        updated.x + updated.width > g.x &&
        updated.y < g.y + 80 &&
        updated.y + updated.height > g.y

      if (win) {
        const next = levelIndex + 1
        const newLevel = generateLevel(next)

        setLevelIndex(next)
        setLevel(newLevel)
        setEnemies(newLevel.enemies)
        setCoins(newLevel.coins)

        return { ...updated, x: 50, y: 600 }
      }

      setCameraX(updated.x - 150)

      return updated
    })

    setEnemies(prev => updateEnemies(prev))
  })

  const restart = () => {
    setLevelIndex(0)
    const newLevel = generateLevel(0)
    setLevel(newLevel)
    setEnemies(newLevel.enemies)
    setCoins(newLevel.coins)
    setLives(3)
    setScore(0)
    setGameOver(false)
    setPlayer({ x: 50, y: 600, width: 40, height: 40, vx: 0, vy: 0 })
  }

  return (
    <div style={{
      width: "100%",
      height: "100dvh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#0b0f1a"
    }}>
      <div style={{
        position: "relative",
        width: WIDTH,
        height: HEIGHT,
        overflow: "hidden",
        borderRadius: 30,
        background: biomeColors[level.biome],
        transform: "scale(0.9)"
      }}>

        {/* HUD */}
        <div style={{ position: "absolute", top: 10, left: 10, color: "#000" }}>
          ❤️ {lives} | 🪙 {score}
        </div>

        <Player player={{ ...player, x: player.x - cameraX }} />

        {level.platforms.map((p, i) => (
          <Platform
              key={i}
              x={p.x - cameraX}
              y={p.y}
              width={p.width}
              height={p.height}
              type={p.type}
            />
        ))}

        {enemies.map((e, i) => (
          <Enemy key={i} x={e.x - cameraX} y={e.y} width={e.width} height={e.height} />
        ))}

        {coins.map((c, i) =>
          !c.collected && (
            <div key={i} style={{
              position: "absolute",
              left: c.x - cameraX,
              top: c.y,
              width: 15,
              height: 15,
              borderRadius: "50%",
              background: "gold"
            }} />
          )
        )}

        <div style={{
          position: "absolute",
          left: level.goal.x - cameraX,
          top: level.goal.y,
          width: 40,
          height: 80,
          background: "gold"
        }} />

        {/* GAME OVER */}
{gameOver && (
  <div style={{
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.55)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10
  }}>

    {/* CARD */}
    <div style={{
      width: "80%",
      maxWidth: 320,
      background: "#ffffff",
      borderRadius: 24,
      padding: "30px 20px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
      animation: "scaleIn 0.25s ease"
    }}>

      <h2 style={{ margin: 0, fontSize: 28, color: "#000" }}>
        ¡Perdiste!
      </h2>

      <p style={{ margin: 0, fontSize: 16, color: "#333" }}>
        Score: {score}
      </p>

      <p style={{ margin: 0, fontSize: 14, color: "#666" }}>
        Energía ganada: {Math.floor(score / 1000)}
      </p>

      {/* BOTONES */}
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginTop: 10
      }}>
        <button
          onClick={restart}
          style={{
            padding: "12px",
            borderRadius: 14,
            border: "none",
            fontWeight: "bold",
            background: "#111",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Reintentar
        </button>

        <button
          onClick={onExit}
          style={{
            padding: "12px",
            borderRadius: 14,
            border: "none",
            fontWeight: "bold",
            background: "#e5e5e5",
            color: "#000",
            cursor: "pointer"
          }}
        >
          Salir
        </button>
      </div>
    </div>

    {/* animación simple inline */}
    <style>
      {`
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}
    </style>

  </div>
)}

      </div>
    </div>
  )
}