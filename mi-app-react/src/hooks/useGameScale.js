import { useEffect, useState } from "react"

export default function useGameScale(baseWidth, baseHeight) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight

      const scaleX = vw / baseWidth
      const scaleY = vh / baseHeight

      // 🔥 LIMITES (CLAVE)
      const newScale = Math.min(scaleX, scaleY, 1.8) // 👈 nunca más grande que 1.8

      setScale(newScale)
    }

    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [baseWidth, baseHeight])

  return scale
}