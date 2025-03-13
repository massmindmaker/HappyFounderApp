"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit2, Trash2, Clock, Coins, Target, Gift } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string
  type: "daily" | "achievement" | "special"
  reward: number
  isActive: boolean
  requiredActions?: number
  duration?: number
}

export default function TasksDashboard() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Первый вход",
      description: "Войдите в приложение впервые",
      type: "achievement",
      reward: 100,
      isActive: true,
    },
    {
      id: "2",
      title: "Ежедневное действие",
      description: "Выполните 10 кликов",
      type: "daily",
      reward: 50,
      isActive: true,
      requiredActions: 10,
      duration: 24,
    },
  ])

  const [newTask, setNewTask] = useState<Partial<Task>>({
    type: "daily",
    isActive: true,
  })

  const handleAddTask = () => {
    if (newTask.title && newTask.description) {
      setTasks([
        ...tasks,
        {
          ...newTask,
          id: Math.random().toString(36).substr(2, 9),
        } as Task,
      ])
      setNewTask({
        type: "daily",
        isActive: true,
      })
    }
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  const handleToggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, isActive: !task.isActive } : task)))
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Управление заданиями</h2>
        <div className="grid gap-4 p-4 border rounded-lg bg-white">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">Название задания</label>
              <Input
                value={newTask.title || ""}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="Введите название задания"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1">Тип задания</label>
              <select
                className="w-full p-2 border rounded-md"
                value={newTask.type}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    type: e.target.value as Task["type"],
                  })
                }
              >
                <option value="daily">Ежедневное</option>
                <option value="achievement">Достижение</option>
                <option value="special">Специальное</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1">Описание</label>
            <Textarea
              value={newTask.description || ""}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Введите описание задания"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1">Награда (токены)</label>
              <Input
                type="number"
                value={newTask.reward || ""}
                onChange={(e) => setNewTask({ ...newTask, reward: Number(e.target.value) })}
                placeholder="Количество токенов"
              />
            </div>
            {newTask.type === "daily" && (
              <div>
                <label className="text-sm font-medium mb-1">Требуемые действия</label>
                <Input
                  type="number"
                  value={newTask.requiredActions || ""}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      requiredActions: Number(e.target.value),
                    })
                  }
                  placeholder="Количество действий"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button onClick={handleAddTask}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить задание
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Тип</TableHead>
              <TableHead>Награда</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{task.title}</div>
                    <div className="text-sm text-gray-500">{task.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {task.type === "daily" && <Clock className="w-4 h-4 mr-2 text-blue-500" />}
                    {task.type === "achievement" && <Target className="w-4 h-4 mr-2 text-green-500" />}
                    {task.type === "special" && <Gift className="w-4 h-4 mr-2 text-purple-500" />}
                    {task.type}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Coins className="w-4 h-4 mr-2 text-yellow-500" />
                    {task.reward}
                  </div>
                </TableCell>
                <TableCell>
                  <Switch checked={task.isActive} onCheckedChange={() => handleToggleTask(task.id)} />
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

