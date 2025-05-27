"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  Download,
  Share2,
  Wallet,
  BarChart3,
  Users,
  TrendingUp,
  FileText,
  Code,
  LineChart,
  Megaphone,
  Sparkles,
  Shield,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ImageIcon,
} from "lucide-react"
import { ImageService } from "@/lib/image-service"

interface ProjectCardProps {
  project: any
  onBack: () => void
  onCreateNFT: () => void
}

export default function ProjectCard({ project, onBack, onCreateNFT }: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [imageError, setImageError] = useState(false)

  if (!project) {
    return (
      <div className="w-full max-w-md mx-auto h-screen flex flex-col items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-2">Проект не найден</h2>
          <p className="text-gray-600 mb-4">Запрошенный проект не существует или был удален</p>
          <Button onClick={onBack}>Вернуться к списку</Button>
        </div>
      </div>
    )
  }

  // Форматирование чисел для отображения
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  // Получение данных анализа
  const aiAnalysis = project.ai_analysis || {}
  const marketResearch = project.market_research || {}
  const financialProjections = project.financial_projections || {}
  const competitiveAnalysis = project.competitive_analysis || {}
  const tokenomics = project.tokenomics || {}
  const mvpPlan = project.mvp_plan || {}

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
        <h1 className="text-xl font-bold truncate">{project.title}</h1>
        {project.ai_score && (
          <div className="ml-auto flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{project.ai_score}/10</span>
          </div>
        )}
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 bg-primary/5 border-b">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="font-bold text-lg">{project.title}</h2>
              <p className="text-sm text-gray-600">{project.industry || project.niche}</p>
            </div>
            <div className="bg-white p-1.5 rounded-md shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                {project.industry === "Fintech" && <Wallet className="h-5 w-5 text-primary" />}
                {project.industry === "E-commerce" && <Users className="h-5 w-5 text-primary" />}
                {project.niche === "SaaS" && <Code className="h-5 w-5 text-primary" />}
                {project.niche === "AI" && <Sparkles className="h-5 w-5 text-primary" />}
                {!["Fintech", "E-commerce"].includes(project.industry) && !["SaaS", "AI"].includes(project.niche) && (
                  <BarChart3 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>

          <p className="text-sm mb-4">{project.description}</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Индустрия</div>
              <div className="font-medium text-sm truncate">{project.industry || "Не указана"}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Бюджет</div>
              <div className="font-medium text-sm truncate">{project.budget ? `$${project.budget}` : "Не указан"}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Статус</div>
              <div className="font-medium text-sm truncate capitalize">{project.status}</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
            <Button size="sm" className="flex-1" onClick={onCreateNFT}>
              <Shield className="h-4 w-4 mr-2" />
              Создать NFT
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
            <TabsTrigger value="mvp" className="text-xs">
              MVP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="p-4 mt-0">
            <div className="space-y-6">
              {aiAnalysis.summary && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    AI-анализ проекта
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <p className="text-sm mb-4">{aiAnalysis.summary}</p>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Сильные стороны</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.strengths?.map((strength: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Слабые стороны</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.weaknesses?.map((weakness: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <XCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Возможности</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.opportunities?.map((opportunity: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                              {opportunity}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Угрозы</h4>
                        <ul className="text-sm space-y-1">
                          {aiAnalysis.threats?.map((threat: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                              {threat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Анализ рынка
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  {marketResearch.marketSize ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Размер рынка</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-xs text-gray-500 mb-1">Глобальный рынок</div>
                            <div className="text-lg font-bold">
                              {marketResearch.marketSize.global?.value} {marketResearch.marketSize.global?.unit}
                            </div>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="text-xs text-gray-500 mb-1">Целевой рынок</div>
                            <div className="text-lg font-bold">
                              {marketResearch.marketSize.target?.value} {marketResearch.marketSize.target?.unit}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500 flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                          Ежегодный рост: {marketResearch.marketSize.cagr}%
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Целевая аудитория</h4>
                        <p className="text-sm">{marketResearch.targetAudience?.demographics || project.audience}</p>
                        {marketResearch.targetAudience?.psychographics && (
                          <p className="text-sm mt-1">{marketResearch.targetAudience.psychographics}</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Тренды рынка</h4>
                        <ul className="text-sm space-y-1">
                          {marketResearch.trends?.map((trend: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 mr-2"></div>
                              {trend}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Данные анализа рынка отсутствуют</p>
                    </div>
                  )}
                </div>
              </div>

              {competitiveAnalysis.competitors && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                    Анализ конкурентов
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b">
                        <span className="text-sm font-medium">Конкурент</span>
                        <span className="text-sm font-medium">Доля рынка</span>
                      </div>

                      {competitiveAnalysis.competitors.map((competitor: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm">{competitor.name}</span>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                              <div
                                className="h-2 bg-primary rounded-full"
                                style={{ width: `${competitor.marketShare * 0.24}px` }}
                              />
                            </div>
                            <span className="text-xs">{competitor.marketShare}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-xs text-gray-500 mb-2">Конкурентные преимущества</h4>
                      <ul className="text-sm space-y-1">
                        {competitiveAnalysis.projectAdvantages?.map((advantage: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {advantage}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {project.pitch_deck_data && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                    Pitch Deck
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                      {imageError ? (
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Превью недоступно</span>
                        </div>
                      ) : (
                        <img
                          src={ImageService.getPitchDeckPreviewUrl(project.id) || "/placeholder.svg"}
                          alt="Pitch Deck Preview"
                          className="rounded-md w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="h-4 w-4 mr-2" />
                      Скачать Pitch Deck (PDF)
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="finance" className="p-4 mt-0">
            <div className="space-y-6">
              {financialProjections.revenue && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <LineChart className="h-4 w-4 mr-2 text-primary" />
                    Финансовая модель
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                      <div className="p-3">
                        <div className="h-full w-full flex flex-col">
                          <div className="text-xs font-medium mb-2">Прогноз выручки (USD)</div>
                          <div className="flex-1 flex items-end space-x-2">
                            {financialProjections.revenue.map((value: number, i: number) => (
                              <div key={i} className="flex-1 flex flex-col justify-end">
                                <div
                                  className="bg-primary/20 rounded-t-sm"
                                  style={{
                                    height: `${Math.min(100, (value / Math.max(...financialProjections.revenue)) * 100)}%`,
                                  }}
                                ></div>
                                <div className="text-xs mt-1">Год {i + 1}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Финансовые показатели</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Начальные инвестиции</span>
                            <span className="text-sm font-medium">
                              ${formatNumber(financialProjections.initialInvestment || 0)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Точка безубыточности</span>
                            <span className="text-sm font-medium">
                              {financialProjections.breakEvenPoint?.months || 0} мес.
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">ROI (3 год)</span>
                            <span className="text-sm font-medium">{financialProjections.roi?.year3 || 0}%</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Прогноз по годам</h4>
                        <div className="space-y-2">
                          {financialProjections.revenue.map((value: number, i: number) => (
                            <div key={i} className="p-2 bg-gray-50 rounded-md">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium">Год {i + 1}</span>
                                <span className="text-xs text-gray-500">
                                  Прибыль: ${formatNumber(financialProjections.profit[i] || 0)}
                                </span>
                              </div>
                              <div className="w-full h-1.5 bg-gray-200 rounded-full">
                                <div
                                  className="h-1.5 bg-green-500 rounded-full"
                                  style={{
                                    width: `${Math.min(100, (financialProjections.profit[i] / financialProjections.revenue[i]) * 100)}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="flex justify-between text-xs mt-1">
                                <span>Выручка: ${formatNumber(value)}</span>
                                <span>Расходы: ${formatNumber(financialProjections.expenses[i] || 0)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {tokenomics.tokenBasics && (
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Wallet className="h-4 w-4 mr-2 text-primary" />
                    Токеномика
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-sm font-medium">{tokenomics.tokenBasics.name}</h4>
                        <p className="text-xs text-gray-500">Символ: ${tokenomics.tokenBasics.symbol}</p>
                      </div>
                      <div className="bg-primary/10 px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-primary">${tokenomics.tokenBasics.initialPrice}</span>
                      </div>
                    </div>

                    <div className="aspect-square bg-gray-100 rounded-md mb-4 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <div className="relative w-32 h-32">
                          <div className="absolute inset-0 rounded-full border-8 border-primary/20"></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-transparent border-t-primary"
                            style={{ transform: "rotate(45deg)" }}
                          ></div>
                          <div
                            className="absolute inset-0 rounded-full border-8 border-transparent border-r-primary/60"
                            style={{ transform: "rotate(45deg)" }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-xs font-medium">${tokenomics.tokenBasics.symbol}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-1">Общее предложение</h4>
                        <p className="text-sm">
                          {formatNumber(tokenomics.tokenBasics.totalSupply)} ${tokenomics.tokenBasics.symbol}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-1">Распределение</h4>
                        <div className="space-y-2 mt-2">
                          {Object.entries(tokenomics.distribution).map(([key, value]: [string, any], index: number) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="text-xs capitalize">{key}</span>
                              <div className="flex items-center">
                                <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                                  <div
                                    className="h-2 bg-primary rounded-full"
                                    style={{ width: `${value.percentage * 0.24}px` }}
                                  />
                                </div>
                                <span className="text-xs">{value.percentage}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-1">Механизмы использования</h4>
                        <ul className="text-sm space-y-2 mt-1">
                          {tokenomics.utilityMechanisms?.map((mechanism: any, index: number) => (
                            <li key={index} className="p-2 bg-gray-50 rounded-md">
                              <div className="font-medium text-xs">{mechanism.type}</div>
                              <p className="text-xs text-gray-600 mt-1">{mechanism.description}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="marketing" className="p-4 mt-0">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Megaphone className="h-4 w-4 mr-2 text-primary" />
                  Маркетинговая стратегия
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Основные каналы</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">Социальные сети</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            Высокий приоритет
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">Контент-маркетинг</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            Высокий приоритет
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">Партнерства</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            Средний приоритет
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                            <span className="text-sm">Email-маркетинг</span>
                          </div>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                            Средний приоритет
                          </span>
                        </div>
                      </div>
                    </div>

                    {marketResearch.targetAudience && (
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Целевая аудитория</h4>
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs text-gray-500">Демография:</span>
                              <p className="text-sm">{marketResearch.targetAudience.demographics}</p>
                            </div>
                            {marketResearch.targetAudience.psychographics && (
                              <div>
                                <span className="text-xs text-gray-500">Психография:</span>
                                <p className="text-sm">{marketResearch.targetAudience.psychographics}</p>
                              </div>
                            )}
                            {marketResearch.targetAudience.behaviors && (
                              <div>
                                <span className="text-xs text-gray-500">Поведение:</span>
                                <p className="text-sm">{marketResearch.targetAudience.behaviors}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {tokenomics.growthIncentives && (
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Стимулы роста</h4>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-start">
                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-xs text-primary">1</span>
                            </div>
                            <div>
                              <span className="font-medium">Реферальная программа</span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {tokenomics.growthIncentives.userAcquisition?.referralRewards}
                              </p>
                            </div>
                          </li>

                          <li className="flex items-start">
                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-xs text-primary">2</span>
                            </div>
                            <div>
                              <span className="font-medium">Ранние пользователи</span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {tokenomics.growthIncentives.userAcquisition?.earlyAdopter}
                              </p>
                            </div>
                          </li>

                          <li className="flex items-start">
                            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                              <span className="text-xs text-primary">3</span>
                            </div>
                            <div>
                              <span className="font-medium">Социальные задания</span>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {tokenomics.growthIncentives.userAcquisition?.socialTasks}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Прогноз роста
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                    <div className="p-3">
                      <div className="h-full w-full flex flex-col">
                        <div className="text-xs font-medium mb-2">Прогноз пользователей</div>
                        <div className="flex-1 flex items-end space-x-1">
                          {[10, 25, 45, 60, 90, 120, 180, 250, 320, 400, 500, 650].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col justify-end">
                              <div className="bg-primary/20 rounded-t-sm" style={{ height: `${height / 6.5}%` }}></div>
                              {i % 3 === 0 && <div className="text-xs mt-1">M{i + 1}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Пользователи через 6 месяцев:</span>
                      <span className="text-sm font-medium">~10,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Пользователи через 12 месяцев:</span>
                      <span className="text-sm font-medium">~50,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Конверсия:</span>
                      <span className="text-sm font-medium">~3.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mvp" className="p-4 mt-0">
            {project.needMvp || mvpPlan.features ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Code className="h-4 w-4 mr-2 text-primary" />
                    MVP Прототип
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                      {imageError ? (
                        <div className="flex flex-col items-center justify-center h-full">
                          <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">Превью недоступно</span>
                        </div>
                      ) : (
                        <img
                          src={ImageService.getProjectPreviewUrl(project.id, project.title) || "/placeholder.svg"}
                          alt="MVP Preview"
                          className="w-full h-full object-cover"
                          onError={handleImageError}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      {mvpPlan.features && (
                        <div>
                          <h4 className="text-xs text-gray-500 mb-2">Основные функции MVP</h4>
                          <ul className="text-sm space-y-1">
                            {mvpPlan.features.map((feature: any, index: number) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2">✓</span>
                                <div>
                                  <span className="font-medium">{feature.name}</span>
                                  {feature.description && (
                                    <p className="text-xs text-gray-500">{feature.description}</p>
                                  )}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {mvpPlan.timeline && (
                        <div>
                          <h4 className="text-xs text-gray-500 mb-2">Временные рамки</h4>
                          <div className="space-y-2">
                            {Object.entries(mvpPlan.timeline).map(([phase, duration]: [string, any], index: number) => (
                              <div key={index} className="flex justify-between items-center">
                                <span className="text-sm capitalize">{phase}</span>
                                <span className="text-sm">{duration}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {mvpPlan.budget && (
                        <div>
                          <h4 className="text-xs text-gray-500 mb-2">Бюджет MVP</h4>
                          <div className="p-3 bg-gray-50 rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Общий бюджет:</span>
                              <span className="text-sm font-medium">${formatNumber(mvpPlan.budget)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Технологии</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Next.js</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">React</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Tailwind CSS</span>
                          {project.industry === "Fintech" && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Blockchain</span>
                          )}
                          {project.niche === "AI" && (
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">TensorFlow</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-center text-gray-500">MVP не требуется</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
