import { useEffect, useState, useRef } from "react"
import useDailyHistory from "../../hooks/useDailyHistory"

const DAILY_TRACKERS = [
  { key: "water", label: "Agua", icon: "💧", goal: 2000, unit: "ml ", step: 250 },
  { key: "walk", label: "Caminar", icon: "🚶", goal: 6000, unit: "pasos ", step: 1000 },
  { key: "food", label: "Comer", icon: "🍎", goal: 2000, unit: "kcal ", step: 100 },
  { key: "sleep", label: "Dormir", icon: "💤", goal: 8, unit: "hs ", step: 0.3 }
]

const STORAGE_KEY = "daily_trackers"
const VITALITY_KEY = "pet_vitality"
const HISTORY_KEY = "daily_history"


function Heatmap({ history, getIntensity, selectedDay, setSelectedDay }) {

  function getColor(intensity) {
    if (!intensity || intensity === 0) return "rgba(0,0,0,0.08)"

    if (intensity <= 0.25) return "#e74c3c"
    if (intensity <= 0.5) return "#f39c12"
    if (intensity <= 0.75) return "#cddc39"
    return "#4caf50"
  }

  function getFullMonthGrid() {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startOffset = (firstDay.getDay() + 6) % 7

    for (let i = 0; i < startOffset; i++) {
      days.push(null)
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d)
      const key = date.toISOString().split("T")[0]
      days.push(key)
    }

    return days
  }

  const todayKey = new Date().toISOString().split("T")[0]
  const gridDays = getFullMonthGrid()

  return (
    <div
      style={{
        marginTop: "16px",
        padding: "12px",
        borderRadius: "18px",
        background: "rgba(0,0,0,0.05)"
      }}
    >
      <div style={{ marginBottom: "8px", fontWeight: "600" }}>
        Tu bienestar este mes
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "8px"
        }}
      >
        {gridDays.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />

          const intensity = getIntensity(history[day] || {})
          const color = getColor(intensity)

          const isSelected = selectedDay === day
          const isToday = day === todayKey
          const hasData = !!history[day]

          return (
            <div
              key={`heat-${day}`}
              onClick={() => hasData && setSelectedDay(day)}
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "10px",
                background: color,
                cursor: hasData ? "pointer" : "default",

                // 🔥 HOY (anillo azul suave)
                boxShadow: isToday
                  ? "0 0 0 2px #4da6ff inset"
                  : isSelected
                  ? "0 4px 12px rgba(0,0,0,0.2)"
                  : "none",

                // 🔥 selección
                outline: isSelected ? "2px solid #222" : "none",

                // 🔥 animación tipo iOS
                transform: isSelected
                  ? "scale(1.1)"
                  : isToday
                  ? "scale(1.05)"
                  : "scale(1)",

                transition: "all 0.18s cubic-bezier(0.22, 1, 0.36, 1)",

                // 🔥 feedback táctil
                opacity: hasData ? 1 : 0.4
              }}
            />
          )
        })}
      </div>
    </div>
  )
}


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
    }
  }
}

function loadTrackers() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (!saved) return createDefaultData()

  const parsed = JSON.parse(saved)
  if (parsed.date !== getTodayDate()) return createDefaultData()

  return parsed
}

function loadVitality() {
  return Number(localStorage.getItem(VITALITY_KEY) || 0)
}

export default function TrackerMenu({ onClose }) {
  const [trackerData, setTrackerData] = useState(loadTrackers())
  const [vitality, setVitality] = useState(loadVitality())
  const [history, setHistory] = useState({})
  const [selectedDay, setSelectedDay] = useState(null)

  const [showCalendar, setShowCalendar] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const detailRef = useRef(null) // 🔥 NUEVO

  const { saveDailyEntry } = useDailyHistory()

  useEffect(() => {
    const saved = localStorage.getItem(HISTORY_KEY)
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trackerData))
  }, [trackerData])

  useEffect(() => {
    localStorage.setItem(VITALITY_KEY, vitality)
  }, [vitality])

  useEffect(() => {
    const today = getTodayDate()

    const newHistory = {
      ...history,
      [today]: trackerData.progress
    }

    setHistory(newHistory)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))

    saveDailyEntry({
      trackers: trackerData.progress
    })
  }, [trackerData])

  // 🔥 SCROLL AUTOMÁTICO AL DETALLE
  useEffect(() => {
    if (selectedDay && detailRef.current) {
      setTimeout(() => {
        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }, 100)
    }
  }, [selectedDay])

  const addAmount = (tracker, amount) => {
    setTrackerData((prev) => {
      const newValue = Math.min(
        prev.progress[tracker.key] + amount,
        tracker.goal
      )

      const gained = Math.floor((amount / tracker.goal) * 100)
      setVitality((v) => v + gained)

      return {
        ...prev,
        progress: {
          ...prev.progress,
          [tracker.key]: newValue
        }
      }
    })
  }

  const days = Object.keys(history).slice(-35)

  const getIntensity = (dayData) => {
    const total = Object.values(dayData || {}).reduce((a, b) => a + b, 0)
    const max = 2000 + 6000 + 2000 + 8
    return total / max
  }

  function getMonthDays(date) {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const days = []
    const startOffset = (firstDay.getDay() + 6) % 7

    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d))
    }

    return days
  }

  function formatDate(date) {
    return date.toISOString().split("T")[0]
  }

  function getDayFeedback(dayData) {
  const total = Object.values(dayData || {}).reduce((a, b) => a + b, 0)
  const max = 2000 + 6000 + 2000 + 8
  const ratio = total / max

  if (ratio === 0) {
    return {
      text: "No hay registros para este día",
      color: "#999"
    }
  }

  if (ratio <= 0.25) {
    return {
      text: "Día muy bajo — tu cuerpo quedó bastante desatendido",
      color: "#e74c3c"
    }
  }

  if (ratio <= 0.5) {
    return {
      text: "Día flojo — hiciste algo, pero te faltó sostenerlo",
      color: "#f39c12"
    }
  }

  if (ratio <= 0.75) {
    return {
      text: "Buen día — estuviste bastante presente con vos",
      color: "#cddc39"
    }
  }

  return {
    text: "Muy buen día — te cuidaste de forma consistente",
    color: "#4caf50"
  }
}

  return (
    <div style={{
      background: "#f3eee9",
      height: "100vh",
      overflowY: "auto",
      WebkitOverflowScrolling: "touch", // 🔥 efecto app iOS
      padding: "24px",
      position: "relative"
    }}>

      {/* CERRAR */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "44px",
          height: "44px",
          borderRadius: "50%",
          background: "#dcd6cf",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          cursor: "pointer"
        }}
      >
        ✕
      </div>

      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "600" }}>
        Tu progreso
      </h2>

      {/* BOTONES */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        maxWidth: "360px",
        margin: "0 auto 20px",
        gap: "10px"
      }}>
        {DAILY_TRACKERS.map((tracker) => (
          <button
            key={tracker.key}
            onClick={() => addAmount(tracker, tracker.step)}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              border: "none",
              background: "#e7e1da",
              fontSize: "11px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {tracker.icon}
            <div style={{ fontSize: "10px" }}>
              +{tracker.step}{tracker.unit}
            </div>
          </button>
        ))}
      </div>

      {/* BARRAS */}
      {/* (NO CAMBIÉ NADA) */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        height: "260px",
        maxWidth: "360px",
        margin: "0 auto 30px",
        gap: "14px"
      }}>
        {DAILY_TRACKERS.map((tracker) => {
          const current = trackerData.progress[tracker.key]
          const percent = Math.round((current / tracker.goal) * 100)

          return (
            <div key={tracker.key} style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flex: 1
            }}>
              <div style={{
                width: "100%",
                height: "180px",
                borderRadius: "20px",
                background: "#e6e0d9",
                position: "relative",
                overflow: "hidden"
              }}>
                <div style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: `${percent}%`,
                  borderRadius: "20px",
                  background:
                    tracker.key === "water"
                      ? "#6b4c3b"
                      : tracker.key === "walk"
                      ? "#a04a0d"
                      : tracker.key === "food"
                      ? "#8aa132"
                      : "#d27ab2",
                  transition: "height 0.3s ease"
                }} />

                <div style={{
                  position: "absolute",
                  bottom: "8px",
                  width: "100%",
                  textAlign: "center",
                  fontSize: "12px",
                  color: "white",
                  fontWeight: "600"
                }}>
                  {percent}%
                </div>
              </div>

              <div style={{ marginTop: "8px", fontSize: "12px" }}>
                {tracker.label}
              </div>
            </div>
          )
        })}
      </div>

       {/* BOTON CALENDARIO */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setShowCalendar(prev => !prev)}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: "none",
            background: "#dcd6cf",
            cursor: "pointer"
          }}
        >
          {showCalendar ? "Ocultar calendario" : "Ver calendario"}
        </button>
      </div>

      {/* CALENDARIO */}
      {showCalendar && (
        <div style={{
          maxWidth: "360px",
          margin: "0 auto 20px",
          background: "#e6e0d9",
          borderRadius: "20px",
          padding: "16px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}>
            <button onClick={() =>
              setCurrentMonth(new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1
              ))
            }>←</button>

            <strong>
              {currentMonth.toLocaleDateString("es-AR", {
                month: "long",
                year: "numeric"
              })}
            </strong>

            <button onClick={() =>
              setCurrentMonth(new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1
              ))
            }>→</button>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px"
          }}>
            {getMonthDays(currentMonth).map((date, i) => {
              if (!date) return <div key={i} />

              const key = formatDate(date)
              const hasData = history[key]

              return (
                <div
                  key={key}
                  onClick={() => setSelectedDay(key)}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "50%",
                    background: hasData ? "#ffcc00" : "#d3cec7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    fontSize: "12px"
                  }}
                >
                  {date.getDate()}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Heatmap
        history={history}
        getIntensity={getIntensity}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
      />

      {/* DETALLE CORREGIDO */}
      {selectedDay && (
        <div ref={detailRef} style={{
          marginTop: "20px",
          background: "#fff",
          padding: "16px",
          borderRadius: "16px"
        }}>
          <div>{selectedDay}</div>

          {Object.entries(history[selectedDay] || {}).map(([key, value]) => {
            const tracker = DAILY_TRACKERS.find(t => t.key === key)
            return (
              <div key={key}>
                {tracker?.label}: {value} {tracker?.unit}
              </div>
            )
          })}

          {/* 🔥 FEEDBACK BIEN INTEGRADO */}
          <div style={{
            marginTop: "12px",
            padding: "10px",
            borderRadius: "10px",
            textAlign: "center",
            color: getDayFeedback(history[selectedDay]).color
          }}>
            {getDayFeedback(history[selectedDay]).text}
          </div>

          <button onClick={() => setSelectedDay(null)} 
          style={{ 
            marginTop: "10px", 
            width: "100%", 
            padding: "10px", 
            borderRadius: "12px", 
            border: "none", 
            background: "#eee" }} > 
            Cerrar </button> 
            </div>
      )}
    </div>
  )
}
