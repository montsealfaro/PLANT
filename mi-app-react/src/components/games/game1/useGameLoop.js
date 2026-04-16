import { useEffect, useRef } from "react"

export default function useGameLoop(callback) {
  const requestRef = useRef()
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => {
    const loop = () => {
      callbackRef.current()
      requestRef.current = requestAnimationFrame(loop)
    }

    requestRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])
}