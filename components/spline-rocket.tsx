"use client"

import { useState, useEffect } from "react"
import Spline from "@splinetool/react-spline"
import { Skeleton } from "@/components/ui/skeleton"

export function SplineRocket() {
  const [isLoading, setIsLoading] = useState(true)
  const [splineApp, setSplineApp] = useState(null)

  const handleLoad = (splineApp) => {
    setSplineApp(splineApp)
    setIsLoading(false)
  }

  useEffect(() => {
    // Add event listeners for hover effects when splineApp is loaded
    if (splineApp) {
      const rocketObj = splineApp.findObjectByName("Rocket")

      if (rocketObj) {
        // Add hover effect
        const handleMouseEnter = () => {
          splineApp.emitEvent("mouseHover", "start")
        }

        const handleMouseLeave = () => {
          splineApp.emitEvent("mouseHover", "end")
        }

        // Add click effect
        const handleClick = () => {
          splineApp.emitEvent("rocketClick")
        }

        // Add event listeners to the document
        document.addEventListener("mousemove", (e) => {
          // Get the position of the rocket in the viewport
          const rocketElement = document.querySelector(".spline-rocket")
          if (rocketElement) {
            const rect = rocketElement.getBoundingClientRect()
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2

            // Calculate distance from mouse to center of rocket
            const dx = e.clientX - centerX
            const dy = e.clientY - centerY
            const distance = Math.sqrt(dx * dx + dy * dy)

            // If mouse is close to the rocket, trigger hover effect
            if (distance < rect.width / 2) {
              handleMouseEnter()
            } else {
              handleMouseLeave()
            }
          }
        })

        // Add click event listener
        document.addEventListener("click", (e) => {
          const rocketElement = document.querySelector(".spline-rocket")
          if (rocketElement) {
            const rect = rocketElement.getBoundingClientRect()
            if (
              e.clientX >= rect.left &&
              e.clientX <= rect.right &&
              e.clientY >= rect.top &&
              e.clientY <= rect.bottom
            ) {
              handleClick()
            }
          }
        })
      }
    }
  }, [splineApp])

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Skeleton className="w-full h-full bg-muted/20" />
          <div className="absolute text-muted-foreground animate-pulse">Loading 3D Model...</div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/SQtXB9LJCpfudmRi/scene.splinecode"
        onLoad={handleLoad}
        className={`w-full h-full transform-gpu spline-rocket ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
      />
    </div>
  )
}
