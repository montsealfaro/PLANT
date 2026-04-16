import { useState, useEffect } from "react"
import { plantImages } from "../config/plantImages"
import Particles from "./Particles"

export default function PlantDisplay({
  stage,
  sleeping,
  playing,
  personality
}) {
  const [current, setCurrent] = useState("happy")
  const [prev, setPrev] = useState(null)

  let nextState = stage

  if (stage === "wilted") {
    nextState = "wilted"
  } else if (sleeping) {
    nextState = "sleeping"
  } else if (playing) {
    nextState = "playing"
  }

  useEffect(() => {
    if (nextState === current) return

    setPrev(current)

    const change = setTimeout(() => {
      setCurrent(nextState)
    }, 100)

    const clear = setTimeout(() => {
      setPrev(null)
    }, 400)

    return () => {
      clearTimeout(change)
      clearTimeout(clear)
    }
  }, [nextState, current])

  const currentSet = plantImages[personality] || plantImages["alegría"]

  return (
    <div className="plant-container">

      {prev && (
        <img
          src={currentSet[prev]}
          className="plant fade-out"
          alt="previous"
        />
      )}

      <img
        key={current}
        src={currentSet[current]}
        className="plant fade-in"
        alt="current"
      />

      {playing && <Particles type="playing" />}
    </div>
  )
}