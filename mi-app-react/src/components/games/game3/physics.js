const GRAVITY = 0.35
const JUMP_FORCE = -12
const MOVE_SPEED = 4
const MAX_FALL_SPEED = 12
const GAME_WIDTH = 300

export function updatePlayer(player, platforms, input = {}) {
  let { x, y, vy, width, height } = player

  vy += GRAVITY
  if (vy > MAX_FALL_SPEED) vy = MAX_FALL_SPEED

  if (input.left) x -= MOVE_SPEED
  if (input.right) x += MOVE_SPEED

  if (x < -width) x = GAME_WIDTH
  if (x > GAME_WIDTH) x = -width

  let newY = y + vy

  for (let p of platforms) {
    if (p.broken) continue

    const falling = vy > 0
    const withinX = x + width > p.x && x < p.x + p.width
    const landing = y + height <= p.y && newY + height >= p.y

    if (falling && withinX && landing) {
      newY = p.y - height
      vy = JUMP_FORCE

      if (p.breakable) p.broken = true
      break
    }
  }

  return { ...player, x, y: newY, vy }
}