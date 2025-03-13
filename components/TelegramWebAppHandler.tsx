"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
        }
        ready: () => void
        expand: () => void
      }
    }
  }
}

export default function TelegramWebAppHandler() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const telegramUser = window.Telegram.WebApp.initDataUnsafe.user
      if (telegramUser) {
        setUser(telegramUser)
        saveUserData(telegramUser)
      }

      window.Telegram.WebApp.ready()
      window.Telegram.WebApp.expand()
    }
    setIsLoading(false)
  }, [])

  const saveUserData = async (telegramUser: any) => {
    try {
      const response = await fetch("/api/telegram/user-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramUser }),
      })
      const result = await response.json()

      if (!result.success) {
        console.error("Failed to save user data:", result.error)
      }
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!window.Telegram?.WebApp) {
    return <div>This app must be opened in Telegram.</div>
  }

  return <div>{user ? <p>Welcome, {user.first_name}!</p> : <p>No user data available</p>}</div>
}

