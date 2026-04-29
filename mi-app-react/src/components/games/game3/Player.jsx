export default function Player({ x, y }) {
  return (
    <div
      style={{
        position: "absolute",
        width: 22,
        height: 22,
        left: x,
        top: y,
        borderRadius: "50%",
        background: "radial-gradient(circle at 30% 30%, #b8ffb8, #32ff7e)",
        boxShadow: `
          0 0 8px #7dffb3,
          0 0 16px #32ff7e,
          inset -3px -3px 6px rgba(0,0,0,0.15)
        `,
        border: "2px solid rgba(255,255,255,0.5)",
        zIndex: 10
      }}
    />
  )
}