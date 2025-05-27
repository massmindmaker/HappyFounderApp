"use client"

import { useEffect, useState } from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string
        initDataUnsafe: {
          user?: {
            id: number
            first_name: string
            last_name?: string
            username?: string
            language_code?: string
          }
        }
      }
    }
  }
}

export default function TelegramWebAppAuth() {
  const [user, setUser] = useState<any>(null)
  const supabase = useSupabaseClient()

  useEffect(() => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe.user
    if (telegramUser) {
      setUser(telegramUser)
      authenticateUser(telegramUser)
    }
  }, [])

  const authenticateUser = async (telegramUser: any) => {
    try {
      const response = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramUser }),
      })
      const { session } = await response.json()

      if (session) {
        await supabase.auth.setSession(session)
        updateProfile(session.user.id, telegramUser)
      }
    } catch (error) {
      console.error("Authentication error:", error)
    }
  }

  const updateProfile = async (userId: string, telegramUser: any) => {
    const { error } = await supabase.from("profiles").upsert({
      id: userId,
      telegram_id: telegramUser.id.toString(),
      username: telegramUser.username,
      full_name: `${telegramUser.first_name} ${telegramUser.last_name || ""}`.trim(),
    })

    if (error) console.error("Error updating profile:", error)
  }

  useEffect(() => {
    window.Telegram.WebApp.onEvent("viewportChanged", () => {
      if (!window.Telegram.WebApp.isExpanded) {
        supabase.auth.signOut()
      }
    })
  }, [supabase])

  return <div>{user ? <p>Welcome, {user.first_name}!</p> : <p>Loading user data...</p>}</div>
}
