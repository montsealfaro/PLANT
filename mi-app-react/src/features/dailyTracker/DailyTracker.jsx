import { useEffect } from "react"
import useDailyTracker from "./useDailyTracker"
import DailyTaskCard from "./DailyTaskCard"

export default function DailyTracker() {

  const {
    tasks,
    completeTask,
    loadTodayTasks
  } = useDailyTracker()

  // 🔥 carga tareas del día actual
  useEffect(() => {
    loadTodayTasks()
  }, [])

  // progreso total
  const completed = tasks.filter(t => t.completed).length
  const progress =
    tasks.length > 0
      ? Math.round((completed / tasks.length) * 100)
      : 0

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px"
      }}
    >

      {/* HEADER */}
      <div>
        <h2 style={{ marginBottom: "6px" }}>
          Objetivos diarios
        </h2>

        <div
          style={{
            width: "100%",
            height: "10px",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: "999px",
              transition: "0.3s",
              background:
                "linear-gradient(90deg, #ffb6d9, #ffd6ec)"
            }}
          />
        </div>

        <div
          style={{
            marginTop: "6px",
            fontSize: "13px",
            opacity: 0.7
          }}
        >
          {completed} / {tasks.length} completadas
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
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