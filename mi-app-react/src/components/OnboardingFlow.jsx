import { useState } from "react"
import '../styles/onboarding.css'

const EMOTIONS = [
  "alegría", "tristeza", "apatía", "enfado",
  "paranoia", "disgusto", "nostalgia", "envidia"
]

const COLORS = [
  "azul", "rojo", "verde", "amarillo",
  "lila", "rosa", "celeste", "arcoiris"
]

export default function OnboardingFlow({ onFinish, mode = "setup" }) {
  const [step, setStep] = useState(0)

  const [data, setData] = useState({
    mood: "",
    color: "",
    name: ""
  })

  const next = () => setStep(step + 1)

  return (
    <div className="onboarding">

      {/* STEP 0 */}
      {step === 0 && (
        <div className="card fade">
          <h2>Hola 👋 ¿Cómo estás?</h2>

          <div className="options">
            <button className="onboarding-button" onClick={next}>Bien!</button>
            <button className="onboarding-button" onClick={next}>Prefiero no decirlo...</button>
          </div>
        </div>
      )}

      {/* STEP 1 - EMOCIÓN */}
      {step === 1 && (
        <div className="card fade">
          <h2>¿Qué emoción te representa?</h2>

          <div className="grid">
            {EMOTIONS.map(e => (
              <button
                className="onboarding-button"
                key={e}
                onClick={() => {
                  if (mode === "daily") {
                    onFinish({ personality: e })
                  } else {
                    setData({ ...data, mood: e })
                    next()
                  }
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2 - COLOR (solo setup) */}
      {mode === "setup" && step === 2 && (
        <div className="card fade">
          <h2>Elegí un color</h2>

          <div className="grid">
            {COLORS.map(c => (
              <button
                className="onboarding-button"
                key={c}
                onClick={() => {
                  setData({ ...data, color: c })
                  next()
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 - NOMBRE (solo setup) */}
      {mode === "setup" && step === 3 && (
        <div className="card fade">
          <h2>¿Cómo querés llamarla?</h2>

          <input
            className="onboarding-button"
            placeholder="Nombre"
            value={data.name}
            onChange={e =>
              setData({ ...data, name: e.target.value })
            }
          />

          <button
            className="onboarding-button"
            onClick={() =>
              onFinish({
                name: data.name,
                personality: data.mood,
                color: data.color
              })
            }
          >
            Crear mascota
          </button>
        </div>
      )}

    </div>
  )
}