"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  opacity: number
}

export function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [particles, setParticles] = useState<Particle[]>([])
  const particlesInitialized = useRef(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Only recreate particles when canvas is resized or on initial render
      if (!particlesInitialized.current) {
        createParticles()
        particlesInitialized.current = true
      }
    }

    // Create particles - moved inside useEffect to avoid recreation on every render
    const createParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 10000)
      const newParticles: Particle[] = []

      const colors =
        theme === "dark" ? ["#ffffff", "#8ab4f8", "#c58af9", "#7ee2b8"] : ["#1a237e", "#311b92", "#01579b", "#004d40"]

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: Math.random() * 0.5 + 0.2,
        })
      }

      setParticles(newParticles)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation
    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

      if (theme === "dark") {
        gradient.addColorStop(0, "rgba(10, 10, 30, 1)")
        gradient.addColorStop(1, "rgba(30, 10, 60, 1)")
      } else {
        gradient.addColorStop(0, "rgba(200, 220, 255, 1)")
        gradient.addColorStop(1, "rgba(220, 230, 255, 1)")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw and update particles
      const updatedParticles = [...particles]

      particles.forEach((particle, index) => {
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle =
          particle.color +
          Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fill()

        // Update particle position
        updatedParticles[index] = {
          ...particle,
          x: particle.x + particle.speedX,
          y: particle.y + particle.speedY,
          // Wrap particles around the screen
          ...(particle.x < 0 && { x: canvas.width }),
          ...(particle.x > canvas.width && { x: 0 }),
          ...(particle.y < 0 && { y: canvas.height }),
          ...(particle.y > canvas.height && { y: 0 }),
          // Randomly change opacity for twinkling effect
          opacity: Math.random() > 0.99 ? Math.random() * 0.5 + 0.2 : particle.opacity,
        }
      })

      // Draw a few larger "planets" or "stars"
      for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 4) * (i + 1)
        const y = (canvas.height / 3) * (Math.sin(Date.now() * 0.0001 + i) + 1.5)
        const size = 20 + i * 15

        const planetGradient = ctx.createRadialGradient(x, y, 0, x, y, size)

        if (theme === "dark") {
          planetGradient.addColorStop(0, i === 0 ? "#ff9d00" : i === 1 ? "#00a3ff" : "#ff5e00")
          planetGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        } else {
          planetGradient.addColorStop(0, i === 0 ? "#ffcf77" : i === 1 ? "#77c0ff" : "#ffae77")
          planetGradient.addColorStop(1, "rgba(255, 255, 255, 0)")
        }

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = planetGradient
        ctx.fill()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme]) // Only depend on theme changes, not particles

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full" />
}
