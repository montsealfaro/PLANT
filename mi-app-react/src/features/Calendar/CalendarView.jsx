import { useState } from "react"
import useDailyHistory from "../../hooks/useDailyHistory"

function getMoodLevel(mood) {
  if (!mood) return 0

  const map = {
    muy_mal: 1,
    mal: 2,
    neutro: 3,
    bien: 4,
    muy_bien: 5
  }

  return map[mood] || 0
}

function getMonthDays(year, month) {
  const date = new Date(year, month, 1)
  const days = []

  while (date.getMonth() === month) {
    days.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return days
}

export default function CalendarView({ onClose }) {
  const { history } = useDailyHistory()

  const today = new Date()
  const todayKey = today.toISOString().split("T")[0]

  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)

  const [direction, setDirection] = useState(0)
  const [touchStartX, setTouchStartX] = useState(null)

  const days = getMonthDays(currentYear, currentMonth)

  const firstDay = new Date(currentYear, currentMonth, 1).getDay()
  const offset = (firstDay + 6) % 7

  const formatDate = (date) =>
    date.toISOString().split("T")[0]

  const changeMonth = (dir) => {
    setDirection(dir)

    const newMonth = currentMonth + dir

    if (newMonth < 0) {
      setCurrentMonth(11)
      setCurrentYear((y) => y - 1)
    } else if (newMonth > 11) {
      setCurrentMonth(0)
      setCurrentYear((y) => y + 1)
    } else {
      setCurrentMonth(newMonth)
    }
  }

  const weekDays = ["L", "M", "M", "J", "V", "S", "D"]

  return (
    <div
      className={`calendar-container ${
        selectedDate ? "show-detail" : ""
      }`}
      style={{
        maxWidth: "390px",
        margin: "0 auto",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
      }}
      onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (!touchStartX) return

        const deltaX = e.changedTouches[0].clientX - touchStartX

        if (deltaX > 50) changeMonth(-1)
        if (deltaX < -50) changeMonth(1)

        setTouchStartX(null)
      }}
    >

      {/* 🟡 CALENDAR VIEW */}
      <div className={`calendar-view slide-${direction}`} style={{ flex: 1 }}>

        {/* HEADER */}
        <div className="calendar-header" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px"
        }}>
          <button onClick={() => changeMonth(-1)}>←</button>

          <h2 style={{ textAlign: "center", flex: 1 }}>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric"
            })}
          </h2>

          <button onClick={() => changeMonth(1)}>→</button>
        </div>

        {/* WEEK */}
        <div className="calendar-week" style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          marginBottom: "10px",
          textAlign: "center",
          fontWeight: "600",
          opacity: 0.6
        }}>
          {weekDays.map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        {/* GRID */}
        <div className="calendar-grid">
          {Array.from({ length: offset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}

          {days.map((date) => {
            const key = formatDate(date)
            const data = history[key]
            const mood = data?.mood

            return (
              <div
                key={key}
                className={`calendar-day 
                  ${selectedDate === key ? "selected" : ""} 
                  ${data ? "has-data" : ""} 
                  ${mood ? `mood-${mood}` : ""}
                  ${key === todayKey ? "today" : ""}
                `}
                onClick={() => setSelectedDate(key)}
              >
                {date.getDate()}
              </div>
            )
          })}
        </div>

        {/* 🟢 MOOD HEATMAP (CORRECTO LUGAR) */}
        <div
          className="mood-heatmap"
          style={{
            marginTop: "16px",
            padding: "10px", // antes 12
            borderRadius: "14px",
            background: "rgba(0,0,0,0.05)",
            transform: "scale(0.9)", // 🔥 reducción 10%
            transformOrigin: "top center"
            }}
        >
          <div style={{ marginBottom: "8px", fontWeight: "600" }}>
            Tu bienestar este mes
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px"
          }}>
            {days.map((date) => {
              const key = formatDate(date)
              const mood = history[key]?.mood
              const level = getMoodLevel(mood)

              return (
                <div
                  key={`heat-${key}`}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "6px",
                    background:
                      level === 0
                        ? "rgba(0,0,0,0.08)"
                        : `var(--mood-${level})`,
                    opacity: level === 0 ? 0.3 : 1
                  }}
                />
              )
            })}
          </div>
        </div>

        <button
            className="calendar-close"
            onClick={onClose}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px auto 0",
                fontSize: "20px"
            }}
            >
            ✕
        </button>
      </div>

      {/* 🔵 DETAIL VIEW */}
      {selectedDate && (
        <div className="calendar-detail-view">

          <button
            className="calendar-back"
            onClick={() => setSelectedDate(null)}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px auto 0",
                fontSize: "20px"
            }}
          >
            ←
          </button>

          <h2>{selectedDate}</h2>

          <p style={{ textAlign: "center", opacity: 0.6, fontSize: "13px" }}>
            Abriste la app {history[selectedDate]?.opens || 0} veces
          </p>

          <div className="timeline">

            <div className="timeline-item">
              <div className="timeline-card">
                <div className="timeline-title">📈 Actividad</div>
                <div className="timeline-text">
                  Abriste la app {history[selectedDate]?.opens || 0} veces
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card mood">
                <div className="timeline-title">🧠 Estado emocional</div>

                <div className="timeline-text">
                  {history[selectedDate]?.mood || "sin registro"}
                </div>

                {history[selectedDate]?.moodHistory?.length > 1 && (
                  <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.6 }}>
                    {history[selectedDate].moodHistory.map((m, i) => (
                      <div key={i}>• {m.mood}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card habits">
                <div className="timeline-title">📊 Hábitos</div>
                <div className="timeline-text">
                  💧 {history[selectedDate]?.trackers?.water || 0} ml<br/>
                  🚶 {history[selectedDate]?.trackers?.walk || 0} pasos<br/>
                  🍎 {history[selectedDate]?.trackers?.food || 0} kcal<br/>
                  💤 {history[selectedDate]?.trackers?.sleep || 0} hs
                </div>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-card reflection">
                <div className="timeline-title">📖 Reflexión</div>
                <div className="timeline-text">
                  {history[selectedDate]?.journal?.result === "positive"
                    ? "Día alineado con vos"
                    : history[selectedDate]?.journal
                    ? "Necesitás volver a vos"
                    : "sin registro"}
                </div>
              </div>
            </div>

          </div>

          <button
            className="calendar-close"
            onClick={onClose}
            style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "16px auto 0",
                fontSize: "20px"
            }}
            >
            ✕
        </button>
        </div>
      )}

    </div>
  )
}