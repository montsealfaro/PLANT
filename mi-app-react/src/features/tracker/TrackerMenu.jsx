import { useEffect, useState, useRef } from "react"
import useDailyHistory from "../../hooks/useDailyHistory"

const DAILY_TRACKERS = [
  {
    key: "water",
    label: "Agua",
    icon: "💧",
    goal: 2000,
    unit: "ml",
    step: 250,
    color: "#8fb3ff",
    gradient: "linear-gradient(135deg,#dce8ff,#bfd1ff)"
  },
  {
    key: "walk",
    label: "Caminar",
    icon: "🚶",
    goal: 6000,
    unit: "pasos",
    step: 1000,
    color: "#f0b16d",
    gradient: "linear-gradient(135deg,#ffe5c7,#ffd29d)"
  },
  {
    key: "food",
    label: "Comer",
    icon: "🍎",
    goal: 2000,
    unit: "kcal",
    step: 100,
    color: "#9acb5b",
    gradient: "linear-gradient(135deg,#e0f0c1,#d1e9a6)"
  },
  {
    key: "sleep",
    label: "Dormir",
    icon: "💤",
    goal: 8,
    unit: "hs",
    step: 0.5,
    color: "#d59bd0",
    gradient: "linear-gradient(135deg,#f0d9ec,#e4bee0)"
  }
]

const STORAGE_KEY = "daily_trackers"
const VITALITY_KEY = "pet_vitality"
const HISTORY_KEY = "daily_history"

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

  const saved =
    localStorage.getItem(STORAGE_KEY)

  if (!saved)
    return createDefaultData()

  const parsed =
    JSON.parse(saved)

  if (
    parsed.date !== getTodayDate()
  ) {
    return createDefaultData()
  }

  return parsed
}

function loadVitality() {
  return Number(
    localStorage.getItem(VITALITY_KEY) || 0
  )
}

function Heatmap({
  history,
  getIntensity,
  selectedDay,
  setSelectedDay
}) {

  function getColor(intensity) {

    if (!intensity || intensity === 0)
      return "rgba(0,0,0,0.08)"

    if (intensity <= 0.25)
      return "#e74c3c"

    if (intensity <= 0.5)
      return "#f39c12"

    if (intensity <= 0.75)
      return "#cddc39"

    return "#4caf50"
  }

  function getFullMonthGrid() {

    const now = new Date()

    const year =
      now.getFullYear()

    const month =
      now.getMonth()

    const firstDay =
      new Date(year, month, 1)

    const lastDay =
      new Date(year, month + 1, 0)

    const days = []

    const startOffset =
      (firstDay.getDay() + 6) % 7

    for (
      let i = 0;
      i < startOffset;
      i++
    ) {
      days.push(null)
    }

    for (
      let d = 1;
      d <= lastDay.getDate();
      d++
    ) {

      const date =
        new Date(year, month, d)

      const key =
        date.toISOString().split("T")[0]

      days.push(key)
    }

    return days
  }

  const todayKey =
    new Date().toISOString().split("T")[0]

  const gridDays =
    getFullMonthGrid()

  return (

    <div
      style={{
        marginTop: "24px",
        padding: "16px",
        borderRadius: "24px",
        background: "rgba(0,0,0,0.05)"
      }}
    >

      <div
        style={{
          marginBottom: "12px",
          fontWeight: "700",
          fontSize: "18px"
        }}
      >
        Tu bienestar este mes
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(7, 1fr)",
          gap: "8px"
        }}
      >

        {gridDays.map((day, i) => {

          if (!day)
            return (
              <div key={`empty-${i}`} />
            )

          const intensity =
            getIntensity(
              history[day] || {}
            )

          const color =
            getColor(intensity)

          const isSelected =
            selectedDay === day

          const isToday =
            day === todayKey

          const hasData =
            !!history[day]

          return (

            <div
              key={day}
              onClick={() =>
                hasData &&
                setSelectedDay(day)
              }
              style={{
                width: "100%",
                aspectRatio: "1",
                borderRadius: "12px",
                background: color,

                cursor:
                  hasData
                    ? "pointer"
                    : "default",

                boxShadow:
                  isToday
                    ? "0 0 0 2px #4da6ff inset"
                    : isSelected
                    ? "0 4px 12px rgba(0,0,0,0.2)"
                    : "none",

                outline:
                  isSelected
                    ? "2px solid #222"
                    : "none",

                transform:
                  isSelected
                    ? "scale(1.08)"
                    : isToday
                    ? "scale(1.03)"
                    : "scale(1)",

                transition:
                  "all 0.18s cubic-bezier(0.22,1,0.36,1)",

                opacity:
                  hasData
                    ? 1
                    : 0.4
              }}
            />

          )
        })}
      </div>
    </div>
  )
}

export default function TrackerMenu({
  onClose
}) {

  const [trackerData, setTrackerData] =
    useState(loadTrackers())

  const [vitality, setVitality] =
    useState(loadVitality())

  const [history, setHistory] =
    useState({})

  const [selectedDay, setSelectedDay] =
    useState(null)

  // 🔥 ARREGLADO
  const [
    selectedTracker,
    setSelectedTracker
  ] = useState(null)

  const [showCalendar, setShowCalendar] =
    useState(false)

  const [currentMonth, setCurrentMonth] =
    useState(new Date())

  const detailRef = useRef(null)

  const { saveDailyEntry } =
    useDailyHistory()

  useEffect(() => {

    const saved =
      localStorage.getItem(HISTORY_KEY)

    if (saved) {
      setHistory(JSON.parse(saved))
    }

  }, [])

  useEffect(() => {

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(trackerData)
    )

  }, [trackerData])

  useEffect(() => {

    localStorage.setItem(
      VITALITY_KEY,
      vitality
    )

  }, [vitality])

  useEffect(() => {

    const today =
      getTodayDate()

    const newHistory = {
      ...history,
      [today]:
        trackerData.progress
    }

    setHistory(newHistory)

    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(newHistory)
    )

    saveDailyEntry({
      trackers:
        trackerData.progress
    })

  }, [trackerData])

  // 🔥 SCROLL iPHONE
  useEffect(() => {

    if (
      selectedDay &&
      detailRef.current
    ) {

      setTimeout(() => {

        detailRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })

      }, 100)
    }

  }, [selectedDay])

  // 🔥 NUEVO
  function updateTracker(
    tracker,
    value
  ) {

    setTrackerData((prev) => ({

      ...prev,

      progress: {

        ...prev.progress,

        [tracker.key]:
          Math.min(
            Math.max(value, 0),
            tracker.goal
          )

      }

    }))
  }

  const getIntensity = (
    dayData
  ) => {

    const total =
      Object.values(dayData || {})
        .reduce((a, b) => a + b, 0)

    const max =
      2000 + 6000 + 2000 + 8

    return total / max
  }

  function getDayFeedback(
    dayData
  ) {

    const total =
      Object.values(dayData || {})
        .reduce((a, b) => a + b, 0)

    const max =
      2000 + 6000 + 2000 + 8

    const ratio =
      total / max

    if (ratio === 0) {
      return {
        text:
          "No hay registros para este día",
        color: "#999"
      }
    }

    if (ratio <= 0.25) {
      return {
        text:
          "Día muy bajo — tu cuerpo quedó bastante desatendido",
        color: "#e74c3c"
      }
    }

    if (ratio <= 0.5) {
      return {
        text:
          "Día flojo — hiciste algo, pero te faltó sostenerlo",
        color: "#f39c12"
      }
    }

    if (ratio <= 0.75) {
      return {
        text:
          "Buen día — estuviste bastante presente con vos",
        color: "#cddc39"
      }
    }

    return {
      text:
        "Muy buen día — te cuidaste de forma consistente",
      color: "#4caf50"
    }
  }

  
  return (

  <div
    style={{
      background: "#f3eee9",
      width: "100%",
      height: "100vh",
      overflow: "hidden",
      position: "relative"
    }}
  >

    {/* SCROLL CONTAINER */}
    <div
      style={{
        height: "100%",
        overflowY: "scroll",
        overflowX: "hidden",

        // 🔥 scroll iPhone
        WebkitOverflowScrolling: "touch",

        padding: "24px",
        paddingBottom: "120px",
        boxSizing: "border-box"
      }}
    >

      {/* CLOSE */}
      <div
        onClick={onClose}
        style={{
          position: "sticky",
          top: "0",
          marginLeft: "auto",

          width: "46px",
          height: "46px",

          borderRadius: "50%",

          background: "#dcd6cf",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          fontSize: "20px",

          cursor: "pointer",

          zIndex: 20
        }}
      >
        ✕
      </div>

      <div
        style={{
          maxWidth: "390px",
          margin: "0 auto"
        }}
      >

        <h2
          style={{
            fontSize: "42px",
            lineHeight: 1,
            marginBottom: "28px",
            fontWeight: "700",
            color: "#171717"
          }}
        >
          Tu progreso
        </h2>

        {/* TRACKERS */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px"
          }}
        >

          {DAILY_TRACKERS.map(
            (tracker) => {

            const current =
              trackerData.progress[
                tracker.key
              ]

            const totalUnits =
              Math.ceil(
                tracker.goal /
                tracker.step
              )

            const activeUnits =
              Math.floor(
                current /
                tracker.step
              )

            const remaining =
              Math.max(
                tracker.goal -
                current,
                0
              )

            const percent =
              Math.round(
                (current /
                  tracker.goal) * 100
              )

            return (

              <div
                key={tracker.key}
                style={{
                  background:
                    "#ebe4db",

                  borderRadius:
                    "34px",

                  padding: "22px",

                  boxShadow:
                    "0 10px 28px rgba(0,0,0,.05)"
                }}
              >

                {/* HEADER */}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",

                    marginBottom:
                      "14px"
                  }}
                >

                  <div>

                    <div
                      style={{
                        fontSize:
                          "14px",

                        color:
                          "#666",

                        marginBottom:
                          "8px"
                      }}
                    >
                      {tracker.label}
                      {" "}
                      tracking
                    </div>

                    <div
                      style={{
                        fontSize:
                          "42px",

                        fontWeight:
                          "700",

                        lineHeight:
                          1
                      }}
                    >

                      {current}

                      <span
                        style={{
                          fontSize:
                            "20px",

                          opacity:
                            0.55,

                          marginLeft:
                            "6px"
                        }}
                      >
                        de{" "}
                        {tracker.goal}
                        {" "}
                        {tracker.unit}
                      </span>

                    </div>

                  </div>

                  <div
                    style={{
                      width: "56px",
                      height: "56px",

                      borderRadius:
                        "50%",

                      background:
                        "#d8d2cb",

                      display: "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      fontSize:
                        "26px"
                    }}
                  >
                    {tracker.icon}
                  </div>

                </div>

                {/* DESCRIPTION */}

                <div
                  style={{
                    fontSize: "15px",

                    lineHeight:
                      1.5,

                    color: "#666",

                    marginBottom:
                      "22px"
                  }}
                >

                  Te faltan{" "}

                  <strong>
                    {remaining}
                    {" "}
                    {tracker.unit}
                  </strong>

                  {" "}
                  para completar tu meta diaria.

                </div>

                {/* BUTTON GRID */}

                <div
                  style={{
                    display: "grid",

                    gridTemplateColumns:
                      "repeat(5,1fr)",

                    gap: "12px",

                    marginBottom:
                      "22px"
                  }}
                >

                  {Array.from({
                    length:
                      totalUnits
                  }).map((_, i) => {

                    const active =
                      i <
                      activeUnits

                    return (

                      <button
                        key={i}

                        onClick={() => {

                          const value =
                            active
                              ? i *
                                tracker.step
                              : (i + 1) *
                                tracker.step

                          updateTracker(
                            tracker,
                            value
                          )
                        }}

                        style={{
                          width: "58px",
                          height: "58px",

                          borderRadius:
                            "50%",

                          border: "none",

                          background:
                            active
                              ? tracker.color
                              : "#d8d2cb",

                          color:
                            active
                              ? "#fff"
                              : "#444",

                          fontSize:
                            "22px",

                          cursor:
                            "pointer",

                          transition:
                            "all .18s ease",

                          transform:
                            active
                              ? "scale(1.06)"
                              : "scale(1)"
                        }}
                      >

                        {active
                          ? tracker.icon
                          : "+"}

                      </button>

                    )
                  })}
                </div>

                {/* BOTTOM CARD */}

                <div
                  style={{
                    background:
                      tracker.gradient,

                    borderRadius:
                      "24px",

                    padding:
                      "18px"
                  }}
                >

                  <div
                    style={{
                      fontWeight:
                        "700",

                      fontSize:
                        "20px",

                      marginBottom:
                        "16px"
                    }}
                  >
                    Meta diaria:
                    {" "}
                    {tracker.goal}
                    {" "}
                    {tracker.unit}
                  </div>

                  <div
                    style={{
                      display: "flex",

                      justifyContent:
                        "space-between",

                      marginBottom:
                        "18px"
                    }}
                  >

                    <div>
                      <strong>
                        {current}
                      </strong>

                      <div
                        style={{
                          fontSize:
                            "11px",

                          opacity:
                            .6
                        }}
                      >
                        ACTUAL
                      </div>
                    </div>

                    <div>
                      <strong>
                        {remaining}
                      </strong>

                      <div
                        style={{
                          fontSize:
                            "11px",

                          opacity:
                            .6
                        }}
                      >
                        RESTANTE
                      </div>
                    </div>

                    <div>
                      <strong>
                        {percent}%
                      </strong>

                      <div
                        style={{
                          fontSize:
                            "11px",

                          opacity:
                            .6
                        }}
                      >
                        PROGRESO
                      </div>
                    </div>

                  </div>

                  <button
                    onClick={() =>
                      setSelectedTracker(
                        selectedTracker ===
                        tracker.key
                          ? null
                          : tracker.key
                      )
                    }

                    style={{
                      width: "100%",

                      border: "none",

                      background:
                        "#111",

                      color:
                        "white",

                      borderRadius:
                        "18px",

                      padding:
                        "14px",

                      fontWeight:
                        "600",

                      cursor:
                        "pointer",

                      fontSize:
                        "15px"
                    }}
                  >
                    Ajustar progreso
                  </button>

                </div>

                {/* THIRD SHEET */}

                {selectedTracker ===
                  tracker.key && (

                  <div
                    style={{
                      marginTop:
                        "18px",

                      background:
                        "#f6f2ed",

                      borderRadius:
                        "24px",

                      padding:
                        "18px",

                      border:
                        "1px solid rgba(0,0,0,0.05)"
                    }}
                  >

                    <div
                      style={{
                        fontWeight:
                          "700",

                        fontSize:
                          "18px",

                        marginBottom:
                          "16px"
                      }}
                    >
                      Ajustar progreso
                    </div>

                    <input
                      type="range"

                      min={0}

                      max={
                        tracker.goal
                      }

                      step={
                        tracker.step
                      }

                      value={current}

                      onChange={(e) =>
                        updateTracker(
                          tracker,
                          Number(
                            e.target
                              .value
                          )
                        )
                      }

                      style={{
                        width:
                          "100%",

                        marginBottom:
                          "18px"
                      }}
                    />

                    <div
                      style={{
                        display:
                          "flex",

                        justifyContent:
                          "space-between",

                        alignItems:
                          "center"
                      }}
                    >

                      <button
                        onClick={() =>
                          updateTracker(
                            tracker,

                            Math.max(
                              current -
                                tracker.step,

                              0
                            )
                          )
                        }

                        style={{
                          width:
                            "52px",

                          height:
                            "52px",

                          borderRadius:
                            "50%",

                          border:
                            "none",

                          background:
                            "#ddd6cf",

                          fontSize:
                            "24px",

                          cursor:
                            "pointer"
                        }}
                      >
                        −
                      </button>

                      <div
                        style={{
                          fontSize:
                            "28px",

                          fontWeight:
                            "700"
                        }}
                      >
                        {current}
                        {" "}

                        <span
                          style={{
                            fontSize:
                              "16px",

                            opacity:
                              .5
                          }}
                        >
                          {
                            tracker.unit
                          }
                        </span>

                      </div>

                      <button
                        onClick={() =>
                          updateTracker(
                            tracker,

                            Math.min(
                              current +
                                tracker.step,

                              tracker.goal
                            )
                          )
                        }

                        style={{
                          width:
                            "52px",

                          height:
                            "52px",

                          borderRadius:
                            "50%",

                          border:
                            "none",

                          background:
                            tracker.color,

                          color:
                            "white",

                          fontSize:
                            "24px",

                          cursor:
                            "pointer"
                        }}
                      >
                        +
                      </button>

                    </div>

                  </div>
                )}

              </div>
            )
          })}
        </div>

        {/* HEATMAP */}

        <Heatmap
          history={history}
          getIntensity={getIntensity}
          selectedDay={selectedDay}
          setSelectedDay={setSelectedDay}
        />

        {/* DETAIL */}

        {selectedDay && (

          <div
            ref={detailRef}
            style={{
              marginTop: "20px",

              background: "#fff",

              borderRadius: "26px",

              padding: "20px"
            }}
          >

            <div
              style={{
                fontWeight: "700",
                marginBottom: "14px"
              }}
            >
              {selectedDay}
            </div>

            {Object.entries(
              history[selectedDay] || {}
            ).map(([key, value]) => {

              const tracker =
                DAILY_TRACKERS.find(
                  (t) =>
                    t.key === key
                )

              return (
                <div
                  key={key}
                  style={{
                    marginBottom:
                      "6px"
                  }}
                >
                  {tracker?.label}
                  :{" "}
                  {value}
                  {" "}
                  {tracker?.unit}
                </div>
              )
            })}

            <div
              style={{
                marginTop: "18px",

                padding: "14px",

                borderRadius: "16px",

                textAlign: "center",

                color:
                  getDayFeedback(
                    history[selectedDay]
                  ).color
              }}
            >
              {
                getDayFeedback(
                  history[selectedDay]
                ).text
              }
            </div>

            <button
              onClick={() =>
                setSelectedDay(null)
              }

              style={{
                marginTop: "18px",

                width: "100%",

                padding: "14px",

                borderRadius:
                  "16px",

                border: "none",

                background:
                  "#ece7e1",

                fontWeight:
                  "600",

                cursor:
                  "pointer"
              }}
            >
              Cerrar
            </button>

          </div>
        )}

       </div>
    </div>
    </div>
  )
}