import { useEffect, useState } from "react"
import useDailyHistory from "../../hooks/useDailyHistory"

const DAILY_TRACKERS = [
  { key: "water", label: "Agua", icon: "💧", goal: 2000, unit: "ml", step: 400 },
  { key: "walk", label: "Caminar", icon: "🚶", goal: 6000, unit: "pasos", step: 1200 },
  { key: "food", label: "Comer", icon: "🍎", goal: 2000, unit: "kcal", step: 400 },
  { key: "sleep", label: "Dormir", icon: "💤", goal: 8, unit: "hs", step: 1.6 }
]

const STORAGE_KEY = "daily_trackers"

const MOTIVATION_MESSAGES = [
  "Hoy cumpliste contigo. Eso importa.",
  "Tu disciplina construye tu bienestar.",
  "Pequeñas acciones, grandes cambios.",
  "Cada meta cumplida fortalece tu energía.",
  "Lo que haces hoy mejora tu mañana."
]

function getTodayDate() {
  return new Date().toISOString().split("T")[0]
}

function createDefaultData() {
  return {
    date: getTodayDate(),
    progress: {
      water: 0,
      walk: 0,
      food: 0,
      sleep: 0
    },
    celebrated: false
  }
}

function loadTrackers() {
  const saved = localStorage.getItem(STORAGE_KEY)

  if (!saved) return createDefaultData()

  const parsed = JSON.parse(saved)

  if (parsed.date !== getTodayDate()) {
    return createDefaultData()
  }

  return parsed
}

export default function TrackerMenu({ onClose }) {
  const [trackerData, setTrackerData] = useState(loadTrackers())
  const [showCelebration, setShowCelebration] = useState(false)
  const [motivation] = useState(
    MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)]
  )

  // 🔥 NUEVO: hook de historial
  const { saveDailyEntry } = useDailyHistory()

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerData))
  }, [trackerData])

  // 🔥 NUEVO: guardar progreso en historial global
  useEffect(() => {
    saveDailyEntry({
      trackers: trackerData.progress
    })
  }, [trackerData])

  useEffect(() => {
    const completed = DAILY_TRACKERS.every(
      (tracker) => trackerData.progress[tracker.key] >= tracker.goal
    )

    if (completed && !trackerData.celebrated) {
      setShowCelebration(true)

      setTrackerData((prev) => ({
        ...prev,
        celebrated: true
      }))
    }
  }, [trackerData])

  const recharge = (tracker) => {
    if (showCelebration) return

    setTrackerData((prev) => ({
      ...prev,
      progress: {
        ...prev.progress,
        [tracker.key]: Math.min(
          prev.progress[tracker.key] + tracker.step,
          tracker.goal
        )
      }
    }))
  }

  if (showCelebration) {
    return (
      <div
        style={{
          background: "linear-gradient(180deg, #9be7ff, #d8f8ff)",
          minHeight: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "24px"
        }}
      >
        <div
          style={{
            fontSize: "72px",
            animation: "pulse 1.2s infinite"
          }}
        >
          ✨🏆✨
        </div>

        <h1 style={{ marginTop: "20px" }}>¡Objetivos Completados!</h1>

        <p
          style={{
            maxWidth: "300px",
            fontSize: "18px",
            marginTop: "12px"
          }}
        >
          {motivation}
        </p>

        <button
          onClick={() => {
            setShowCelebration(false)
            onClose()
          }}
          style={{
            marginTop: "24px",
            padding: "12px 24px",
            borderRadius: "16px",
            border: "none",
            background: "white",
            fontWeight: "bold"
          }}
        >
          Continuar
        </button>

        <style>
          {`
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.15); }
              100% { transform: scale(1); }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <div
      style={{
        background: "#bdefff",
        minHeight: "100%",
        padding: "20px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
        Objetivos del día
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
          maxWidth: "380px",
          margin: "0 auto"
        }}
      >
        {DAILY_TRACKERS.map((tracker) => {
          const current = trackerData.progress[tracker.key]
          const percent = Math.round((current / tracker.goal) * 100)
          const angle = (percent / 100) * 360
          const glow = (percent / 100) * 25

          return (
            <div
              key={tracker.key}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "16px",
                textAlign: "center",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
              }}
            >
              <div
                onClick={() => recharge(tracker)}
                style={{
                  width: "95px",
                  height: "95px",
                  margin: "0 auto 12px",
                  borderRadius: "50%",
                  background: `conic-gradient(#4cc9f0 ${angle}deg, #e9f7fb ${angle}deg)`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: `0 0 ${glow}px rgba(76, 201, 240, 0.9)`,
                  transition: "all 0.3s ease"
                }}
              >
                <div
                  style={{
                    width: "68px",
                    height: "68px",
                    borderRadius: "50%",
                    background: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px"
                  }}
                >
                  {tracker.icon}
                </div>
              </div>

              <div style={{ fontWeight: "bold" }}>{tracker.label}</div>
              <div>{current} / {tracker.goal} {tracker.unit}</div>
              <div>{percent}%</div>
            </div>
          )
        })}
      </div>

      <button
        onClick={onClose}
        style={{
          marginTop: "28px",
          width: "100%",
          maxWidth: "380px",
          alignSelf: "center",
          padding: "12px",
          borderRadius: "16px",
          border: "none",
          background: "white",
          fontWeight: "bold"
        }}
      >
        Cerrar
      </button>
    </div>
  )
}