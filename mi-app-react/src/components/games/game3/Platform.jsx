export default function Platform({ x, y, breakable }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 60,
        height: 12,
        left: x,
        top: y,
        borderRadius: 999,
        background: breakable
          ? "linear-gradient(90deg, #ffb347, #ff7b00)"
          : "linear-gradient(90deg, #ff4d6d, #ff1744)",
        boxShadow: breakable
          ? "0 0 10px rgba(255,180,71,0.8)"
          : "0 0 12px rgba(255,77,109,0.8)",
        border: "1px solid rgba(255,255,255,0.35)"
      }}
    />
  )
}