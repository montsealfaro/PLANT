import { useState, useEffect } from "react"

const SIZE = 5
const COLORS = ["red", "blue", "green", "yellow"]

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)]
}

function createBoard() {
  return Array.from({ length: SIZE }, () =>
    Array.from({ length: SIZE }, randomColor)
  )
}

function isAdjacent(a, b) {
  const dr = Math.abs(a.r - b.r)
  const dc = Math.abs(a.c - b.c)
  return dr + dc === 1
}

export default function useMatch3(onWin, onExit) {
  const [board, setBoard] = useState(createBoard())
  const [selected, setSelected] = useState([])
  const [isSelecting, setIsSelecting] = useState(false)

  const [timeLeft, setTimeLeft] = useState(10)
  const [lives, setLives] = useState(3)

  // ⏳ TIMER
  useEffect(() => {
    if (timeLeft <= 0) {
      setLives(prev => prev - 1)
      setTimeLeft(10)
      setSelected([])

      if (lives - 1 <= 0) {
        onExit()
      }
    }

    const interval = setInterval(() => {
      setTimeLeft(t => t - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft])

  // 🟢 iniciar selección
  function startSelection(r, c) {
    setIsSelecting(true)
    setSelected([{ r, c }])
  }

  // 🔵 extender selección
  function extendSelection(r, c) {
    if (!isSelecting) return

    const last = selected[selected.length - 1]
    const newCell = { r, c }

    if (!isAdjacent(last, newCell)) return

    const sameColor =
      board[r][c] === board[selected[0].r][selected[0].c]

    if (!sameColor) return

    const alreadySelected = selected.some(p => p.r === r && p.c === c)
    if (alreadySelected) return

    setSelected(prev => [...prev, newCell])
  }

  // 🔴 terminar selección
  function endSelection() {
    if (!isSelecting) return

    if (selected.length >= 3) {
      // eliminar
      const newBoard = board.map(row => [...row])

      selected.forEach(({ r, c }) => {
        newBoard[r][c] = randomColor()
      })

      setBoard(newBoard)
      onWin(selected.length)
    } else {
      // ❌ fallo → pierde vida
      setLives(prev => {
        const newLives = prev - 1
        if (newLives <= 0) onExit()
        return newLives
      })
    }

    setSelected([])
    setIsSelecting(false)
    setTimeLeft(10)
  }

  return {
    board,
    selected,
    startSelection,
    extendSelection,
    endSelection,
    timeLeft,
    lives
  }
}