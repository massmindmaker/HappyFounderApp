"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Coins, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface InvestmentCardProps {
  project: {
    id: number
    name: string
    category: string
    description: string
    tokenSymbol: string
    tokenPrice: number
    targetAmount: number
    raisedAmount: number
    roi: string
    rating: number
    tags: string[]
    iconComponent: React.ReactNode
    iconBg: string
  }
}

export default function InvestmentCard({ project }: InvestmentCardProps) {
  const [isInvesting, setIsInvesting] = useState(false)
  const { toast } = useToast()

  const progressPercentage = (project.raisedAmount / project.targetAmount) * 100

  const handleInvest = () => {
    setIsInvesting(true)

    // Simulate investment process
    setTimeout(() => {
      setIsInvesting(false)
      toast({
        title: "Инвестиция успешна!",
        description: `Вы успешно инвестировали в проект ${project.name}`,
        variant: "success",
      })
    }, 1500)
  }

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow">
      <div className={`relative h-48 ${project.iconBg}`}>
        <div className="absolute top-4 right-4">
          <Badge className="bg-emerald-500">{project.category}</Badge>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            {project.iconComponent}
          </div>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold">{project.name}</h3>
          <div className="flex items-center text-amber-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="ml-1 text-sm font-medium">{project.rating.toFixed(1)}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span>Цена токена:</span>
            <span className="font-medium">{project.tokenPrice.toFixed(2)} TON</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Собрано:</span>
            <span className="font-medium">
              {project.raisedAmount.toLocaleString()} / {project.targetAmount.toLocaleString()} TON
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-sm">
            <span>ROI (12 мес):</span>
            <span className="font-medium text-emerald-500">{project.roi}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm" onClick={handleInvest} disabled={isInvesting}>
            <Coins className="h-4 w-4 mr-2" />
            {isInvesting ? "Обработка..." : "Инвестировать"}
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
