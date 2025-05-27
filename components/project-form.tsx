"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Sparkles, HelpCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AIOrchestration } from "@/lib/ai-orchestration"
import { ProjectService } from "@/lib/project-service"

interface ProjectFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function ProjectForm({ onSubmit, onCancel }: ProjectFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audience: "",
    industry: "",
    niche: "",
    budget: "",
    monetization: "",
    needMvp: false,
  })

  const [collectionData, setCollectionData] = useState({
    supply: 1000,
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: number) => {
    if (name === "supply") {
      setCollectionData((prev) => ({ ...prev, [name]: value }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.toString() }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, needMvp: checked }))
  }

  const handleAutoComplete = () => {
    toast({
      title: "AI-автозаполнение",
      description: "Генерация данных с помощью GPT-4...",
      duration: 2000,
    })

    // Simulate AI auto-completion
    setTimeout(() => {
      setFormData({
        title: "EcoMarket",
        description: "Маркетплейс экологически чистых продуктов с системой верификации поставщиков на блокчейне",
        audience: "B2C, 25-45 лет, экологически сознательные потребители",
        industry: "E-commerce",
        niche: "Marketplace",
        budget: "50000",
        monetization: "Комиссия с продаж, подписка для поставщиков",
        needMvp: true,
      })

      toast({
        title: "Готово!",
        description: "Данные сгенерированы успешно",
        variant: "success",
      })
    }, 2000)
  }

  const analyzeAndCreateProject = async () => {
    try {
      setIsAnalyzing(true)

      toast({
        title: "Анализ проекта",
        description: "Запуск AI-анализа бизнес-идеи...",
      })

      // Используем AI-оркестрацию для анализа бизнес-идеи
      const result = await AIOrchestration.analyzeBusinessIdea(
        formData.description,
        "user_id", // В реальном приложении здесь будет ID пользователя из Telegram
      )

      if (result.success && result.project) {
        // Обновляем проект с дополнительными данными из формы
        const updatedProject = {
          ...result.project,
          title: formData.title || result.project.title,
          target_audience: formData.audience,
          industry: formData.industry,
          needMvp: formData.needMvp,
          budget: formData.budget ? Number.parseFloat(formData.budget) : undefined,
          monetization: formData.monetization,
          token_symbol: generateTokenSymbol(formData.title),
        }

        // Сохраняем обновленный проект
        ProjectService.updateProject(updatedProject)

        toast({
          title: "Проект создан",
          description: "AI-анализ успешно завершен",
          variant: "success",
        })

        // Передаем проект в родительский компонент
        onSubmit(updatedProject)
      } else {
        throw new Error(result.message)
      }
    } catch (error) {
      console.error("Error creating project:", error)
      toast({
        title: "Ошибка",
        description: "Не удалось создать проект. Пожалуйста, попробуйте еще раз.",
        variant: "destructive",
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      analyzeAndCreateProject()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onCancel()
    }
  }

  // Вспомогательная функция для генерации символа токена
  function generateTokenSymbol(projectName: string) {
    if (!projectName) return "TKN"

    // Генерация 3-4 буквенного символа токена на основе названия проекта
    const words = projectName.split(/\s+/)
    if (words.length >= 3) {
      return (words[0][0] + words[1][0] + words[2][0]).toUpperCase()
    } else if (words.length === 2) {
      return (words[0][0] + words[1][0] + words[1][1]).toUpperCase()
    } else {
      const word = words[0]
      return word.substring(0, Math.min(3, word.length)).toUpperCase()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <header className="py-4 px-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={prevStep} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Создание проекта</h1>
        <div className="ml-auto flex items-center">
          <span className="text-sm text-gray-500">
            Шаг {currentStep}/{totalSteps}
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <div className="w-full bg-gray-100 h-2 rounded-full mb-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Основная информация</span>
            <span>Детали</span>
            <span>Финализация</span>
          </div>
        </div>

        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Основная информация</h2>
              <Button variant="outline" size="sm" onClick={handleAutoComplete} className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-автозаполнение
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Название проекта</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Например: CryptoWallet Pro"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание бизнес-идеи</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Опишите вашу бизнес-идею подробно"
                  rows={5}
                />
                <p className="text-xs text-gray-500 flex items-center">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Чем подробнее описание, тем точнее будет AI-анализ
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Целевая аудитория</Label>
                <Textarea
                  id="audience"
                  name="audience"
                  value={formData.audience}
                  onChange={handleChange}
                  placeholder="B2B/B2C, география, возраст, интересы"
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold mb-6">Детали проекта</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Индустрия</Label>
                <Select onValueChange={(value) => handleSelectChange("industry", value)} value={formData.industry}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите индустрию" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fintech">Финтех</SelectItem>
                    <SelectItem value="E-commerce">Электронная коммерция</SelectItem>
                    <SelectItem value="Healthcare">Здравоохранение</SelectItem>
                    <SelectItem value="Education">Образование</SelectItem>
                    <SelectItem value="Real Estate">Недвижимость</SelectItem>
                    <SelectItem value="Entertainment">Развлечения</SelectItem>
                    <SelectItem value="Transportation">Транспорт</SelectItem>
                    <SelectItem value="Energy">Энергетика</SelectItem>
                    <SelectItem value="Agriculture">Сельское хозяйство</SelectItem>
                    <SelectItem value="Manufacturing">Производство</SelectItem>
                    <SelectItem value="Other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Ниша</Label>
                <Select onValueChange={(value) => handleSelectChange("niche", value)} value={formData.niche}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите нишу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fintech">Финтех</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="AI">Искусственный интеллект</SelectItem>
                    <SelectItem value="Web3">Web3</SelectItem>
                    <SelectItem value="Marketplace">Маркетплейс</SelectItem>
                    <SelectItem value="EdTech">Образование</SelectItem>
                    <SelectItem value="HealthTech">Здравоохранение</SelectItem>
                    <SelectItem value="Other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Ожидаемый бюджет (если есть)</Label>
                <Input
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Например: 50000"
                  type="number"
                />
                <p className="text-xs text-gray-500">В долларах США</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monetization">Модель монетизации (если есть)</Label>
                <Textarea
                  id="monetization"
                  name="monetization"
                  value={formData.monetization}
                  onChange={handleChange}
                  placeholder="Например: подписка, комиссия, реклама"
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold mb-6">Финализация</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="needMvp">Требуется ли MVP?</Label>
                  <p className="text-xs text-gray-500">Создание прототипа вашего продукта</p>
                </div>
                <Switch id="needMvp" checked={formData.needMvp} onCheckedChange={handleSwitchChange} />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                <p className="font-medium mb-2">Что будет сгенерировано:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Структура бизнес-проекта</li>
                  <li>Анализ конкурентов и рынка</li>
                  <li>Финансовая модель</li>
                  <li>Маркетинг-план</li>
                  <li>Токеномика</li>
                  <li>Pitch Deck (PDF)</li>
                  {formData.needMvp && <li>MVP (прототип)</li>}
                </ul>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-medium mb-2">Проверьте введенные данные:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">Название:</span>
                    <span className="font-medium">{formData.title || "Не указано"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">Индустрия:</span>
                    <span className="font-medium">{formData.industry || "Не указана"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">Ниша:</span>
                    <span className="font-medium">{formData.niche || "Не указана"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">Аудитория:</span>
                    <span className="font-medium">{formData.audience || "Не указана"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">Бюджет:</span>
                    <span className="font-medium">{formData.budget ? `$${formData.budget}` : "Не указан"}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-1/3">MVP:</span>
                    <span className="font-medium">{formData.needMvp ? "Требуется" : "Не требуется"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={prevStep} className="flex-1" disabled={isAnalyzing}>
            {currentStep === 1 ? "Отмена" : "Назад"}
          </Button>
          <Button onClick={nextStep} className="flex-1" disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Анализ...
              </>
            ) : currentStep === totalSteps ? (
              "Создать проект"
            ) : (
              "Далее"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
