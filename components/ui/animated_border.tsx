"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedBorderProps {
  children: React.ReactNode
  className?: string
  borderClassName?: string
  animationType?: "pulse" | "gradient" | "radar" | "none"
  borderWidth?: number
  borderRadius?: string
  gradientColors?: string[]
  pulseColor?: string
  pulseSpeed?: number
}

export function AnimatedBorder({
  children,
  className,
  borderClassName,
  animationType = "pulse",
  borderWidth = 2,
  borderRadius = "rounded-lg",
  gradientColors = ["from-space-blue", "via-space-purple", "to-space-teal"],
  pulseColor = "space-blue",
  pulseSpeed = 2,
}: AnimatedBorderProps) {
  const [isHovered, setIsHovered] = useState(false)
  const gradientRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (animationType !== "gradient" || !gradientRef.current) return

    const animateGradient = () => {
      const element = gradientRef.current
      if (!element) return

      let rotation = 0

      const animate = () => {
        rotation = (rotation + 0.2) % 360
        element.style.backgroundImage = `linear-gradient(${rotation}deg, var(--space-blue), var(--space-purple), var(--space-teal), var(--space-blue))`
        requestAnimationFrame(animate)
      }

      const animationId = requestAnimationFrame(animate)
      return () => cancelAnimationFrame(animationId)
    }

    const cleanup = animateGradient()
    return cleanup
  }, [animationType])

  const getBorderStyles = () => {
    switch (animationType) {
      case "pulse":
        return cn(
          "absolute inset-0",
          borderRadius,
          `border-${borderWidth} border-${pulseColor}`,
          `animate-pulse-border-${pulseSpeed}`,
        )
      case "gradient":
        return cn("absolute inset-0 bg-gradient-to-r", borderRadius, ...gradientColors, "animate-gradient-x")
      case "radar":
        return cn(
          "absolute inset-0",
          borderRadius,
          `border-${borderWidth} border-${pulseColor}`,
          "after:absolute after:inset-0",
          `after:border-${borderWidth} after:border-${pulseColor}/50`,
          "after:scale-[1.1] after:opacity-0",
          "after:animate-radar",
        )
      default:
        return cn("absolute inset-0", borderRadius, `border-${borderWidth} border-muted`)
    }
  }

  return (
    <div
      className={cn("relative", borderRadius, className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={gradientRef}
        className={cn(
          getBorderStyles(),
          borderClassName,
          animationType === "gradient" && "bg-clip-border p-[2px]",
          isHovered && animationType === "none" && "border-primary transition-colors duration-300",
        )}
      >
        {animationType === "gradient" && <div className={cn("absolute inset-0 bg-card", borderRadius)} />}
      </div>
      <div className={cn("relative z-10", animationType === "gradient" && "p-[2px]")}>{children}</div>
    </div>
  )
}

interface AnimatedGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  glowSize?: "sm" | "md" | "lg"
  glowOpacity?: number
  pulseAnimation?: boolean
}

export function AnimatedGlow({
  children,
  className,
  glowColor = "space-blue",
  glowSize = "md",
  glowOpacity = 0.15,
  pulseAnimation = true,
}: AnimatedGlowProps) {
  const sizeMap = {
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-xl",
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "absolute inset-0 -z-10 rounded-lg bg-opacity-50",
          sizeMap[glowSize],
          pulseAnimation && "animate-pulse-slow",
          `bg-${glowColor}`,
        )}
        style={{ opacity: glowOpacity }}
      />
      {children}
    </div>
  )
}
