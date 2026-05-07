import { useEffect, useState } from "react"
import { dailyTasks } from "./trackerConfig"

const STORAGE_KEY = "daily_tracker_history"

function getTodayKey() {
  return new Date().toISOString().split("T")[0]
}

export default function useDailyTracker() {

  const [tasks, setTasks] = useState([])

  // 🔥 LOAD
  const loadTodayTasks = () => {

    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || {}

    const today = getTodayKey()

    // SI NO EXISTE EL DÍA
    if (!saved[today]) {

      const freshTasks = dailyTasks.map(task => ({
        ...task
      }))

      saved[today] = {
        date: today,
        tasks: freshTasks,
        updatedAt: new Date().toISOString()
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(saved)
      )

      setTasks(freshTasks)

    } else {

      setTasks(saved[today].tasks || [])
    }
  }

  useEffect(() => {
    loadTodayTasks()
  }, [])

  // 🔥 SAVE
  const saveTasks = (updatedTasks) => {

    const saved =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY)
      ) || {}

    const today = getTodayKey()

    saved[today] = {
      ...(saved[today] || {}),
      date: today,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString()
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(saved)
    )
  }

  // 🔥 UPDATE PROGRESS
  const updateProgress = (id, newValue) => {

    const updated = tasks.map(task => {

      if (task.id !== id)
        return task

      return {
        ...task,

        value:
          Math.max(
            0,
            Math.min(newValue, task.goal)
          ),

        completed:
          newValue >= task.goal
      }
    })

    setTasks(updated)

    saveTasks(updated)
  }

  // 🔥 INCREMENT
  const incrementTask = (id) => {

    const task =
      tasks.find(t => t.id === id)

    if (!task)
      return

    updateProgress(
      id,
      task.value + 1
    )
  }

  // 🔥 DECREMENT
  const decrementTask = (id) => {

    const task =
      tasks.find(t => t.id === id)

    if (!task)
      return

    updateProgress(
      id,
      task.value - 1
    )
  }

  // 🔥 STATS
  const completed =
    tasks.filter(t => t.completed).length

  const progress =
    tasks.length > 0
      ? Math.round(
          (completed / tasks.length) * 100
        )
      : 0

  return {

    tasks,

    progress,
    completed,

    loadTodayTasks,

    updateProgress,
    incrementTask,
    decrementTask
  }
}