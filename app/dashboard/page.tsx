"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, AlertTriangle, CheckCircle } from "lucide-react"
import { SpaceStationVisualization } from "@/components/space-station-visualization"
import { AnimatedBorder, AnimatedGlow } from "@/components/ui/animated_border"
import { RevealText, GlowingText } from "@/components/ui/animated-text"
import { itemsAPI, activitiesAPI, containersAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { PriorityItemsList } from "@/components/dashboard/priority-items-list"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalItems: 0,
    spaceUtilization: 0,
    expiringItems: 0,
    wasteItems: 0,
  })
  const [activities, setActivities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch items and containers
        const [itemsResponse, containersResponse] = await Promise.all([itemsAPI.getAll(), containersAPI.getAll()])

        const items = itemsResponse.items
        const containers = containersResponse.containers

        // Calculate stats
        const totalItems = items.length
        const wasteItems = items.filter((item) => item.isWaste).length

        // Calculate space utilization based on actual container data
        let totalUtilization = 0
        if (containers.length > 0) {
          // Calculate average utilization across all containers
          totalUtilization = containers.reduce((sum, container) => sum + container.utilization, 0) / containers.length
        }

        // Get current date and date 7 days from now
        const currentDate = new Date()
        const nextWeek = new Date()
        nextWeek.setDate(nextWeek.getDate() + 7)

        // Count items expiring in the next 7 days
        const expiringItems = items.filter((item) => {
          if (!item.expiryDate) return false
          const expiryDate = new Date(item.expiryDate)
          return expiryDate > currentDate && expiryDate <= nextWeek
        }).length

        // Fetch recent activities
        const activitiesResponse = await activitiesAPI.getAll({ limit: 4 })

        setStats({
          totalItems,
          spaceUtilization: Math.round(totalUtilization), // Use actual calculated value
          expiringItems,
          wasteItems,
        })

        setActivities(activitiesResponse.activities)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <RevealText>Dashboard</RevealText>
          </h1>
          <p className="text-muted-foreground">
            <RevealText direction="up" delay={200}>
              Overview of the space station cargo management system.
            </RevealText>
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <AnimatedBorder animationType="pulse" pulseColor="space-blue" pulseSpeed={2}>
            <Card className="border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    <GlowingText className="text-foreground dark:text-white">{stats.totalItems}</GlowingText>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Current inventory count</p>
              </CardContent>
            </Card>
          </AnimatedBorder>

          <AnimatedBorder animationType="pulse" pulseColor="space-teal" pulseSpeed={2}>
            <Card className="border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Space Utilization</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    <GlowingText className="text-foreground dark:text-white" glowColor="space-teal">
                      {stats.spaceUtilization}%
                    </GlowingText>
                  </div>
                )}
                <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-space-teal relative transition-all duration-500 ease-in-out"
                    style={{ width: `${stats.spaceUtilization}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-space-teal/50 to-space-teal bg-[length:200%_100%] animate-gradient-x"></div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Average container utilization</p>
              </CardContent>
            </Card>
          </AnimatedBorder>

          <AnimatedBorder animationType="pulse" pulseColor="space-orange" pulseSpeed={2}>
            <Card className="border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    <GlowingText className="text-foreground dark:text-white" glowColor="space-orange">
                      {stats.expiringItems}
                    </GlowingText>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Items expiring in 7 days</p>
              </CardContent>
            </Card>
          </AnimatedBorder>

          <AnimatedBorder animationType="pulse" pulseColor="space-red" pulseSpeed={2}>
            <Card className="border-0">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Waste Items</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <div className="text-2xl font-bold">
                    <GlowingText className="text-foreground dark:text-white" glowColor="space-red">
                      {stats.wasteItems}
                    </GlowingText>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Ready for disposal</p>
              </CardContent>
            </Card>
          </AnimatedBorder>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatedGlow className="col-span-1 md:col-span-2" glowColor="space-blue" glowOpacity={0.1}>
            <Card className="border-0">
              <CardHeader>
                <CardTitle>
                  <RevealText>Space Station Visualization</RevealText>
                </CardTitle>
                <CardDescription>
                  <RevealText delay={200}>3D view of the current cargo arrangement</RevealText>
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[16/9] w-full overflow-hidden rounded-b-lg">
                  <SpaceStationVisualization />
                </div>
              </CardContent>
            </Card>
          </AnimatedGlow>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AnimatedBorder
            animationType="gradient"
            gradientColors={["from-space-blue", "via-space-purple", "to-space-teal"]}
          >
            <Card className="border-0">
              <CardHeader>
                <CardTitle>
                  <RevealText>Recent Activities</RevealText>
                </CardTitle>
                <CardDescription>
                  <RevealText delay={200}>Latest cargo operations</RevealText>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-3 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.length > 0 ? (
                      activities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="rounded-full bg-muted p-2">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              {activity.details ||
                                `${activity.userName} performed ${activity.action} on ${activity.itemName}`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground">No recent activities</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </AnimatedBorder>

          <AnimatedBorder animationType="radar" pulseColor="space-purple">
            <Card className="border-0">
              <CardHeader>
                <CardTitle>
                  <RevealText>Priority Items</RevealText>
                </CardTitle>
                <CardDescription>
                  <RevealText delay={200}>High priority items that need attention</RevealText>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PriorityItemsList />
              </CardContent>
            </Card>
          </AnimatedBorder>
        </div>
      </div>
    </DashboardLayout>
  )
}
