"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { AnimatedBorder } from "@/components/ui/animated-border"

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-9 h-9" />
  }

  return (
    <AnimatedBorder animationType="pulse" pulseColor="space-blue" borderWidth={1}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative overflow-hidden"
      >
        <span className="sr-only">Toggle theme</span>
        <Sun
          className={`h-5 w-5 transition-all duration-500 ${
            theme === "dark" ? "rotate-0 scale-100" : "rotate-90 scale-0"
          } absolute`}
        />
        <Moon
          className={`h-5 w-5 transition-all duration-500 ${
            theme === "dark" ? "-rotate-90 scale-0" : "rotate-0 scale-100"
          } absolute`}
        />
      </Button>
    </AnimatedBorder>
  )
}
