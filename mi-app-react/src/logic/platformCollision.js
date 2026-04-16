export function applyPlatformCollision(player, platforms) {
  let onGround = false
  let newY = player.y

  platforms.forEach((p) => {
    const isAbove =
      player.y >= p.y + p.height &&
      player.y + player.velocityY <= p.y + p.height

    const isWithinX =
      player.x + player.width > p.x &&
      player.x < p.x + p.width

    if (isAbove && isWithinX) {
      newY = p.y + p.height
      onGround = true
    }
  })

  return { newY, onGround }
}