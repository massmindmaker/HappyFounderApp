"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Clock, Gift, Target, Sparkles, ChevronRight } from "lucide-react"

interface GameTask {
  id: string
  title: string
  description: string
  type: "daily" | "achievement" | "special"
  reward: number
  progress: number
  total: number
  completed: boolean
}

export default function GameTasks() {
  const [tasks, setTasks] = useState<GameTask[]>([
    {
      id: "1",
      title: "Ежедневный клик",
      description: "Сделайте 100 кликов",
      type: "daily",
      reward: 50,
      progress: 0,
      total: 100,
      completed: false,
    },
    {
      id: "2",
      title: "Первая инвестиция",
      description: "Инвестируйте в любой проект",
      type: "achievement",
      reward: 200,
      progress: 0,
      total: 1,
      completed: false,
    },
  ])

  const [showReward, setShowReward] = useState(false)
  const [lastReward, setLastReward] = useState(0)

  const updateProgress = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId && !task.completed) {
          const newProgress = Math.min(task.progress + 1, task.total)
          const justCompleted = newProgress === task.total && task.progress !== task.total

          if (justCompleted) {
            setLastReward(task.reward)
            setShowReward(true)
            setTimeout(() => setShowReward(false), 2000)
          }

          return {
            ...task,
            progress: newProgress,
            completed: newProgress === task.total,
          }
        }
        return task
      }),
    )
  }

  return (
    <div className="relative p-4 bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen">
      <AnimatePresence>
        {showReward && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: -20 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="flex items-center bg-yellow-400 px-6 py-3 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-yellow-900 mr-2" />
              <span className="text-yellow-900 font-bold">+{lastReward} токенов!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-4 shadow-md ${
              task.completed ? "border-l-4 border-green-500" : ""
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {task.type === "daily" && <Clock className="w-5 h-5 text-blue-300 mr-2" />}
                {task.type === "achievement" && <Target className="w-5 h-5 text-green-300 mr-2" />}
                {task.type === "special" && <Gift className="w-5 h-5 text-purple-300 mr-2" />}
                <div>
                  <h3 className="font-medium text-white">{task.title}</h3>
                  <p className="text-sm text-blue-200">{task.description}</p>
                </div>
              </div>
              <div className="flex items-center bg-blue-500 bg-opacity-30 px-2 py-1 rounded-full">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-1" />
                <span className="font-medium text-yellow-400">{task.reward}</span>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1 text-blue-200">
                <span>Прогресс</span>
                <span>{Math.round((task.progress / task.total) * 100)}%</span>
              </div>
              <div className="w-full bg-blue-900 rounded-full h-2.5">
                <div
                  className="bg-blue-400 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${(task.progress / task.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {!task.completed && (
              <Button
                className="w-full mt-3 bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => updateProgress(task.id)}
              >
                Выполнить
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )
}

