import PlantDisplay from "../PlantDisplay"
import PetMessage from "../PetMessage"
import IconButton from "../IconButton"

export default function MainDashboard({
  identity,
  message,
  plantStage,
  dailyMood,
  isSleeping,
  isPlaying,
  needs,
  onDrink,
  onFeed,
  onSleep,
  onPlay,
  onOpenGames,
  onOpenJournal,
  onOpenTracker,
  onOpenCalendar,
  joyPoints,
  dateString,
  timeString,
  joyLevel,
  joyProgress,
}) {
  return (
    <div className="dashboard">

      {/* 🔝 Top bar */}
      <div className="top-icons">
        <button className="floating-btn" onClick={onOpenJournal}>
          📖
        </button>

        <div className="joy-display">
  <div style={{ position: "relative", width: 50, height: 50 }}>
    
    <svg width="50" height="50">
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#eee"
        strokeWidth="4"
        fill="none"
      />
      <circle
        cx="25"
        cy="25"
        r="20"
        stroke="#FFD54F"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * 20}
        strokeDashoffset={
          2 * Math.PI * 20 - (joyProgress / 100) * (2 * Math.PI * 20)
        }
        style={{
          transition: "stroke-dashoffset 0.4s ease"
        }}
      />
    </svg>

    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: "bold"
      }}
    >
      {joyLevel}
    </div>
  </div>
</div>
      </div>

      {/* 🔥 FECHA NUEVA (sin inline styles) */}
      <div className="top-date">
        <div>{dateString}</div>
        <div>{timeString}</div>
      </div>

      {/* 🌱 Mascota */}
      <div className="pet-section">
        <PetMessage text={`${message}, ${identity?.name || ""}`} />

        <PlantDisplay
          stage={plantStage}
          sleeping={isSleeping}
          playing={isPlaying}
          personality={dailyMood}
        />
      </div>

      {/* 🎮 Acciones */}
      <div className="actions">
        <IconButton icon="💧" onClick={onDrink} value={needs.water} />
        <IconButton icon="🍎" onClick={onFeed} value={needs.food} />
        <IconButton icon="💤" onClick={onSleep} value={needs.energy} />
        <IconButton icon="🎾" onClick={onPlay} value={needs.social} />
      </div>

      {/* ⬇️ Navegación */}
      <div
        className="bottom-actions"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
          marginTop: "10px"
        }}
      >
        <button className="floating-btn" onClick={onOpenTracker}>
          🔢
        </button>

        <button className="floating-btn" onClick={onOpenGames}>
          🎮
        </button>

        <button className="floating-btn" onClick={onOpenCalendar}>
          📅
        </button>
      </div>
    </div>
  )
}