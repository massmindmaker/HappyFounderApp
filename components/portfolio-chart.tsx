"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, ChevronsUpDown } from "lucide-react"

// Mock data for the portfolio chart
const portfolioChartData = [
  { date: "01.01", value: 8500 },
  { date: "01.02", value: 9200 },
  { date: "01.03", value: 8800 },
  { date: "01.04", value: 10500 },
  { date: "01.05", value: 12450 },
]

// Mock data for asset allocation
const allocationData = [
  { name: "EcoChain", value: 45, color: "#10B981" },
  { name: "Neural Gaming", value: 30, color: "#8B5CF6" },
  { name: "DeFi Protocol", value: 15, color: "#3B82F6" },
  { name: "Social Impact", value: 10, color: "#F59E0B" },
]

interface PortfolioChartProps {
  onViewDetails?: () => void
}

export default function PortfolioChart({ onViewDetails }: PortfolioChartProps) {
  const [timeframe, setTimeframe] = useState("month")

  // Calculate portfolio performance
  const initialValue = portfolioChartData[0].value
  const currentValue = portfolioChartData[portfolioChartData.length - 1].value
  const changeValue = currentValue - initialValue
  const changePercent = (changeValue / initialValue) * 100
  const isPositive = changeValue >= 0

  // Render the chart (simplified version without actual chart library)
  const renderChart = () => {
    const maxValue = Math.max(...portfolioChartData.map((item) => item.value))

    return (
      <div className="w-full h-40 mt-4 relative">
        <div className="absolute inset-0 flex items-end">
          {portfolioChartData.map((item, index) => {
            const height = (item.value / maxValue) * 100
            const isLast = index === portfolioChartData.length - 1

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full max-w-[20px] mx-auto rounded-t-sm ${isPositive ? "bg-emerald-500" : "bg-red-500"}`}
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-xs mt-1 text-gray-500">{item.date}</div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Render the allocation chart (simplified version)
  const renderAllocationChart = () => {
    return (
      <div className="mt-4">
        <div className="flex h-4 w-full overflow-hidden rounded-full">
          {allocationData.map((item, index) => (
            <div
              key={index}
              className="h-full"
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color,
              }}
            ></div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          {allocationData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm">{item.name}</span>
              </div>
              <span className="text-sm font-medium">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Портфель инвестиций</CardTitle>
          <Tabs defaultValue={timeframe} onValueChange={setTimeframe} className="h-8">
            <TabsList className="h-8">
              <TabsTrigger value="week" className="text-xs h-8">
                Неделя
              </TabsTrigger>
              <TabsTrigger value="month" className="text-xs h-8">
                Месяц
              </TabsTrigger>
              <TabsTrigger value="year" className="text-xs h-8">
                Год
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">₽12,450</div>
            <div className="flex items-center mt-1">
              <div className={`flex items-center ${isPositive ? "text-emerald-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                <span className="text-sm font-medium">
                  {isPositive ? "+" : ""}
                  {changePercent.toFixed(1)}%
                </span>
              </div>
              <span className="text-sm text-gray-500 ml-2">
                За {timeframe === "week" ? "неделю" : timeframe === "month" ? "месяц" : "год"}
              </span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onViewDetails}>
            <ChevronsUpDown className="h-4 w-4 mr-1" />
            Детали
          </Button>
        </div>

        <Tabs defaultValue="performance" className="mt-4">
          <TabsList className="w-full">
            <TabsTrigger value="performance" className="flex-1">
              Доходность
            </TabsTrigger>
            <TabsTrigger value="allocation" className="flex-1">
              Распределение
            </TabsTrigger>
          </TabsList>
          <TabsContent value="performance" className="p-0">
            {renderChart()}
          </TabsContent>
          <TabsContent value="allocation" className="p-0">
            {renderAllocationChart()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
