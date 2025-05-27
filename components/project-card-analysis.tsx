"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Share2,
  Wallet,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  LineChart,
  Megaphone,
  ImageIcon,
} from "lucide-react"
import { ProjectInvestment } from "@/components/investment/project-investment"
import { ImageService } from "@/lib/image-service"

interface ProjectCardAnalysisProps {
  project: any
  onBack: () => void
}

export default function ProjectCardAnalysis({ project, onBack }: ProjectCardAnalysisProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [showInvestment, setShowInvestment] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!project) return null

  // Обработчик ошибок загрузки изображений
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    ImageService.handleImageError(e)
    setImageError(true)
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <header className="py-4 px-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold truncate">{project.name}</h1>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-primary/5 border-b">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-bold text-lg">{project.name}</h2>
              <p className="text-sm text-gray-600">{project.category}</p>
            </div>
            <div className="bg-white p-1.5 rounded-md shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          <p className="text-sm mb-4">{project.description}</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Категория</div>
              <div className="font-medium text-sm truncate">{project.category}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Голоса</div>
              <div className="font-medium text-sm truncate">{project.votes}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Номинация</div>
              <div className="font-medium text-sm truncate">{project.nomination}</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
            <Button size="sm" className="flex-1" onClick={() => setShowInvestment(true)}>
              <Wallet className="h-4 w-4 mr-2" />
              Инвестировать
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 p-0 h-12">
            <TabsTrigger value="overview" className="text-xs">
              Обзор
            </TabsTrigger>
            <TabsTrigger value="finance" className="text-xs">
              Финансы
            </TabsTrigger>
            <TabsTrigger value="marketing" className="text-xs">
              Маркетинг
            </TabsTrigger>
            <TabsTrigger value="team" className="text-xs">
              Команда
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Описание проекта
                </h3>
                <p className="text-sm">{project.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Целевая аудитория
                </h3>
                <p className="text-sm">{project.targetAudience || "Информация о целевой аудитории отсутствует."}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Потенциал роста
                </h3>
                <p className="text-sm">{project.growthPotential || "Информация о потенциале роста отсутствует."}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Превью проекта
                </h3>
                <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                  {imageError ? (
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Превью недоступно</span>
                    </div>
                  ) : (
                    <img
                      src={ImageService.getProjectPreviewUrl(project.id, project.name) || "/placeholder.svg"}
                      alt="Project Preview"
                      className="rounded-md w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="p-4 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <LineChart className="h-4 w-4 mr-2 text-primary" />
                  Финансовые показатели
                </h3>
                <p className="text-sm">{project.financials || "Финансовая информация отсутствует."}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="p-4 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Megaphone className="h-4 w-4 mr-2 text-primary" />
                  Маркетинговая стратегия
                </h3>
                <p className="text-sm">
                  {project.marketingStrategy || "Информация о маркетинговой стратегии отсутствует."}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="team" className="p-4 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Команда проекта
                </h3>
                <p className="text-sm">{project.team || "Информация о команде проекта отсутствует."}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      {showInvestment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <ProjectInvestment
              project={{
                id: project.id,
                name: project.name,
                tokenSymbol: "HFT",
                tokenPrice: 0.1,
                nftPrice: 100,
                availableTokens: 1000000,
                availableNFTs: 100,
              }}
            />
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full" onClick={() => setShowInvestment(false)}>
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
