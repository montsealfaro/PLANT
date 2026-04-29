export default function Particles() {
  const particles = Array.from({ length: 18 })

  return (
    <>
      {particles.map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: "0 0 8px rgba(255,255,255,0.8)",
            animation: `sparkle ${2 + Math.random() * 3}s infinite alternate`,
            zIndex: 2
          }}
        />
      ))}
    </>
  )
}