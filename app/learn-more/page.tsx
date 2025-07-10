import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SpaceBackground } from "@/components/space-background"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RevealText, GlowingText } from "@/components/ui/animated-text"
import { AnimatedBorder } from "@/components/ui/animated-border"
import { ArrowRight, Rocket, Package, Users, Star, LayoutDashboard } from "lucide-react"

export default function LearnMorePage() {
  return (
    <div className="relative min-h-screen bg-blue-50 dark:bg-purple-950">
      <SpaceBackground />

      <div className="container relative z-10 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              <RevealText>Discover Space Station Cargo Management</RevealText>
            </h1>
            <p className="text-xl text-muted-foreground">
              <RevealText direction="up" delay={200}>
                Explore the features that make our system the best choice for space logistics
              </RevealText>
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 mb-12">
            <AnimatedBorder animationType="pulse" pulseColor="space-blue">
              <Card className="border-0 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-space-blue" />
                    <CardTitle>Advanced 3D Visualization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Our system provides interactive 3D models of storage containers and cargo items for intuitive
                    spatial understanding.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Visualize your cargo in real-time and optimize space utilization with our cutting-edge technology.
                  </p>
                </CardContent>
              </Card>
            </AnimatedBorder>

            <AnimatedBorder animationType="pulse" pulseColor="space-purple">
              <Card className="border-0 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-space-purple" />
                    <CardTitle>AI-Powered Optimization</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Intelligent algorithms for optimal cargo placement and retrieval path planning save time and
                    resources.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Let our AI handle the complex calculations while you focus on mission-critical tasks.
                  </p>
                </CardContent>
              </Card>
            </AnimatedBorder>

            <AnimatedBorder animationType="pulse" pulseColor="space-teal">
              <Card className="border-0 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-space-teal" />
                    <CardTitle>Inventory Management</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Keep track of all cargo items with detailed information about location, expiry dates, and usage
                    limits.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Never lose track of critical supplies with our comprehensive inventory system.
                  </p>
                </CardContent>
              </Card>
            </AnimatedBorder>

            <AnimatedBorder animationType="pulse" pulseColor="space-orange">
              <Card className="border-0 h-full">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-space-orange" />
                    <CardTitle>Multi-User Collaboration</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    Seamless coordination between astronauts and ground control teams with real-time updates.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Collaborate effectively regardless of location with our synchronized platform.
                  </p>
                </CardContent>
              </Card>
            </AnimatedBorder>
          </div>

          <div className="text-center mb-8">
            <GlowingText className="text-2xl font-bold mb-4" glowColor="space-blue">
              Ready to experience it yourself?
            </GlowingText>
            <p className="text-muted-foreground mb-6">
              Try our system now with no registration required. Explore all features as an anonymous user.
            </p>
            <Button asChild size="lg" className="gap-2 bg-space-blue hover:bg-space-blue/90">
              <Link href="/dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span>Go to Dashboard</span>
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
