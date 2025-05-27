"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  FolderOpen,
  Users,
  CheckSquare,
  User,
  BarChart3,
  Search,
  Tag,
  Award,
  Coins,
  Check,
  Clock,
  ChevronRight,
  Shield,
} from "lucide-react"
import ProjectCardAnalysis from "./project-card-analysis"
import TasksDashboard from "./admin/tasks-dashboard"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useToast } from "@/components/ui/use-toast"

interface MainScreenProps {
  onCreateProject: () => void
  walletConnected: boolean
  onOpenProfile: () => void
  onOpenProject: (project: any) => void
}

export default function MainScreen({
  onCreateProject,
  walletConnected,
  onOpenProfile,
  onOpenProject,
}: MainScreenProps) {
  const [activeTab, setActiveTab] = useState("projects")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [referralLink, setReferralLink] = useState("")
  const supabase = useSupabaseClient()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminStatus = async () => {
      setIsLoading(true)
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()
        if (sessionError) throw sessionError

        if (session?.user) {
          const { data, error } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

          if (error) throw error

          setIsAdmin(data.is_admin)
        }
      } catch (error) {
        console.error("Error checking admin status:", error)
        toast({
          title: "Error",
          description: "Failed to check admin status. Some features may be unavailable.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (supabase) {
      checkAdminStatus()
    }
  }, [supabase, toast])

  useEffect(() => {
    const storedReferralLink = localStorage.getItem("referralLink")
    if (storedReferralLink) {
      setReferralLink(storedReferralLink)
    }
  }, [])

  const handleBackToList = () => {
    setSelectedProject(null)
  }

  const handleOpenProject = (project: any) => {
    setSelectedProject(project)
  }

  const projects = [
    { id: 1, name: "Маркетплейс для фрилансеров", category: "Web3", date: "12.03.2024", status: "В разработке" },
    { id: 2, name: "AI-ассистент для HR", category: "SaaS", date: "05.03.2024", status: "Завершен" },
  ]

  const partnersList = [
    { id: 1, name: "@alex_web3", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 2, name: "@maria_investor", avatar: "/placeholder.svg?height=40&width=40" },
    { id: 3, name: "@crypto_dave", avatar: "/placeholder.svg?height=40&width=40" },
  ]

  const tasksList = [
    { id: 1, name: "Пригласить 3 друзей", reward: "50 $HFC", completed: false, category: "social" },
    { id: 2, name: "Создать первый проект", reward: "100 $HFC", completed: true, category: "project" },
    { id: 3, name: "Подписаться на канал", reward: "30 $HFC", completed: false, category: "social" },
    { id: 4, name: "Инвестировать в проект", reward: "200 $HFC", completed: false, category: "investment" },
    { id: 5, name: "Пройти обучение", reward: "75 $HFC", completed: false, category: "education" },
    { id: 6, name: "Заполнить профиль", reward: "25 $HFC", completed: true, category: "profile" },
  ]

  const projectsList = [
    {
      id: 1,
      name: "DeFi платформа",
      category: "Finance",
      votes: 128,
      tags: ["Web3", "DeFi"],
      nomination: "Идея",
      description: "Децентрализованная финансовая платформа для кредитования и инвестиций.",
      isUserProject: false,
    },
    {
      id: 2,
      name: "NFT маркетплейс",
      category: "Art",
      votes: 95,
      tags: ["NFT", "Marketplace"],
      nomination: "Маркетинг",
      description: "Площадка для создания, покупки и продажи уникальных цифровых предметов искусства.",
      isUserProject: false,
    },
    {
      id: 3,
      name: "DAO для благотворительности",
      category: "Social",
      votes: 210,
      tags: ["DAO", "Charity"],
      nomination: "Инвестиции",
      description: "Децентрализованная автономная организация для прозрачного управления благотворительными проектами.",
      isUserProject: false,
    },
  ]

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <header className="py-4 px-4 border-b">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" className="rounded-full" onClick={onOpenProfile}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {!selectedProject ? (
        <Tabs defaultValue="projects" className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <TabsContent value="projects" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Мои проекты</h2>
                <Button onClick={onCreateProject} size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Создать
                </Button>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-sm p-4"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{project.name}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            project.status === "Завершен" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{project.category}</span>
                        <span>{project.date}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">У вас пока нет проектов</h3>
                  <p className="text-sm text-gray-500 mb-4">Создайте свой первый бизнес-проект с помощью AI</p>
                  <Button onClick={onCreateProject} variant="outline" size="sm">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Создать проект
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Анализ проектов</h2>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Tag className="h-4 w-4 mr-2" />
                    Теги
                  </Button>
                  <Button variant="outline" size="sm">
                    <Award className="h-4 w-4 mr-2" />
                    Номинации
                  </Button>
                </div>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск проектов..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
                />
              </div>

              <div className="space-y-3">
                {projectsList.map((project) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-lg shadow-sm p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center">
                        <BarChart3 className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-xs font-medium">{project.votes}</span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-3">
                      <div className="text-xs text-gray-500">{project.category}</div>
                      <div className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {project.nomination}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleOpenProject(project)}
                      >
                        Подробнее
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="partners" className="mt-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Партнеры</h2>
                <Button variant="outline" size="sm">
                  Пригласить
                </Button>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Партнерская программа</h3>
                      <p className="text-xs text-gray-500">Приглашено: {partnersList.length}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Подробнее
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-3">Реферальная ссылка</h4>
                  <div className="flex">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 text-xs p-2 border rounded-l-lg bg-gray-50"
                    />
                    <Button variant="default" size="sm" className="rounded-l-none text-xs">
                      Копировать
                    </Button>
                  </div>
                </div>
              </div>

              <h4 className="text-sm font-medium mb-3">Список партнеров</h4>
              <div className="space-y-2">
                {partnersList.map((partner) => (
                  <motion.div
                    key={partner.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <img
                      src={partner.avatar || "/placeholder.svg"}
                      alt={partner.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <span className="text-sm">{partner.name}</span>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="mt-0">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-black">Задания</h2>
                  <div className="text-sm font-medium bg-gray-200 px-3 py-1 rounded-full text-gray-800">
                    <Coins className="w-4 h-4 inline mr-1" />
                    Баланс: 100 $HFC
                  </div>
                </div>
                <div className="space-y-3">
                  {tasksList.map((task) => (
                    <div
                      key={task.id}
                      className="border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full ${
                            task.completed ? "bg-black" : "bg-gray-200"
                          } flex items-center justify-center mr-3`}
                        >
                          {task.completed ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className={`text-sm font-medium ${task.completed ? "text-gray-500" : "text-black"}`}>
                            {task.name}
                          </h3>
                          <p className="text-xs text-gray-500">{task.reward}</p>
                        </div>
                      </div>
                      {!task.completed && (
                        <Button variant="outline" size="sm" className="text-black hover:bg-gray-100">
                          Выполнить
                          <ChevronRight className="ml-1 w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {isAdmin && (
              <TabsContent value="taskManager" className="mt-0">
                <TasksDashboard />
              </TabsContent>
            )}
          </div>

          <TabsList className="grid grid-cols-4 border-t">
            <TabsTrigger value="projects" className="flex flex-col items-center py-2 text-xs">
              <FolderOpen className="h-5 w-5 mb-1" />
              Проекты
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex flex-col items-center py-2 text-xs">
              <BarChart3 className="h-5 w-5 mb-1" />
              Анализ
            </TabsTrigger>
            <TabsTrigger value="partners" className="flex flex-col items-center py-2 text-xs">
              <Users className="h-5 w-5 mb-1" />
              Партнеры
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex flex-col items-center py-2 text-xs">
              <CheckSquare className="h-5 w-5 mb-1" />
              Задания
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="taskManager" className="flex flex-col items-center py-2 text-xs">
                <Shield className="h-5 w-5 mb-1" />
                Управление
              </TabsTrigger>
            )}
          </TabsList>
        </Tabs>
      ) : (
        <ProjectCardAnalysis project={selectedProject} onBack={handleBackToList} />
      )}
    </div>
  )
}
