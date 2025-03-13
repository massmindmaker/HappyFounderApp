"use client"

import { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { useToast } from "@/components/ui/use-toast"

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
      }
    }
  }
}

export function TelegramWebAppHandler() {
  const supabase = useSupabaseClient()
  const { toast } = useToast()
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const checkTelegramWebApp = () => {
      if (typeof window !== "undefined" && window.Telegram && window.Telegram.WebApp) {
        setIsReady(true)
      } else {
        setTimeout(checkTelegramWebApp, 100)
      }
    }

    checkTelegramWebApp()
  }, [])

  useEffect(() => {
    const authenticateUser = async () => {
      if (!isReady) return

      const telegramUser = window.Telegram?.WebApp?.initDataUnsafe.user
      const referralCode = window.Telegram?.WebApp?.initDataUnsafe.start_param
      if (telegramUser) {
        try {
          const response = await fetch("/api/auth/telegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ telegramUser, referralCode }),
          })
          const { token, referralLink } = await response.json()

          if (token) {
            await supabase.auth.setSession(token)
            toast({
              title: "Успешная авторизация",
              description: "Вы успешно вошли в приложение",
            })
            localStorage.setItem("referralLink", referralLink)
          }
        } catch (error) {
          console.error("Authentication error:", error)
          toast({
            title: "Ошибка авторизации",
            description: "Не удалось войти в приложение. Попробуйте позже.",
            variant: "destructive",
          })
        }
      }
    }

    if (isReady) {
      authenticateUser()
    }
  }, [isReady, supabase.auth, toast])

  return null
}

