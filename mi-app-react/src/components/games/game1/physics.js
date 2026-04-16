const GRAVITY = 0.5
const FLOAT_GRAVITY = 0.15
const SPEED = 2
const AIR_CONTROL = 0.35
const JUMP = -11
const MAX_FALL = 7
const FLOAT_FALL = 1.8

export function updatePlayer(player, input, platforms) {
  let p = { ...player }

  // 🫧 estado hover
  if (p.hovering === undefined) p.hovering = false

  // 🎮 MOVIMIENTO HORIZONTAL
  if (input.left) {
    p.vx = p.onGround ? -SPEED : p.vx - AIR_CONTROL
  } else if (input.right) {
    p.vx = p.onGround ? SPEED : p.vx + AIR_CONTROL
  } else {
    p.vx *= p.onGround ? 0.8 : 0.95
  }

  // 🔼 SALTO
  if (input.jump && p.onGround) {
    p.vy = JUMP
    p.onGround = false
    p.hovering = false
  }

  // 🫧 ACTIVAR HOVER (mantener salto en el aire)
  if (input.jump && !p.onGround && p.vy > -2) {
    p.hovering = true
  }

  // 🛑 SOLTAR HOVER
  if (!input.jump) {
    p.hovering = false
  }

  // 🌍 GRAVEDAD DINÁMICA
  if (p.hovering) {
    p.vy += FLOAT_GRAVITY
    if (p.vy > FLOAT_FALL) p.vy = FLOAT_FALL
  } else {
    p.vy += GRAVITY
    if (p.vy > MAX_FALL) p.vy = MAX_FALL
  }

  // aplicar movimiento
  p.x += p.vx
  p.y += p.vy

  p.onGround = false

  // 🧱 COLISIONES
  for (let plat of platforms) {
    const hitX = p.x < plat.x + plat.width && p.x + p.width > plat.x
    const hitY = p.y < plat.y + plat.height && p.y + p.height > plat.y

    if (hitX && hitY) {
            if (plat.type === "falling") {
        plat.falling = true
        plat.fallSpeed = 2
        } {
        p.y = plat.y - p.height
        p.vy = 0
        p.onGround = true
        p.hovering = false
      }
    }
  }

  return p
}

export function updateEnemies(enemies) {
  return enemies.map(e => {
    let x = e.x + e.dir * e.speed

    if (x > e.baseX + e.range || x < e.baseX) {
      e.dir *= -1
    }

    return { ...e, x }
  })
}