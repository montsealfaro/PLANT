import { clampNeeds } from "./limits"

const DECAY_INTERVALS = {
  water: [3600, 10800],
  food: [3600, 21600],
  energy: [3600, 43200],
  social: [3600, 86400]
}

function getOfflineDecay(need, seconds) {
  const [minSec, maxSec] = DECAY_INTERVALS[need]
  const secToZero = (minSec + maxSec) / 2
  return (100 / secToZero) * seconds
}

export function applyOfflineProgress(needs, seconds) {
  const newNeeds = {
    water: needs.water - getOfflineDecay("water", seconds),
    food: needs.food - getOfflineDecay("food", seconds),
    energy: needs.energy - getOfflineDecay("energy", seconds),
    social: needs.social - getOfflineDecay("social", seconds)
  }
  return clampNeeds(newNeeds)
}