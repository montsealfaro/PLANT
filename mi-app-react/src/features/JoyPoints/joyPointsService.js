const STORAGE_KEY = "joyPoints"

export function getStoredJoyPoints() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? parseInt(saved, 10) : 0
}

export function saveJoyPoints(value) {
  localStorage.setItem(STORAGE_KEY, value.toString())
}