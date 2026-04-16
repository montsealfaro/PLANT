export default function Enemy({ x, y, width, height }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        background: "#ff4d4d",
        borderRadius: "50%"
      }}
    />
  )
}