import happy from "../assets/plants/happy.png"
import ok from "../assets/plants/ok.png"
import sad from "../assets/plants/sad.png"
import wilted from "../assets/plants/wilted.png"

const plantImages = {
  happy,
  ok,
  sad,
  wilted
}

export default function PlantDisplay({ stage }) {
  const image = plantImages[stage]

  return (
    <div className="plant-container">
      <img
        src={image}
        alt={stage}
        className={`plant plant-${stage}`}
      />
    </div>
  )
}
