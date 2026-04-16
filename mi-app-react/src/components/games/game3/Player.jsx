export default function Player({ x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 20,
        height: 20,
        background: "lime",
        left: x,
        top: y,
        borderRadius: 6,
        boxShadow: "0 0 10px lime"
      }}
    />
  )
}