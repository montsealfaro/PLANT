export default function Player({ player }) {
  return (
    <div
      style={{
        position: "absolute",
        left: player.x,
        top: player.y,
        width: player.width,
        height: player.height,
        background: player.hovering ? "#00e5ff" : "#ff69b4",
        borderRadius: "50%",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)"
      }}
    />
  )
}