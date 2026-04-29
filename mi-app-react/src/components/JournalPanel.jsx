import { useState } from "react"
import useDailyHistory from "../hooks/useDailyHistory"

const questions = [
  { text: "¿Cómo te sentiste hoy?", options: ["A) Bien", "B) Mal", "C) Meh"] },
  { text: "¿Sentiste que le diste lugar a eso que tanto querías?", options: ["A) ¡Sí!", "B) No", "C) Lo dejé para mañana.."] },
  { text: "¿Fuiste amable con vos mismo?", options: ["A) Sí", "B) No"] },
  { text: "¿Qué estás esperando para darte espacio a vos?", options: ["A) No lo sé", "B) Voy de a poco"] },
  { text: "¿Podés darte un mimo hoy?", options: ["A) Sí, lo voy a hacer", "B) Debería hacerlo"] }
]

export default function JournalPanel() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])
  const [result, setResult] = useState("")

  const { saveDailyEntry } = useDailyHistory()

  const handleAnswer = (option) => {
    const updatedAnswers = [...answers, option]
    setAnswers(updatedAnswers)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      evaluateResult(updatedAnswers)
    }
  }

  const evaluateResult = (finalAnswers) => {
    let countA = 0
    let countB = 0

    finalAnswers.forEach((ans) => {
      if (ans.startsWith("A")) countA++
      if (ans.startsWith("B")) countB++
    })

    const isPositive = countA > countB

    const finalText = isPositive
      ? "Estoy muy contenta por vos..."
      : "Entiendo lo extenuante que puede ser..."

    setResult(finalText)

    // 🔥 guardar journal
    saveDailyEntry({
      journal: {
        answers: finalAnswers,
        result: isPositive ? "positive" : "needs_attention"
      }
    })

    setStep(step + 1)
  }

  return (
    <div className="journal-chat">
      {step < questions.length ? (
        <div className="journal-bubble fade">
          <h2>{questions[step].text}</h2>

          <div className="journal-options">
            {questions[step].options.map((opt, i) => (
              <button key={i} className="journal-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="journal-result fade">
          <h2>Tu reflexión de hoy</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  )
}