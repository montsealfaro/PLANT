import { clampNeeds } from "./limits"

const DECAY_INTERVALS = {
  water: [3600, 10800],
  food: [3600, 21600],
  energy: [3600, 43200],
  social: [3600, 86400]
}

function getRandomDecay(need) {
  const [minSec, maxSec] = DECAY_INTERVALS[need]
  const secToZero = Math.random() * (maxSec - minSec) + minSec
  return 100 / secToZero
}

export function applyDecay(needs, { isSleeping, isPlaying }) {
  return clampNeeds({
    water: needs.water - getRandomDecay("water"),
    food: needs.food - getRandomDecay("food"),
    energy: needs.energy - (isSleeping ? 0 : getRandomDecay("energy")),
    social: needs.social - (isPlaying ? 0 : getRandomDecay("social"))
  })
}