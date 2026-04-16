const WATER_KEY = "lastWaterTime"
const INTERACTION_KEY = "lastInteractionTime"

export function getLastWaterTime() {
  const value = localStorage.getItem(WATER_KEY)
  return value ? parseInt(value) : null
}

export function setLastWaterTime(time) {
  localStorage.setItem(WATER_KEY, time.toString())
}

// 🧠 MEMORIA
export function getLastInteractionTime() {
  const value = localStorage.getItem(INTERACTION_KEY)
  return value ? parseInt(value) : null
}

export function setLastInteractionTime(time) {
  localStorage.setItem(INTERACTION_KEY, time.toString())
}