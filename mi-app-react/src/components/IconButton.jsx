import { useEffect, useState } from "react"

export default function IconButton({ icon, onClick, value }) {
  const size = 64
  const strokeBg = 10
  const strokeProgress = 14

  const radius = 24
  const center = size / 2
  const circumference = 2 * Math.PI * radius

  // clamp
  const safeValue = Math.max(0, Math.min(100, value))

  // mínimo visible
  const visibleValue = safeValue === 0 ? 3 : safeValue
  const offset = circumference - (visibleValue / 100) * circumference

  // 🎨 gradiente
  function getGradient(val) {
    if (val > 70) return ["#4caf50", "#b2ff59"]
    if (val > 30) return ["#ff9800", "#ffd180"]
    return ["#f44336", "#ff8a80"]
  }

  const [start, end] = getGradient(safeValue)

  // estados
  const isDead = safeValue === 0
  const isLow = safeValue > 0 && safeValue < 30
  const isMedium = safeValue >= 30 && safeValue < 70

  // 🔥 estado de colapso
  const [isDying, setIsDying] = useState(false)

  useEffect(() => {
    if (safeValue === 0) {
      setIsDying(true)

      const t = setTimeout(() => {
        setIsDying(false)
      }, 700)

      return () => clearTimeout(t)
    }
  }, [safeValue])

  return (
    <div
      className={`icon-wrapper
        ${isDying ? "dying" : ""}
        ${isDead ? "dead" : isLow ? "danger" : isMedium ? "warning" : ""}
      `}
    >
      <svg width={size} height={size} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`grad-${icon}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={start}>
              <animate
                attributeName="offset"
                values="-1; 1"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>

            <stop offset="100%" stopColor={end}>
              <animate
                attributeName="offset"
                values="0; 2"
                dur="10s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>

        {/* fondo */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth={strokeBg}
          fill="transparent"
        />

        {/* progreso */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#grad-${icon})`}
          strokeWidth={strokeProgress}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
          className="progress-ring"
        />
      </svg>

      <button className="icon-button" onClick={onClick}>
        {icon}
      </button>
    </div>
  )
}