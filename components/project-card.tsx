"use client"

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
} from "lucide-react"

interface ProjectCardProps {
  project: any
  onBack: () => void
  onCreateNFT: () => void
}

export default function ProjectCard({ project, onBack, onCreateNFT }: ProjectCardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!project) return null

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
              <p className="text-sm text-gray-600">{project.niche}</p>
            </div>
            <div className="bg-white p-1.5 rounded-md shadow-sm">
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center">
                {project.niche === "Marketplace" && <Users className="h-5 w-5 text-primary" />}
                {project.niche === "Fintech" && <Wallet className="h-5 w-5 text-primary" />}
                {project.niche === "SaaS" && <Code className="h-5 w-5 text-primary" />}
                {project.niche === "AI" && <Sparkles className="h-5 w-5 text-primary" />}
                {!["Marketplace", "Fintech", "SaaS", "AI"].includes(project.niche) && (
                  <BarChart3 className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          </div>

          <p className="text-sm mb-4">{project.description}</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Ниша</div>
              <div className="font-medium text-sm truncate">{project.niche}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Бюджет</div>
              <div className="font-medium text-sm truncate">{project.budget ? `$${project.budget}` : "Не указан"}</div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-sm">
              <div className="text-xs text-gray-500 mb-1">MVP</div>
              <div className="font-medium text-sm truncate">{project.needMvp ? "Требуется" : "Не требуется"}</div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Поделиться
            </Button>
            <Button size="sm" className="flex-1" onClick={onCreateNFT}>
              <Shield className="h-4 w-4 mr-2" />
              Создать NFT коллекцию
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
              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Структура проекта
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4 space-y-4">
                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Проблема</h4>
                    <p className="text-sm">
                      Потребители хотят покупать экологически чистые продукты, но сталкиваются с проблемой недостоверной
                      информации о происхождении и составе товаров.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Решение</h4>
                    <p className="text-sm">
                      Маркетплейс с системой верификации поставщиков на блокчейне, обеспечивающий прозрачность и
                      достоверность информации о продуктах.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs text-gray-500 mb-1">Целевая аудитория</h4>
                    <p className="text-sm">
                      {project.audience ||
                        "Экологически сознательные потребители, 25-45 лет, средний и выше среднего доход."}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Users className="h-4 w-4 mr-2 text-primary" />
                  Анализ конкурентов
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-sm font-medium">Конкурент</span>
                      <span className="text-sm font-medium">Доля рынка</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">EcoMart</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                          <div className="w-14 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs">58%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">GreenBasket</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                          <div className="w-8 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs">32%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm">OrganicLife</span>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        </div>
                        <span className="text-xs">10%</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h4 className="text-xs text-gray-500 mb-2">Конкурентные преимущества</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Блокчейн-верификация происхождения продуктов
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Система рейтинга поставщиков
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        Программа лояльности с использованием токенов
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <TrendingUp className="h-4 w-4 mr-2 text-primary" />
                  Pitch Deck
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
                  <div className="aspect-video bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    <img src="/placeholder.svg?height=180&width=320" alt="Pitch Deck Preview" className="rounded-md" />
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Скачать Pitch Deck (PDF)
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="finance" className="p-4 mt-0">
            <div className="space-y-6">
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
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-10"></div>
                            <div className="text-xs mt-1">Q1</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-16"></div>
                            <div className="text-xs mt-1">Q2</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-24"></div>
                            <div className="text-xs mt-1">Q3</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-32"></div>
                            <div className="text-xs mt-1">Q4</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-40"></div>
                            <div className="text-xs mt-1">Q5</div>
                          </div>
                          <div className="flex-1 flex flex-col justify-end">
                            <div className="bg-primary/20 rounded-t-sm h-48"></div>
                            <div className="text-xs mt-1">Q6</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Источники дохода</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Комиссия с продаж</span>
                          <span className="text-sm font-medium">70%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Подписка для поставщиков</span>
                          <span className="text-sm font-medium">20%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Премиум-листинг</span>
                          <span className="text-sm font-medium">10%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Точка безубыточности</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Месячные расходы:</span>
                          <span className="text-sm font-medium">$12,500</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Средний чек:</span>
                          <span className="text-sm font-medium">$45</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Средняя комиссия:</span>
                          <span className="text-sm font-medium">$4.5 (10%)</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Необходимо заказов:</span>
                            <span className="text-sm font-medium text-primary">2,778 / месяц</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium flex items-center mb-3">
                  <Wallet className="h-4 w-4 mr-2 text-primary" />
                  Токеномика
                </h3>
                <div className="bg-white rounded-lg shadow-sm p-4">
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
                          <div className="text-xs font-medium">$ECO</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Тип токена</h4>
                      <p className="text-sm">Utility + Governance</p>
                    </div>

                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Общее предложение</h4>
                      <p className="text-sm">100,000,000 $ECO</p>
                    </div>

                    <div>
                      <h4 className="text-xs text-gray-500 mb-1">Распределение</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Команда</span>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                              <div className="w-4.8 h-2 bg-primary rounded-full" />
                            </div>
                            <span className="text-xs">20%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs">Инвесторы</span>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                              <div className="w-7.2 h-2 bg-primary rounded-full" />
                            </div>
                            <span className="text-xs">30%</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <span className="text-xs">Экосистема</span>
                          <div className="flex items-center">
                            <div className="w-24 h-2 bg-gray-100 rounded-full mr-2">
                              <div className="w-12 h-2 bg-primary rounded-full" />
                            </div>
                            <span className="text-xs">50%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                            <span className="text-sm">Партнерства с эко-блогерами</span>
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

                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Стоимость привлечения клиента (CAC)</h4>
                      <div className="p-3 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Социальные сети:</span>
                          <span className="text-sm font-medium">$15</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Контент-маркетинг:</span>
                          <span className="text-sm font-medium">$12</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm">Партнерства:</span>
                          <span className="text-sm font-medium">$18</span>
                        </div>
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Средний CAC:</span>
                            <span className="text-sm font-medium text-primary">$15</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs text-gray-500 mb-2">Виральные механики</h4>
                      <ul className="text-sm space-y-2">
                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-primary">1</span>
                          </div>
                          <div>
                            <span className="font-medium">Реферальная программа</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Пользователи получают токены за приглашение друзей
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-primary">2</span>
                          </div>
                          <div>
                            <span className="font-medium">Социальные челленджи</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Экологические челленджи с хэштегами в социальных сетях
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center mr-2 mt-0.5">
                            <span className="text-xs text-primary">3</span>
                          </div>
                          <div>
                            <span className="font-medium">NFT за лояльность</span>
                            <p className="text-xs text-gray-500 mt-0.5">
                              Коллекционные NFT за дос��ижения в экологичном потреблении
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
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
                      <span className="text-sm">Поставщики через 12 месяцев:</span>
                      <span className="text-sm font-medium">~500</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mvp" className="p-4 mt-0">
            {project.needMvp ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium flex items-center mb-3">
                    <Code className="h-4 w-4 mr-2 text-primary" />
                    MVP Прототип
                  </h3>
                  <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="aspect-video bg-gray-100 rounded-md mb-4 overflow-hidden">
                      <img
                        src="/placeholder.svg?height=180&width=320"
                        alt="MVP Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Основные функции MVP</h4>
                        <ul className="text-sm space-y-1">
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Каталог экологичных продуктов
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Профили поставщиков с верификацией
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Система отзывов и рейтингов
                          </li>
                          <li className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            Базовая корзина и оформление заказа
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Технологии</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Next.js</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">React</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">Tailwind CSS</span>
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
