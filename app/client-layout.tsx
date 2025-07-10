"use client"

import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { AuthModal } from "@/components/auth/auth-modal"
import { useEffect } from "react"
import { initMockData } from "@/lib/mock-data"

function MockDataInitializer() {
  useEffect(() => {
    initMockData()
  }, [])
  return null
}

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <MockDataInitializer />
        {children}
        <AuthModal />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}
