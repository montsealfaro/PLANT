import { useState, useEffect, useRef } from "react"
import useNeeds from "./useNeeds"

import { GAME_CONFIG } from "../config/gameConfig"
import { getPlantState } from "../logic/getPlantState"
import { getRandomMessage } from "../logic/messages"
import { applyDecay } from "../logic/decay"
import { applyOfflineProgress } from "../logic/offlineProgress"

const DEFAULT_NEEDS = {
  water: 100,
  food: 100,
  energy: 100,
  social: 100
}

const clamp = (value) => Math.max(0, Math.min(100, value))

const loadInitialNeeds = () => {
  try {
    const saved = localStorage.getItem("plantData")
    if (!saved) return DEFAULT_NEEDS

    const parsed = JSON.parse(saved)

    if (!parsed?.needs || !parsed?.lastUpdate) {
      return DEFAULT_NEEDS
    }

    const secondsPassed = Math.floor(
      (Date.now() - parsed.lastUpdate) / 1000
    )

    return applyOfflineProgress(parsed.needs, secondsPassed)
  } catch {
    return DEFAULT_NEEDS
  }
}

export default function usePlant(personality = "alegría") {
  const [plantStage, setPlantStage] = useState("happy")
  const [message, setMessage] = useState("")
  const [isSleeping, setIsSleeping] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const { needs, setNeeds, updateNeed } = useNeeds(loadInitialNeeds)

  const sleepingRef = useRef(isSleeping)
  const playingRef = useRef(isPlaying)

  useEffect(() => {
    sleepingRef.current = isSleeping
    playingRef.current = isPlaying
  }, [isSleeping, isPlaying])

  // 💾 persistencia
  useEffect(() => {
    localStorage.setItem(
      "plantData",
      JSON.stringify({
        needs,
        lastUpdate: Date.now()
      })
    )
  }, [needs])

  // ⏳ decay
  useEffect(() => {
    const interval = setInterval(() => {
      setNeeds(prev =>
        applyDecay(prev, {
          isSleeping: sleepingRef.current,
          isPlaying: playingRef.current
        })
      )
    }, GAME_CONFIG.intervals.tick)

    return () => clearInterval(interval)
  }, [setNeeds])

  // 🌱 estado visual
  useEffect(() => {
    setPlantStage(getPlantState(needs))
  }, [needs])

  // 💬 mensajes
  useEffect(() => {
    const min = Math.min(
      needs.water,
      needs.food,
      needs.energy,
      needs.social
    )

    if (min === 0) {
      setMessage("...")
      return
    }

    if (needs.energy < 30) return setMessage("necesito descansar")
    if (needs.food < 30) return setMessage("tengo hambre")
    if (needs.water < 30) return setMessage("tengo sed")
    if (needs.social < 30) return setMessage("jugamos?")

    setMessage(getRandomMessage("idle", plantStage, personality))
  }, [needs, plantStage, personality])

  // 🎮 acciones
  const drinkWater = () => {
    updateNeed("water", 30)
    setMessage(getRandomMessage("drink", plantStage, personality))
  }

  const feedPet = () => {
    updateNeed("food", 25)
    setMessage(getRandomMessage("feed", plantStage, personality))
  }

  const sleepPet = () => {
    setIsSleeping(true)
    setIsPlaying(false)

    updateNeed("energy", 20)
    setMessage(getRandomMessage("sleep", plantStage, personality))

    setTimeout(() => setIsSleeping(false), 5000)
  }

  const playPet = () => {
    setIsPlaying(true)
    setIsSleeping(false)

    updateNeed("social", 20)
    updateNeed("energy", -10)

    setMessage(getRandomMessage("play", plantStage, personality))

    setTimeout(() => setIsPlaying(false), 5000)
  }

  // 🎁 recompensas de minijuegos
  const rewardPet = (type, amount) => {
    setNeeds(prev => ({
      ...prev,
      [type]: clamp(prev[type] + amount)
    }))

    setMessage(getRandomMessage("happy", plantStage, personality))
  }

  return {
    plantStage,
    message,
    needs,
    drinkWater,
    feedPet,
    sleepPet,
    playPet,
    rewardPet, // 👈 CLAVE (esto faltaba)
    isSleeping,
    isPlaying
  }
}