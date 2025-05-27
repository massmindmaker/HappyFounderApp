"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Rocket, Zap, Cpu } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full bg-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="w-32 h-32 bg-[#1a1f2e] rounded-full flex items-center justify-center shadow-lg overflow-hidden p-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_Create_a_visually_striking_highcontrast_ap_2.jpg-DDRNyS3uZqa9GtLvsOFao356Z9x3Eq.jpeg"
              alt="Happy Founder Logo"
              className="w-full h-full object-contain"
            />
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full max-w-md mx-auto bg-white text-black px-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-12">
        <div className="w-32 h-32 bg-[#1a1f2e] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg overflow-hidden p-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Leonardo_Phoenix_10_Create_a_visually_striking_highcontrast_ap_2.jpg-DDRNyS3uZqa9GtLvsOFao356Z9x3Eq.jpeg"
            alt="Happy Founder Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold mb-2">Happy Founder</h1>
        <p className="text-xl text-gray-600 mb-6">Превращаем идеи в успешные бизнес-проекты</p>
      </motion.div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 gap-6 mb-12 w-full"
      >
        <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="mr-4 bg-blue-500 p-3 rounded-full">
            <Cpu className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">AI-аналитика</h3>
            <p className="text-sm text-gray-600">Автоматический анализ рынка и конкурентов</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="mr-4 bg-green-500 p-3 rounded-full">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Финансовая модель</h3>
            <p className="text-sm text-gray-600">Прогнозирование доходов и расходов</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="mr-4 bg-purple-500 p-3 rounded-full">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Маркетинг План</h3>
            <p className="text-sm text-gray-600">Готовая стратегия продвижения вашего продукта</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="mr-4 bg-purple-500 p-3 rounded-full">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Готовый MVP</h3>
            <p className="text-sm text-gray-600">Создание прототипа вашего продукта</p>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <div className="mr-4 bg-purple-500 p-3 rounded-full">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-black">Токеномика</h3>
            <p className="text-sm text-gray-600">А так же создание автоматизированное НФТ коллекции</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="w-full"
      >
        <Button
          size="lg"
          onClick={onStart}
          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105"
        >
          Начать путешествие
        </Button>
      </motion.div>
    </div>
  )
}
