import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RevealText } from "@/components/ui/animated-text"
import { AnimatedBorder } from "@/components/ui/animated-border"
import { Rocket, Package, Users, Globe, Star } from "lucide-react"

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <RevealText>About StellarVault</RevealText>
          </h1>
          <p className="text-muted-foreground">
            <RevealText direction="up" delay={200}>
              Learn more about our mission, goals, and the technology behind our system.
            </RevealText>
          </p>
        </div>

        <AnimatedBorder
          animationType="gradient"
          gradientColors={["from-space-blue", "via-space-purple", "to-space-teal"]}
        >
          <Card className="border-0 overflow-hidden">
            <CardHeader className="space-gradient text-white">
              <CardTitle className="text-2xl">Our Mission</CardTitle>
              <CardDescription className="text-white/80">Revolutionizing storage management in space</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <p>
                StellarVault was developed to address the unique challenges of organizing, tracking, and optimizing
                storage in the confined and weightless environment of space stations. Our system provides astronauts and
                ground control with real-time visibility into inventory, streamlines retrieval processes, and ensures
                efficient use of limited storage space.
              </p>

              <p>
                With the increasing duration of space missions and the growing complexity of space station operations,
                effective storage management has become critical to mission success. Our system combines advanced 3D
                visualization, AI-powered optimization, and intuitive interfaces to make storage operations in space as
                efficient as possible.
              </p>
            </CardContent>
          </Card>
        </AnimatedBorder>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatedBorder animationType="pulse" pulseColor="space-blue">
            <Card className="border-0 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-space-blue" />
                  <CardTitle>Key Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Package className="h-5 w-5 text-space-purple mt-0.5" />
                  <div>
                    <h3 className="font-medium">3D Visualization</h3>
                    <p className="text-sm text-muted-foreground">
                      Interactive 3D models of storage containers and cargo items for intuitive spatial understanding
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-space-orange mt-0.5" />
                  <div>
                    <h3 className="font-medium">AI-Powered Optimization</h3>
                    <p className="text-sm text-muted-foreground">
                      Intelligent algorithms for optimal cargo placement and retrieval path planning
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-space-teal mt-0.5" />
                  <div>
                    <h3 className="font-medium">Multi-User Collaboration</h3>
                    <p className="text-sm text-muted-foreground">
                      Seamless coordination between astronauts and ground control teams
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedBorder>

          <AnimatedBorder animationType="pulse" pulseColor="space-purple">
            <Card className="border-0 h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-space-purple" />
                  <CardTitle>Technology Stack</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Our system is built using cutting-edge technologies to ensure reliability, performance, and ease of
                  use:
                </p>

                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <span className="font-medium">Frontend:</span>
                    <span className="text-muted-foreground"> React, Next.js, Three.js for 3D visualization</span>
                  </li>
                  <li>
                    <span className="font-medium">Backend:</span>
                    <span className="text-muted-foreground"> Node.js with real-time data synchronization</span>
                  </li>
                  <li>
                    <span className="font-medium">AI Components:</span>
                    <span className="text-muted-foreground"> TensorFlow for optimization algorithms</span>
                  </li>
                  <li>
                    <span className="font-medium">Data Storage:</span>
                    <span className="text-muted-foreground"> Distributed database with offline capabilities</span>
                  </li>
                </ul>

                <p className="text-sm text-muted-foreground mt-4">
                  The system is designed to operate in the challenging environment of space, with considerations for
                  limited bandwidth, high reliability requirements, and the unique constraints of space-based computing.
                </p>
              </CardContent>
            </Card>
          </AnimatedBorder>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Timeline</CardTitle>
            <CardDescription>Development history and future roadmap</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Separator className="absolute top-3 left-3 h-full w-[1px] bg-muted" />

              <div className="space-y-8 relative">
                <div className="pl-10 relative">
                  <div className="absolute left-[9px] top-3 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-space-blue"></div>
                  <h3 className="font-medium">2023 Q1: Project Inception</h3>
                  <p className="text-sm text-muted-foreground">
                    Initial concept development and requirements gathering
                  </p>
                </div>

                <div className="pl-10 relative">
                  <div className="absolute left-[9px] top-3 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-space-purple"></div>
                  <h3 className="font-medium">2023 Q3: Alpha Release</h3>
                  <p className="text-sm text-muted-foreground">First functional prototype deployed for testing</p>
                </div>

                <div className="pl-10 relative">
                  <div className="absolute left-[9px] top-3 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-space-teal"></div>
                  <h3 className="font-medium">2024 Q1: Beta Program</h3>
                  <p className="text-sm text-muted-foreground">Extended testing with selected partners</p>
                </div>

                <div className="pl-10 relative">
                  <div className="absolute left-[9px] top-3 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-space-orange"></div>
                  <h3 className="font-medium">2024 Q2: Full Launch</h3>
                  <p className="text-sm text-muted-foreground">Official release and deployment to space stations</p>
                </div>

                <div className="pl-10 relative">
                  <div className="absolute left-[9px] top-3 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-background bg-muted"></div>
                  <h3 className="font-medium">Future: Expansion</h3>
                  <p className="text-sm text-muted-foreground">Integration with lunar and Mars mission planning</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
