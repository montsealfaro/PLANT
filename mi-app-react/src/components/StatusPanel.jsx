export default function StatusPanel({ plantStage }) {
  const messages = {
    happy: "Tu planta está feliz 🌱",
    ok: "Tu planta está estable 🙂",
    sad: "Tu planta está triste 🥀",
    wilted: "Tu planta está marchita 💀"
  }

  return (
    <div className="status-panel">
      <p>{messages[plantStage]}</p>
    </div>
  )
}