import { useEffect, useState } from "react"

const STORAGE_KEY = "daily_history"

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

export default function useDailyHistory() {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const saveDailyEntry = (data) => {
    const today = getTodayKey()

    setHistory((prev) => {
      const existing = prev[today] || {}

      return {
        ...prev,
        [today]: {
          ...existing,

          // 🔥 CONTADOR DE APERTURAS
          opens: (existing.opens || 0) + (data.open ? 1 : 0),

          // 🔥 MOOD ACTUAL (no se rompe)
          mood: data.mood ?? existing.mood,

          // 🔥 HISTORIAL DE MOODS
          moodHistory: data.mood
            ? [
                ...(existing.moodHistory || []),
                {
                  mood: data.mood,
                  timestamp: Date.now()
                }
              ]
            : existing.moodHistory,

          // 🔥 resto intacto (trackers, journal, etc)
          ...data,

          updatedAt: new Date().toISOString()
        }
      }
    })
  }

  const getTodayEntry = () => {
    return history[getTodayKey()] || null
  }

  return {
    history,
    saveDailyEntry,
    getTodayEntry
  }
}