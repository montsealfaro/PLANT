export default function Platform({ x, y, breakable }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 60,
        height: 10,
        left: x,
        top: y,
        background: breakable ? "#ffaa00" : "#ff3b3b",
        borderRadius: 4
      }}
    />
  )
}