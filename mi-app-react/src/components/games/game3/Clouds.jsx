export default function Clouds() {
  const clouds = [
    { top: 40, left: 20, size: 60, speed: 18 },
    { top: 100, left: 180, size: 80, speed: 25 },
    { top: 180, left: 100, size: 50, speed: 20 }
  ]

  return (
    <>
      {clouds.map((c, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            width: c.size,
            height: c.size * 0.5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.35)",
            filter: "blur(6px)",
            animation: `floatCloud ${c.speed}s linear infinite`,
            zIndex: 1
          }}
        />
      ))}
    </>
  )
}