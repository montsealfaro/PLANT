import { useEffect, useState } from "react"
import { getStoredJoyPoints, saveJoyPoints } from "./joyPointsService"

export default function useJoyPoints() {
  const [joyPoints, setJoyPoints] = useState(0)

  useEffect(() => {
    setJoyPoints(getStoredJoyPoints())
  }, [])

  const addJoyPoints = (amount) => {
    setJoyPoints((prev) => {
      const updated = prev + amount
      saveJoyPoints(updated)
      return updated
    })
  }

  const spendJoyPoints = (amount) => {
    setJoyPoints((prev) => {
      if (prev < amount) return prev
      const updated = prev - amount
      saveJoyPoints(updated)
      return updated
    })
  }

  return {
    joyPoints,
    addJoyPoints,
    spendJoyPoints
  }
}