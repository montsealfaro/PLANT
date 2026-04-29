import { useState, useEffect } from "react"

import usePlant from "./hooks/usePlant"
import usePetIdentity from "./hooks/usePetIdentity"

import { PERSONALITIES } from "./config/personalities"

import OnboardingFlow from "./components/OnboardingFlow"
import MiniGamesMenu from "./components/MiniGamesMenu"
import MainDashboard from "./components/layout/MainDashboard"
import TrackerMenu from "./features/tracker/TrackerMenu"
import JournalPanel from "./components/JournalPanel"
import CalendarView from "./features/Calendar/CalendarView"

import useLocalTime from "./hooks/useLocalTime"
import useDailyHistory from "./hooks/useDailyHistory"

import useJoyPoints from "./features/JoyPoints/useJoyPoints"
import { convertScoreToJoy } from "./features/JoyPoints/joyPointRules"

export default function App() {
  const { identity, saveIdentity } = usePetIdentity()

  const [dailyMood, setDailyMood] = useState(null)
  const [showMiniGames, setShowMiniGames] = useState(false)
  const [showTracker, setShowTracker] = useState(false)
  const [showJournal, setShowJournal] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false) // 🔥 NUEVO
  const [floatingReward, setFloatingReward] = useState(null)

  const { joyPoints, addJoyPoints } = useJoyPoints()

  const { dateString, timeString } = useLocalTime()
  const { saveDailyEntry } = useDailyHistory()

  const {
    plantStage,
    message,
    needs,
    drinkWater,
    feedPet,
    sleepPet,
    playPet,
    rewardPet,
    isSleeping,
    isPlaying
  } = usePlant(dailyMood || "alegría")

// 🔥 track apertura (solo una vez)
useEffect(() => {
  saveDailyEntry({ open: true })
}, [])

// 🔥 guardar mood + historial automático
useEffect(() => {
  if (dailyMood) {
    saveDailyEntry({ mood: dailyMood })
  }
}, [dailyMood])

  const handleGameReward = (gameId, score) => {
    const joyEarned = convertScoreToJoy(gameId, score)

    if (joyEarned > 0) {
      addJoyPoints(joyEarned)
      rewardPet(gameId, score)

      // 🔥 guardar reward
      saveDailyEntry({
        games: {
          lastGame: gameId,
          lastScore: score,
          joyEarned
        }
      })

      setFloatingReward({
        type: "joy",
        amount: joyEarned
      })

      setTimeout(() => {
        setFloatingReward(null)
      }, 1500)
    }
  }

  // 🔥 NUEVA PANTALLA: CALENDARIO
  if (showCalendar) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <CalendarView onClose={() => setShowCalendar(false)} />
        </div>
      </div>
    )
  }

  if (showTracker) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <TrackerMenu onClose={() => setShowTracker(false)} />
        </div>
      </div>
    )
  }

  if (showJournal) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <JournalPanel />
          <button
            onClick={() => setShowJournal(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#205375",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "10px 15px",
              cursor: "pointer",
              zIndex: 20
            }}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  if (!identity?.name) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <OnboardingFlow
            mode="setup"
            onFinish={(data) => {
              saveIdentity(data)
              setDailyMood(data.personality)
            }}
          />
        </div>
      </div>
    )
  }

  if (!dailyMood) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <OnboardingFlow
            mode="daily"
            onFinish={(data) => setDailyMood(data.personality)}
          />
        </div>
      </div>
    )
  }

  if (showMiniGames) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <MiniGamesMenu
            onClose={() => setShowMiniGames(false)}
            onReward={handleGameReward}
          />
        </div>
      </div>
    )
  }

  const skin = PERSONALITIES?.[dailyMood] ?? {
    bg: "linear-gradient(180deg, #9be15d, #00c9ff, #ff5f6d, #a044ff)",
    textColor: "#ffffff"
  }

  return (
    <div className="phone">
      <div className="phone-screen">
        <div
          style={{
            background: skin.bg,
            color: skin.textColor,
            height: "100%",
            width: "100%",
            position: "relative"
          }}
        >
          <MainDashboard
            identity={identity}
            message={message}
            plantStage={plantStage}
            dailyMood={dailyMood}
            isSleeping={isSleeping}
            isPlaying={isPlaying}
            needs={needs}
            onDrink={drinkWater}
            onFeed={feedPet}
            onSleep={sleepPet}
            onPlay={playPet}
            onOpenGames={() => setShowMiniGames(true)}
            onOpenJournal={() => setShowJournal(true)}
            onOpenTracker={() => setShowTracker(true)}
            onOpenCalendar={() => setShowCalendar(true)} // 🔥 NUEVO
            joyPoints={joyPoints}
            dateString={dateString}
            timeString={timeString}
          />

          {floatingReward && (
            <div className="floating-reward">
              +{floatingReward.amount}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}