"use client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpaceBackground } from "@/components/space-background"
import { TypewriterText, GlowingText, RevealText } from "@/components/ui/animated-text"
import { AnimatedBorder, AnimatedGlow } from "@/components/ui/animated-border"
import { SplineRocket } from "@/components/spline-rocket"

export default function Home() {
  const router = useRouter()

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-blue-50 dark:bg-purple-950">
      {/* Background elements */}
      <SpaceBackground />
      <SplineRocket />

      {/* Content overlay */}
      <div className="container relative z-10 flex flex-1 flex-col items-center justify-center py-16 text-center">
        <div className="space-y-6 backdrop-blur-sm bg-white/10 dark:bg-black/10 p-8 rounded-2xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            <RevealText>StellarVault</RevealText>
            <GlowingText className="block mt-2 text-blue-500 dark:text-blue-400" glowColor="space-blue">
              Space Station Storage
            </GlowingText>
          </h1>

          <p className="mx-auto max-w-[700px] text-gray-700 dark:text-gray-300 md:text-xl">
            <TypewriterText
              text="Efficiently manage storage inside a space station with our advanced 3D visualization and optimization system."
              speed={30}
              delay={1000}
            />
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center mt-8">
            <AnimatedGlow glowColor="space-blue" glowSize="md">
              <Button
                asChild
                size="lg"
                className="gap-2 relative overflow-hidden group bg-gray-900 dark:bg-blue-900 hover:bg-gray-800 dark:hover:bg-blue-800"
              >
                <Link href="/dashboard">
                  <span className="relative z-10">Dashboard</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-space-blue via-space-purple to-space-blue bg-[length:200%_100%] animate-gradient-x opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </Link>
              </Button>
            </AnimatedGlow>

            <AnimatedBorder animationType="pulse" pulseColor="space-blue">
              <Button asChild variant="outline" size="lg" className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </AnimatedBorder>
          </div>
        </div>
      </div>
    </div>
  )
}
