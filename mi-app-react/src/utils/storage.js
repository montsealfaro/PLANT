const KEY = "lastWaterTime"

export function getLastWaterTime() {
  const value = localStorage.getItem(KEY)
  return value ? parseInt(value) : null
}

export function setLastWaterTime(time) {
  localStorage.setItem(KEY, time.toString())
}
