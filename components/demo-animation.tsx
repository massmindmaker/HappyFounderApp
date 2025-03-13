"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Loader2 } from "lucide-react"

interface DemoAnimationProps {
  onComplete: () => void
}

export default function DemoAnimation({ onComplete }: DemoAnimationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [currentSubStep, setCurrentSubStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    {
      title: "Создание бизнес-проекта",
      subSteps: [
        "Analyzing business idea...",
        "Identifying problem and solution...",
        "Defining target audience...",
        "Researching market size...",
        "Generating project structure...",
      ],
      description: "Using GPT-4 to analyze your business idea and generate a comprehensive project structure.",
    },
    {
      title: "Анализ конкурентов",
      subSteps: [
        "Searching for competitors...",
        "Analyzing market positioning...",
        "Gathering funding information...",
        "Analyzing user reviews...",
      ],
      description: "Using Crunchbase and SerpAPI to find relevant competitors.",
    },
    {
      title: "Создание финансовой модели",
      subSteps: [
        "Calculating revenue streams...",
        "Estimating operational costs...",
        "Projecting customer acquisition...",
        "Calculating break-even point...",
      ],
      description: "Using AI to generate realistic financial projections.",
    },
    {
      title: "Создание маркетингового плана",
      subSteps: [
        "Identifying target channels...",
        "Calculating acquisition costs...",
        "Creating content strategy...",
        "Designing viral mechanics...",
      ],
      description: "Using AI to create an effective marketing strategy.",
    },
    {
      title: "Создание Pitch Deck",
      subSteps: [
        "Creating slide structure...",
        "Generating visuals...",
        "Formatting content...",
        "Preparing export files...",
      ],
      description: "Using AI to create a professional pitch deck.",
    },
    {
      title: "Создание MVP продукта",
      subSteps: [
        "Designing user interface...",
        "Creating component structure...",
        "Implementing core features...",
        "Deploying prototype...",
      ],
      description: "Using v0.dev to generate a no-code prototype.",
    },
  ]

  useEffect(() => {
    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        if (currentSubStep < steps[currentStep].subSteps.length - 1) {
          setCurrentSubStep(currentSubStep + 1)
          setProgress(((currentSubStep + 1) / steps[currentStep].subSteps.length) * 100)
        } else {
          setProgress(100)
          setTimeout(() => {
            if (currentStep < steps.length - 1) {
              setCurrentStep(currentStep + 1)
              setCurrentSubStep(0)
              setProgress(0)
            } else {
              // All steps complete
              setTimeout(() => {
                onComplete()
              }, 1000)
            }
          }, 1000)
        }
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [currentStep, currentSubStep, onComplete]) // Added onComplete to dependencies

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full max-w-md mx-auto">
      {currentStep < steps.length && (
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="w-full"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold mb-2">{steps[currentStep].title}</h2>
            <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <motion.div
                className="bg-primary h-2 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="space-y-4">
              {steps[currentStep].subSteps.map((subStep, index) => (
                <div key={index} className="flex items-center">
                  {index < currentSubStep && (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <motion.svg
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                  )}

                  {index === currentSubStep && (
                    <div className="w-5 h-5 mr-3 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    </div>
                  )}

                  {index > currentSubStep && <div className="w-5 h-5 rounded-full border border-gray-200 mr-3" />}

                  <span className={`text-sm ${index <= currentSubStep ? "text-gray-900" : "text-gray-400"}`}>
                    {subStep}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {currentStep >= steps.length && (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Демонстрация завершена</h2>
          <p className="text-gray-500 mb-8">Теперь вы можете создать свой первый бизнес-проект</p>
          <Button onClick={onComplete} className="w-full">
            Перейти к приложению <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}

