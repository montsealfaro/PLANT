import { useEffect, useState } from "react"

export default function Particles({ type }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (type !== "playing") return

    // generar partículas aleatorias
    const newParticles = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      left: Math.random() * 80 + 10, // %
      top: Math.random() * 60 + 20,  // %
      delay: Math.random() * 0.3,
      duration: 0.8 + Math.random() * 0.5
    }))

    setParticles(newParticles)

    // limpiar después de animación
    const timeout = setTimeout(() => {
      setParticles([])
    }, 1200)

    return () => clearTimeout(timeout)
  }, [type])

  if (type !== "playing") return null

  return (
    <div className="particles">
      {particles.map(p => (
        <span
          key={p.id}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`
          }}
        >
          ✨
        </span>
      ))}
    </div>
  )
}