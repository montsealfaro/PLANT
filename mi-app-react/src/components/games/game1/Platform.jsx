export default function Platform({ x, y, width, height, type }) {
  let color = "#654321"

  if (type === "moving") color = "#3498db"
  if (type === "falling") color = "#e74c3c"

  return (
    <div style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      background: color,
      borderRadius: 6,
      border: type === "falling" ? "2px dashed white" : "none",
      transition: type === "moving" ? "transform 0.1s linear" : "none"
    }} />
  )
}