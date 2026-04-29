export function convertScoreToJoy(gameId, score) {
  const rules = {
    game1: 50,   // cada 50 score = 1 joy
    game2: 25,   // cada 25 score = 1 joy
    game3: 1000  // cada 1000 score = 1 joy
  }

  const divisor = rules[gameId] || 100
  return Math.floor(score / divisor)
}