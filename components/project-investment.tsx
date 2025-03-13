"\"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Wallet, CreditCard, ArrowRight, Info, Shield, Sparkles } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface ProjectInvestmentProps {
  project: {
    id: string
    name: string
    tokenSymbol: string
    tokenPrice: number
    nftPrice: number
    availableTokens: number
    availableNFTs: number
  }
  onClose: () => void
}

export default function ProjectInvestment({ project, onClose }: ProjectInvestmentProps) {
  const { toast } = useToast()
  const [investmentType, setInvestmentType] = useState<"token" | "nft">("token")
  const [amount, setAmount] = useState("")

  const handleInvest = () => {
    // Here would be the actual investment logic
    toast({
      title: "Инвестиция выполнена!",
      description: `Вы успешно инвестировали в ${project.name}`,
      variant: "success",
    })
    onClose()
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 border">
        <h2 className="text-xl font-bold mb-6">Инвестировать в {project.name}</h2>

        <div className="space-y-6">
          <div className="flex space-x-4">
            <Button
              variant={investmentType === "token" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setInvestmentType("token")}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Токены
            </Button>
            <Button
              variant={investmentType === "nft" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setInvestmentType("nft")}
            >
              <Shield className="w-4 h-4 mr-2" />
              NFT
            </Button>
          </div>

          {investmentType === "token" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-3 bg-primary/5 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Цена токена:</span>
                  <span className="font-medium">${project.tokenPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Доступно:</span>
                  <span className="font-medium">
                    {project.availableTokens} {project.tokenSymbol}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Количество токенов</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`Введите количество ${project.tokenSymbol}`}
                />
                <p className="text-sm text-gray-500 mt-1">Итого: ${(Number(amount) * project.tokenPrice).toFixed(2)}</p>
              </div>
            </motion.div>
          )}

          {investmentType === "nft" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="p-3 bg-primary/5 rounded-lg">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Цена NFT:</span>
                  <span className="font-medium">${project.nftPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Доступно:</span>
                  <span className="font-medium">{project.availableNFTs} NFT</span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-2">Преимущества владения NFT:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Info className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                    Доля в прибыли проекта (0.5%)
                  </li>
                  <li className="flex items-start">
                    <Info className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                    Право голоса в управлении
                  </li>
                  <li className="flex items-start">
                    <Info className="w-4 h-4 mr-2 mt-0.5 text-primary" />
                    Эксклюзивный доступ к функциям
                  </li>
                </ul>
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Способ оплаты</h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center p-3 border rounded-lg hover:border-primary">
                  <Wallet className="w-5 h-5 mr-2" />
                  <span>Криптовалюта</span>
                </button>
                <button className="flex items-center justify-center p-3 border rounded-lg hover:border-primary">
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span>Карта</span>
                </button>
              </div>
            </div>

            <Button className="w-full" onClick={handleInvest}>
              Инвестировать
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

