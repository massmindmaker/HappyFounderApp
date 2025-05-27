"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Wallet, Check, X, Loader2 } from "lucide-react"

interface WalletConnectionProps {
  onConnection: (success: boolean) => void
}

export default function WalletConnection({ onConnection }: WalletConnectionProps) {
  const [connecting, setConnecting] = useState(false)
  const [checking, setChecking] = useState(false)
  const [hasNFT, setHasNFT] = useState(false)
  const [checkComplete, setCheckComplete] = useState(false)

  const handleConnect = () => {
    setConnecting(true)

    // Simulate wallet connection
    setTimeout(() => {
      setConnecting(false)
      setChecking(true)

      // Simulate NFT check (3-4 seconds)
      setTimeout(() => {
        // For demo purposes, randomly determine if user has NFT
        const hasNFT = Math.random() > 0.3
        setHasNFT(hasNFT)
        setChecking(false)
        setCheckComplete(true)

        // After showing result, proceed
        setTimeout(() => {
          onConnection(true)
        }, 2000)
      }, 3500)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full max-w-md mx-auto">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Подключение кошелька</h1>
        <p className="text-gray-600">Для доступа к полному функционалу приложения, подключите ваш Web3 кошелек</p>
      </motion.div>

      <div className="w-full bg-white rounded-lg shadow-sm p-6 mb-6">
        {!connecting && !checking && !checkComplete && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <p className="text-center text-sm text-gray-500 mb-6">
              Мы проверим наличие NFT для доступа к премиум-функциям
            </p>
            <Button onClick={handleConnect} className="w-full">
              Подключить кошелек
            </Button>
          </motion.div>
        )}

        {connecting && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-center font-medium">Подключение кошелька...</p>
          </motion.div>
        )}

        {checking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
              <motion.div
                className="bg-primary h-2.5 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3.5 }}
              />
            </div>
            <p className="text-center font-medium mb-2">Проверка наличия NFT</p>
            <p className="text-center text-sm text-gray-500">Это займет несколько секунд</p>
          </motion.div>
        )}

        {checkComplete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
            <div
              className={`w-16 h-16 ${hasNFT ? "bg-green-100" : "bg-amber-100"} rounded-full flex items-center justify-center mb-4`}
            >
              {hasNFT ? <Check className="h-8 w-8 text-green-600" /> : <X className="h-8 w-8 text-amber-600" />}
            </div>
            <h3 className="font-medium text-lg mb-2">{hasNFT ? "NFT найден!" : "NFT не найден"}</h3>
            <p className="text-center text-sm text-gray-500 mb-4">
              {hasNFT
                ? "Вам доступны все премиум-функции приложения"
                : "Вы можете использовать базовые функции приложения"}
            </p>
            <p className="text-xs text-gray-400">Переход на следующий экран...</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
