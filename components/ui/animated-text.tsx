"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
  delay?: number
}

export function TypewriterText({ text, className, speed = 50, delay = 0 }: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (delay > 0 && !isTyping) {
      timeout = setTimeout(() => {
        setIsTyping(true)
      }, delay)
      return () => clearTimeout(timeout)
    }

    if (!isTyping) return

    if (currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    }

    return () => clearTimeout(timeout)
  }, [currentIndex, delay, isTyping, speed, text])

  return (
    <span className={className}>
      {displayText}
      {isTyping && currentIndex < text.length && <span className="animate-pulse">|</span>}
    </span>
  )
}

interface GlowingTextProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowingText({ children, className, glowColor = "space-blue" }: GlowingTextProps) {
  return (
    <span
      className={cn(
        `relative inline-block animate-pulse-slow font-bold`,
        `text-${glowColor}`,
        `after:absolute after:inset-0 after:bg-${glowColor}/20 after:blur-sm after:filter`,
        className,
      )}
    >
      {children}
    </span>
  )
}

interface RevealTextProps {
  children: React.ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
}

export function RevealText({ children, className, direction = "up", delay = 0 }: RevealTextProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [delay])

  const getTransformValue = () => {
    switch (direction) {
      case "up":
        return "translateY(20px)"
      case "down":
        return "translateY(-20px)"
      case "left":
        return "translateX(20px)"
      case "right":
        return "translateX(-20px)"
      default:
        return "translateY(20px)"
    }
  }

  return (
    <span
      ref={ref}
      className={cn(
        "inline-block transition-all duration-700 ease-out",
        isVisible ? "opacity-100 transform-none" : "opacity-0",
        className,
      )}
      style={{
        transform: isVisible ? "none" : getTransformValue(),
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </span>
  )
}
