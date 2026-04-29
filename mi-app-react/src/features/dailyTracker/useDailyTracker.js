import { useEffect, useState } from "react"
import { dailyTasks } from "./trackerConfig"
import { isSameDay } from "./trackerLogic"

export default function useDailyTracker() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyTracker"))

    if (!saved || !isSameDay(saved.date, new Date())) {
      const freshTasks = dailyTasks.map(task => ({
        ...task,
        completed: false,
      }))

      const data = {
        date: new Date(),
        tasks: freshTasks,
      }

      localStorage.setItem("dailyTracker", JSON.stringify(data))
      setTasks(freshTasks)
    } else {
      setTasks(saved.tasks)
    }
  }, [])

  const completeTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id ? { ...task, completed: true } : task
    )

    setTasks(updated)

    localStorage.setItem("dailyTracker", JSON.stringify({
      date: new Date(),
      tasks: updated,
    }))
  }

  return { tasks, completeTask }
}