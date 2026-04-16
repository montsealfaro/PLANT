export default function EnergyBar({ value }) {
  return (
    <div className="energy-bar">
      <div
        className="energy-fill"
        style={{ width: `${value}%` }}
      />
      <span className="energy-text">{Math.floor(value)}%</span>
    </div>
  )
}