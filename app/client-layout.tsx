"use client"

import type React from "react"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { ThemeProvider } from "@/lib/theme-context"
import { Toaster } from "@/components/toaster"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [supabaseClient] = useState(() => createClientComponentClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <ThemeProvider>
        {children}
        <Toaster />
      </ThemeProvider>
    </SessionContextProvider>
  )
}
