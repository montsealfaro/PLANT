export function calculateHoursSince(lastTime) {
  const now = Date.now()
  const diff = now - lastTime
  return diff / 1000 / 60 / 60
}

export function getPlantStage(hours) {
  if (hours <= 2) return "happy"
  if (hours <= 5) return "ok"
  if (hours <= 8) return "sad"
  return "wilted"
}
