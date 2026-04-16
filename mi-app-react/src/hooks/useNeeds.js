import { useState } from "react"
import { clampNeeds } from "../logic/limits"

export default function useNeeds(initialValue) {
  const [needs, setNeeds] = useState(() =>
    typeof initialValue === "function" ? initialValue() : initialValue
  )

  const updateNeed = (key, amount) => {
    setNeeds(prev =>
      clampNeeds({
        ...prev,
        [key]: prev[key] + amount
      })
    )
  }

  const addHappiness = amount => {
    const current = Number(localStorage.getItem("happiness") || 0)
    localStorage.setItem("happiness", current + amount)
  }

  return { needs, setNeeds, updateNeed, addHappiness }
}