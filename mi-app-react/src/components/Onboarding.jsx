import { useState } from "react"

export default function Onboarding({ onFinish }) {
  const [name, setName] = useState("")
  const [personality, setPersonality] = useState("")
  const [color, setColor] = useState("")

  const handleSubmit = () => {
    if (!name || !personality || !color) return
    onFinish({ name, personality, color })
  }

  return (
    <div>
      <h2>Crear tu mascota</h2>

      <input
        placeholder="¿Cómo te gustaría llamarle?"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        placeholder="¿Qué emoción te representa más?"
        value={personality}
        onChange={e => setPersonality(e.target.value)}
      />

      <input
        placeholder="Tu color favorito"
        value={color}
        onChange={e => setColor(e.target.value)}
      />

      <button onClick={handleSubmit}>Crear</button>
    </div>
  )
}