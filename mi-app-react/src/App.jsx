import usePlant from "./hooks/usePlant"
import PlantDisplay from "./components/PlantDisplay"
import StatusPanel from "./components/StatusPanel"
import WaterButton from "./components/WaterButton"
import Background from "./components/Background"

export default function App() {
  const { plantStage, hoursSinceWater, drinkWater } = usePlant()

  return (
    <Background mood={plantStage}>
      <div className="app">
        <PlantDisplay stage={plantStage} />
        <StatusPanel hours={hoursSinceWater} />
        <WaterButton onDrink={drinkWater} />
      </div>
    </Background>
  )
}
