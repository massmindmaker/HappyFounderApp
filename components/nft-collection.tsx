"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft, Plus, Trash2, ImageIcon, Upload, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ImageService } from "@/lib/image-service"

interface NFTCollectionProps {
  projectId: number
  onBack: () => void
  onComplete: () => void
}

export default function NFTCollection({ projectId, onBack, onComplete }: NFTCollectionProps) {
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3
  const [imageError, setImageError] = useState(false)

  const [collectionData, setCollectionData] = useState({
    name: "",
    symbol: "",
    description: "",
    supply: 1000,
    price: 0.05,
    royalties: 5,
    tiers: [
      { name: "Common", supply: 700, benefits: "Базовый доступ к проекту" },
      { name: "Rare", supply: 250, benefits: "Доступ к закрытым функциям" },
      { name: "Legendary", supply: 50, benefits: "Доля в прибыли проекта (0.5%)" },
    ],
    publicMint: true,
    whitelistMint: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCollectionData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (name: string, value: number) => {
    setCollectionData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCollectionData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleTierChange = (index: number, field: string, value: any) => {
    setCollectionData((prev) => {
      const newTiers = [...prev.tiers]
      newTiers[index] = { ...newTiers[index], [field]: value }
      return { ...prev, tiers: newTiers }
    })
  }

  const addTier = () => {
    if (collectionData.tiers.length < 5) {
      setCollectionData((prev) => ({
        ...prev,
        tiers: [...prev.tiers, { name: "New Tier", supply: 100, benefits: "" }],
      }))
    } else {
      toast({
        title: "Ограничение",
        description: "Максимальное количество уровней: 5",
        variant: "destructive",
      })
    }
  }

  const removeTier = (index: number) => {
    if (collectionData.tiers.length > 1) {
      setCollectionData((prev) => ({
        ...prev,
        tiers: prev.tiers.filter((_, i) => i !== index),
      }))
    } else {
      toast({
        title: "Ограничение",
        description: "Должен быть хотя бы один уровень",
        variant: "destructive",
      })
    }
  }

  const handleAutoGenerate = () => {
    toast({
      title: "Генерация NFT",
      description: "Создание коллекции с помощью AI...",
      duration: 2000,
    })

    // Simulate AI generation
    setTimeout(() => {
      setCollectionData({
        name: "EcoMarket Founders",
        symbol: "EMF",
        description:
          "Коллекция NFT для ранних инвесторов и пользователей экологического маркетплейса EcoMarket. Владельцы получают эксклюзивные привилегии и долю в прибыли проекта.",
        supply: 1000,
        price: 0.08,
        royalties: 7.5,
        tiers: [
          {
            name: "Green Supporter",
            supply: 700,
            benefits: "Скидка 10% на все покупки, ранний доступ к новым продуктам",
          },
          {
            name: "Eco Investor",
            supply: 250,
            benefits: "Скидка 20%, доступ к закрытым распродажам, ежемесячный кэшбэк",
          },
          {
            name: "Sustainability Pioneer",
            supply: 50,
            benefits: "Доля в прибыли 0.5%, право голоса в развитии платформы, VIP-поддержка",
          },
        ],
        publicMint: true,
        whitelistMint: true,
      })

      toast({
        title: "Готово!",
        description: "Коллекция NFT сгенерирована успешно",
        variant: "success",
      })
    }, 2500)
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  // Обработчик ошибок загрузки изображений
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    ImageService.handleImageError(e)
    setImageError(true)
  }

  return (
    <div className="w-full max-w-md mx-auto h-screen flex flex-col">
      <header className="py-4 px-4 border-b flex items-center">
        <Button variant="ghost" size="icon" onClick={prevStep} className="mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Создание NFT-коллекции</h1>
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
            <span>Уровни NFT</span>
            <span>Настройки минта</span>
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
              <Button variant="outline" size="sm" onClick={handleAutoGenerate} className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                AI-генерация
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Название коллекции</Label>
                <Input
                  id="name"
                  name="name"
                  value={collectionData.name}
                  onChange={handleChange}
                  placeholder="Например: Project Founders"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Символ токена</Label>
                <Input
                  id="symbol"
                  name="symbol"
                  value={collectionData.symbol}
                  onChange={handleChange}
                  placeholder="Например: PFT"
                  maxLength={5}
                />
                <p className="text-xs text-gray-500">Короткий символ для вашего NFT (до 5 символов)</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание коллекции</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={collectionData.description}
                  onChange={handleChange}
                  placeholder="Опишите вашу NFT-коллекцию и ее преимущества"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supply">Общее количество NFT</Label>
                <div className="flex items-center">
                  <Input
                    id="supply"
                    type="number"
                    value={collectionData.supply}
                    onChange={(e) => handleNumberChange("supply", Number.parseInt(e.target.value))}
                    min={1}
                    max={10000}
                    className="w-24 mr-4"
                  />
                  <Slider
                    value={[collectionData.supply]}
                    min={1}
                    max={10000}
                    step={1}
                    onValueChange={(value) => handleNumberChange("supply", value[0])}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Цена (ETH)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={collectionData.price}
                    onChange={(e) => handleNumberChange("price", Number.parseFloat(e.target.value))}
                    min={0.001}
                    step={0.001}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="royalties">Роялти (%)</Label>
                  <Input
                    id="royalties"
                    type="number"
                    value={collectionData.royalties}
                    onChange={(e) => handleNumberChange("royalties", Number.parseFloat(e.target.value))}
                    min={0}
                    max={15}
                    step={0.5}
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-lg">
                <div className="flex items-center mb-2">
                  <ImageIcon className="h-5 w-5 text-primary mr-2" />
                  <h3 className="text-sm font-medium">Изображения NFT</h3>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Загрузите изображения для вашей коллекции или используйте AI-генерацию
                </p>
                <Button variant="outline" className="w-full flex items-center justify-center h-20 border-dashed">
                  <Upload className="h-5 w-5 mr-2" />
                  <span>Загрузить изображения</span>
                </Button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Уровни NFT</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={addTier}
                className="flex items-center"
                disabled={collectionData.tiers.length >= 5}
              >
                <Plus className="h-4 w-4 mr-2" />
                Добавить
              </Button>
            </div>

            <div className="space-y-4">
              {collectionData.tiers.map((tier, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">Уровень {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTier(index)}
                      disabled={collectionData.tiers.length <= 1}
                      className="h-8 w-8 p-0 text-gray-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor={`tier-name-${index}`}>Название уровня</Label>
                      <Input
                        id={`tier-name-${index}`}
                        value={tier.name}
                        onChange={(e) => handleTierChange(index, "name", e.target.value)}
                        placeholder="Например: Common, Rare, Legendary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tier-supply-${index}`}>Количество NFT</Label>
                      <div className="flex items-center">
                        <Input
                          id={`tier-supply-${index}`}
                          type="number"
                          value={tier.supply}
                          onChange={(e) => handleTierChange(index, "supply", Number.parseInt(e.target.value))}
                          min={1}
                          max={collectionData.supply}
                          className="w-20 mr-3"
                        />
                        <div className="text-xs text-gray-500">
                          {Math.round((tier.supply / collectionData.supply) * 100)}% от общего количества
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tier-benefits-${index}`}>Преимущества</Label>
                      <Textarea
                        id={`tier-benefits-${index}`}
                        value={tier.benefits}
                        onChange={(e) => handleTierChange(index, "benefits", e.target.value)}
                        placeholder="Опишите преимущества этого уровня NFT"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p className="font-medium mb-2">Рекомендации:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Создайте несколько уровней редкости для вашей коллекции</li>
                  <li>Предоставьте уникальные преимущества для каждого уровня</li>
                  <li>Более редкие NFT должны иметь более ценные преимущества</li>
                  <li>Убедитесь, что общее количество NFT по уровням равно общему размеру коллекции</li>
                </ul>
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
            <h2 className="text-lg font-semibold mb-6">Настройки минта</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="publicMint" className="text-base">
                    Публичный минт
                  </Label>
                  <p className="text-xs text-gray-500">Любой пользователь может приобрести NFT</p>
                </div>
                <Switch
                  id="publicMint"
                  checked={collectionData.publicMint}
                  onCheckedChange={(checked) => handleSwitchChange("publicMint", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                <div className="space-y-0.5">
                  <Label htmlFor="whitelistMint" className="text-base">
                    Вайтлист
                  </Label>
                  <p className="text-xs text-gray-500">Только пользователи из списка могут приобрести NFT раньше</p>
                </div>
                <Switch
                  id="whitelistMint"
                  checked={collectionData.whitelistMint}
                  onCheckedChange={(checked) => handleSwitchChange("whitelistMint", checked)}
                />
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="text-sm font-medium mb-3">Интеграция с проектом</h3>
                <p className="text-xs text-gray-500 mb-4">
                  NFT-коллекция будет автоматически связана с вашим проектом и предоставит указанные преимущества
                  владельцам
                </p>
                <div className="p-3 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs">Проект: EcoMarket</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs">ID проекта: {projectId}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-medium mb-3">Сводка коллекции:</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Название:</span>
                    <span className="font-medium">{collectionData.name || "Не указано"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Символ:</span>
                    <span className="font-medium">{collectionData.symbol || "Не указано"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Количество:</span>
                    <span className="font-medium">{collectionData.supply} NFT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Цена:</span>
                    <span className="font-medium">{collectionData.price} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Уровни:</span>
                    <span className="font-medium">{collectionData.tiers.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex space-x-3">
          <Button variant="outline" onClick={prevStep} className="flex-1">
            {currentStep === 1 ? "Отмена" : "Назад"}
          </Button>
          <Button onClick={nextStep} className="flex-1">
            {currentStep === totalSteps ? "Создать коллекцию" : "Далее"}
          </Button>
        </div>
      </div>
    </div>
  )
}
