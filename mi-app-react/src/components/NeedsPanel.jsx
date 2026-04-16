export default function NeedsPanel({ needs }) {
  return (
    <div className="needs-panel">
      {Object.entries(needs).map(([key, value]) => (
        <div key={key} className="need-item">
          <span>{key}</span>

          <div className="bar">
            <div 
              className="fill"
              style={{ width: `${value}%` }}
            />
          </div>

        </div>
      ))}
    </div>
  )
}