import { useEffect, useState } from "react"
import { getLastWaterTime, setLastWaterTime } from "../utils/storage"
import { calculateHoursSince, getPlantStage } from "../logic/plantLogic"

export default function usePlant() {
  const [lastWaterTime, setLastTime] = useState(null)
  const [hoursSinceWater, setHours] = useState(0)
  const [plantStage, setPlantStage] = useState("wilted") // 👈 arranca seco

  // Cargar desde localStorage o simular descuido inicial
  useEffect(() => {
    const saved = getLastWaterTime()

    let initialTime

    if (saved) {
      initialTime = saved
    } else {
      const hoursAgo = 10 // 👈 cambia esto si querés otro nivel de “abandono”
      initialTime = Date.now() - hoursAgo * 60 * 60 * 1000
    }

    setLastTime(initialTime)

    // 👇 cálculo inmediato (no esperar 1 minuto)
    const hours = calculateHoursSince(initialTime)
    setHours(hours)
    setPlantStage(getPlantStage(hours))
  }, [])

  // Loop que recalcula el estado cada minuto
  useEffect(() => {
    if (!lastWaterTime) return

    const interval = setInterval(() => {
      const hours = calculateHoursSince(lastWaterTime)
      setHours(hours)
      setPlantStage(getPlantStage(hours))
    }, 60 * 1000)

    return () => clearInterval(interval)
  }, [lastWaterTime])

  function drinkWater() {
    const now = Date.now()
    setLastTime(now)
    setLastWaterTime(now)
    setHours(0)
    setPlantStage("happy")
  }

  return {
    hoursSinceWater,
    plantStage,
    drinkWater
  }
}