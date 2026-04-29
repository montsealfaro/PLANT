import { useEffect, useState } from "react"

export default function useLocalTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    now,
    dateString: now.toLocaleDateString(),
    timeString: now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  }
}