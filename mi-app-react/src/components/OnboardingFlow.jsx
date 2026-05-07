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
    <div className="onboarding-overlay">

      <div className="onboarding-phone">

        <div className="onboarding-card">

          {/* STEP 0 */}
          {step === 0 && (
            <>
              <h2 className="onboarding-title">
                Hola 👋 ¿Cómo estás?
              </h2>

              <div className="onboarding-options-row">
                <button className="onboarding-btn" onClick={next}>
                  Bien!
                </button>
                <button className="onboarding-btn" onClick={next}>
                  Prefiero no decirlo...
                </button>
              </div>
            </>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="onboarding-title">
                ¿Qué emoción te representa?
              </h2>

              <div className="onboarding-options-column">
                {EMOTIONS.map(e => (
                  <button
                    className="onboarding-btn"
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
            </>
          )}

          {/* STEP 2 */}
          {mode === "setup" && step === 2 && (
            <>
              <h2 className="onboarding-title">Elegí un color</h2>

              <div className="onboarding-options-column">
                {COLORS.map(c => (
                  <button
                    className="onboarding-btn"
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
            </>
          )}

          {/* STEP 3 */}
          {mode === "setup" && step === 3 && (
            <>
              <h2 className="onboarding-title">
                ¿Cómo querés llamarla?
              </h2>

              <input
                className="onboarding-input"
                placeholder="Nombre"
                value={data.name}
                onChange={e =>
                  setData({ ...data, name: e.target.value })
                }
              />

              <button
                className="onboarding-btn"
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
            </>
          )}

        </div>
      </div>
    </div>
  )
}