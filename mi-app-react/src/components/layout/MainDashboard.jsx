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
  timeString
}) {
  return (
    <div className="dashboard">

      {/* 🔝 Top bar */}
      <div className="top-icons">
        <button className="floating-btn" onClick={onOpenJournal}>
          📖
        </button>

        <div className="joy-display">
          ☀️ {joyPoints}
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