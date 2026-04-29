import { useEffect, useRef } from "react"

export function useGameLoop(callback, running = true) {
  const requestRef = useRef(null)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!running) return

    let active = true

    const loop = () => {
      if (!active) return
      callbackRef.current()
      requestRef.current = requestAnimationFrame(loop)
    }

    requestRef.current = requestAnimationFrame(loop)

    return () => {
      active = false
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [running])
}