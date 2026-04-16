import { GAME_CONFIG } from "../config/gameConfig"

export function clampNeed(value) {
  return Math.max(GAME_CONFIG.limits.min, Math.min(GAME_CONFIG.limits.max, value))
}

export function clampNeeds(needs) {
  return {
    water: clampNeed(needs.water),
    food: clampNeed(needs.food),
    energy: clampNeed(needs.energy),
    social: clampNeed(needs.social)
  }
}