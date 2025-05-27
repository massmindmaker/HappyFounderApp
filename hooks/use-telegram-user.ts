"use client"

import { useState, useEffect } from "react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
}

export function useTelegramUser() {
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkTelegramUser = () => {
      // Проверяем данные в Telegram Web App
      if (typeof window !== "undefined" && window.Telegram?.WebApp?.initDataUnsafe?.user) {
        setUser(window.Telegram.WebApp.initDataUnsafe.user)
        setIsLoading(false)
        return
      }

      // Проверяем данные в localStorage
      const savedUser = localStorage.getItem("telegramUser")
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error("Failed to parse user data from localStorage")
        }
      }

      setIsLoading(false)
    }

    checkTelegramUser()
  }, [])

  return { user, isLoading }
}
