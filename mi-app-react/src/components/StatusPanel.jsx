export default function StatusPanel({ hours }) {
  const rounded = Math.floor(hours * 10) / 10

  function getMessage() {
    if (hours <= 2) return "Tu planta está feliz 🌱"
    if (hours <= 5) return "Tu planta tiene un poco de sed 💧"
    if (hours <= 8) return "Tu planta se está debilitando… 🥀"
    return "Tu planta se está marchitando. Necesita agua ahora 💀"
  }

  return (
    <div className="status-panel">
      <p>{getMessage()}</p>
      <small>Horas sin agua: {rounded}</small>
    </div>
  )
}
