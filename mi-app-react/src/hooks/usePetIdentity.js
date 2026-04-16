import { useState } from "react"

const STORAGE_KEY = "petIdentity"

export default function usePetIdentity() {
  const [identity, setIdentity] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  })

  const saveIdentity = (data) => {
    const newIdentity = {
      name: data.name,
      color: data.color
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIdentity))
    setIdentity(newIdentity)
  }

  return { identity, saveIdentity }
}