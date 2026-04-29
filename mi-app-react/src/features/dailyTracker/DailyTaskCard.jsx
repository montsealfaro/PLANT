export default function DailyTaskCard({ task, onComplete }) {
  return (
    <button
      onClick={() => onComplete(task.id)}
      disabled={task.completed}
      style={{
        padding: "12px",
        borderRadius: "16px",
        border: "none",
        opacity: task.completed ? 0.5 : 1,
        cursor: "pointer",
      }}
    >
      <div style={{ fontSize: "24px" }}>{task.icon}</div>
      <div>{task.label}</div>
    </button>
  )
}