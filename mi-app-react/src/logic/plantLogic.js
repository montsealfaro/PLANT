export function calculateHoursSince(lastTime) {
  const now = Date.now()
  const diff = now - lastTime
  return diff / 1000 / 60 / 60
}