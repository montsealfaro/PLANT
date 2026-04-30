import { useState, useEffect } from "react"

const STORAGE_KEY = "joyPoints"

export default function useJoyPoints() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved
      ? JSON.parse(saved)
      : { level: 1, progress: 0, total: 0 }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  function addJoyPoints(amount) {
    setState(prev => {
      let newProgress = prev.progress + amount
      let newLevel = prev.level
      let newTotal = (prev.total || 0) + amount

      while (newProgress >= 100) {
        newProgress -= 100
        newLevel += 1
      }

      return {
        level: newLevel,
        progress: newProgress,
        total: newTotal
      }
    })
  }

  return {
    joyPoints: state.total || 0, // 👈 lo que ya usabas
    level: state.level,
    progress: state.progress,
    addJoyPoints
  }
}