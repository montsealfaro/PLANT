export function getPlantState(needs) {
  const { energy, water, food, social } = needs

  const minStat = Math.min(energy, water, food, social)

  if (minStat < 20) return "wilted"
  if (minStat < 40) return "sad"
  if (minStat < 70) return "ok"
  return "happy"
}