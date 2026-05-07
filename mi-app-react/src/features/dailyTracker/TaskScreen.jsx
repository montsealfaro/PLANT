// TaskScreen.jsx

import "./dailyTracker.css"

export default function TaskScreen({
  task,
  updateProgress,
  onClose
}) {

  const percentage =
    Math.round(
      (task.value / task.goal) * 100
    )

  return (

    <div className="task-screen">

      {/* HEADER */}
      <div className="task-header">

        <button
          className="task-close"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="task-header-title">
          {task.title} tracking
        </div>

        <div className="task-check">
          ✓
        </div>

      </div>


      {/* CONTENT */}
      <div className="task-content">

        {/* TITLE */}
        <h1 className="task-title">
          {task.title} hoy
        </h1>

        {/* BIG NUMBER */}
        <div className="task-big-number">

          {task.value}
          {" de "}
          {task.goal}

          <span>
            {" "}
            {task.unit}
          </span>

        </div>

        {/* DESCRIPTION */}
        <p className="task-description">

          Seguís construyendo este hábito.
          Solo faltan {" "}

          {task.goal - task.value}

          {" "}para completar tu meta.

        </p>


        {/* TRACKER */}
        <div
          className="task-tracker-section"
          style={{
            "--tracker-color": task.color
          }}
        >

          <div className="task-grid">

            {Array.from({
              length: task.goal
            }).map((_, i) => {

              const active =
                i < task.value

              return (

                <button
                  key={i}
                  className={`task-drop ${
                    active
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    updateProgress(
                      task.id,
                      active
                        ? i
                        : i + 1
                    )
                  }
                >

                  {
                    active
                      ? task.icon
                      : "+"
                  }

                </button>

              )

            })}

          </div>

        </div>


        {/* NOTIFICATION */}
        <div className="notification-section">

          <h3>
            Notificaciones
          </h3>

          <div className="notification-card">

            <span>
              Recordarme este hábito
            </span>

            <div className="fake-switch active" />

          </div>

        </div>


        {/* STATS */}
        <div className="stats-card">

          <div className="stats-title">

            Meta diaria:
            {" "}
            {task.goal}
            {" "}
            {task.unit}

          </div>

          <div className="stats-grid">

            <div>

              <strong>
                {task.value}
              </strong>

              <span>
                actual
              </span>

            </div>

            <div>

              <strong>
                {task.goal - task.value}
              </strong>

              <span>
                restante
              </span>

            </div>

            <div>

              <strong>
                {percentage}%
              </strong>

              <span>
                progreso
              </span>

            </div>

          </div>

        </div>


        {/* BUTTON */}
        <button
          className="task-main-button"
          onClick={() =>
            updateProgress(
              task.id,
              Math.min(
                task.value + 1,
                task.goal
              )
            )
          }
        >

          Agregar progreso

        </button>

      </div>

    </div>

  )

}