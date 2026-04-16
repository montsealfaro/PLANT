const GRAVITY = 0.35
const JUMP_FORCE = -13
const MOVE_SPEED = 4
const MAX_FALL_SPEED = 12
const GAME_WIDTH = 300

export function updatePlayer(player, platforms, input = {}) {
  let { x, y, vy, width, height } = player

  // gravedad progresiva
  vy += GRAVITY
  if (vy > MAX_FALL_SPEED) vy = MAX_FALL_SPEED

  // movimiento teclado
  if (input.left) x -= MOVE_SPEED
  if (input.right) x += MOVE_SPEED

  // wrap horizontal (estilo doodle jump 🔥)
  if (x < -width) x = GAME_WIDTH
  if (x > GAME_WIDTH) x = -width

  let newY = y + vy

  for (let p of platforms) {
    if (p.broken) continue

    const isFalling = vy > 0

    const withinX =
      x + width > p.x &&
      x < p.x + p.width

    const prevBottom = y + height
    const nextBottom = newY + height

    const landing =
      prevBottom <= p.y &&
      nextBottom >= p.y

    if (isFalling && withinX && landing) {
      newY = p.y - height
      vy = JUMP_FORCE

      // plataformas frágiles
      if (p.breakable) {
        p.broken = true
      }

      break
    }
  }

  return {
    ...player,
    x,
    y: newY,
    vy
  }
}