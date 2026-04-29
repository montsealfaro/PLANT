import useDailyTracker from "./useDailyTracker"
import DailyTaskCard from "./DailyTaskCard"

export default function DailyTracker() {
  const { tasks, completeTask } = useDailyTracker()

  return (
    <div>
      <h2>Objetivos diarios</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
      }}>
        {tasks.map(task => (
          <DailyTaskCard
            key={task.id}
            task={task}
            onComplete={completeTask}
          />
        ))}
      </div>
    </div>
  )
}