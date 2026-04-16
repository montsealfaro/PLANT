import { useState } from "react"

import usePlant from "./hooks/usePlant"
import usePetIdentity from "./hooks/usePetIdentity"

import { PERSONALITIES } from "./config/personalities"

import OnboardingFlow from "./components/OnboardingFlow"
import PlantDisplay from "./components/PlantDisplay"
import StatusPanel from "./components/StatusPanel"
import IconButton from "./components/IconButton"
import PetMessage from "./components/PetMessage"
import MiniGamesMenu from "./components/MiniGamesMenu"

export default function App() {
  const { identity, saveIdentity } = usePetIdentity()

  const [dailyMood, setDailyMood] = useState(null)
  const [showMiniGames, setShowMiniGames] = useState(false)
  const [floatingReward, setFloatingReward] = useState(null)

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

  // 🧠 SETUP INICIAL
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

  // 🌤️ MOOD DIARIO
  if (!dailyMood) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <OnboardingFlow
            mode="daily"
            onFinish={(data) => {
              setDailyMood(data.personality)
            }}
          />
        </div>
      </div>
    )
  }

  // 🎮 MINIJUEGOS
  if (showMiniGames) {
    return (
      <div className="phone">
        <div className="phone-screen">
          <MiniGamesMenu
            onClose={() => setShowMiniGames(false)}
            onReward={(type, amount) => {
              rewardPet(type, amount)

              setFloatingReward({ type, amount })

              setTimeout(() => {
                setFloatingReward(null)
              }, 1500)
            }}
          />
        </div>
      </div>
    )
  }

  const skin = PERSONALITIES?.[dailyMood] ?? {
    bg: "#1a1a1a",
    textColor: "#ffffff"
  }

  const minNeed = Math.min(
    needs.water,
    needs.food,
    needs.energy,
    needs.social
  )

  const isCritical = minNeed === 0
  const isWarning = minNeed > 0 && minNeed < 30

  const icons = {
    water: "💧",
    food: "🍎",
    energy: "⚡",
    social: "❤️"
  }

  return (
    <div className="phone">
      <div className="phone-screen">
        <div
          className={`background ${
            isCritical ? "bg-dead" : isWarning ? "bg-warning" : ""
          }`}
          style={{
            background: skin.bg,
            color: skin.textColor,
            position: "relative",
            height: "100%" // 🔥 clave para layout mobile
          }}
        >
          <div className="app">

            <PetMessage text={`${message}, ${identity.name}`} />

            <PlantDisplay
              stage={plantStage}
              sleeping={isSleeping}
              playing={isPlaying}
              personality={dailyMood}
            />

            <StatusPanel plantStage={plantStage} />

            <div className="actions">
              <IconButton icon="💧" onClick={drinkWater} value={needs.water} />
              <IconButton icon="🍎" onClick={feedPet} value={needs.food} />
              <IconButton icon="💤" onClick={sleepPet} value={needs.energy} />
              <IconButton icon="🎾" onClick={playPet} value={needs.social} />
            </div>

            <button
              className="minigames-btn"
              onClick={() => setShowMiniGames(true)}
            >
              🎮
            </button>

            {floatingReward && (
              <div className="floating-reward">
                +{floatingReward.amount} {icons[floatingReward.type]}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}