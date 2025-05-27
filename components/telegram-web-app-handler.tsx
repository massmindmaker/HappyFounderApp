"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
          }
          start_param?: string
        }
        ready: () => void
        expand: () => void
        MainButton: {
          text: string
          show: () => void
          hide: () => void
          onClick: (callback: () => void) => void
        }
      }
    }
  }
}

export function TelegramWebAppHandler() {
  useEffect(() => {
    const checkTelegramWebApp = () => {
      if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
        // Инициализация Telegram Web App
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()

        // Получение данных пользователя
        const telegramUser = window.Telegram?.WebApp?.initDataUnsafe.user
        if (telegramUser) {
          // Сохраняем данные пользователя в localStorage для использования в приложении
          localStorage.setItem("telegramUser", JSON.stringify(telegramUser))
          console.log("Telegram user data:", telegramUser)
        }
      } else {
        // Если Telegram Web App не доступен, пробуем снова через 100мс
        setTimeout(checkTelegramWebApp, 100)
      }
    }

    checkTelegramWebApp()
  }, [])

  return null
}
