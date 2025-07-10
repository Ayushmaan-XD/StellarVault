"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Package, ArrowLeft, Trash2, Edit, Plus } from "lucide-react"
import { containersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { InventoryTable } from "@/components/inventory/inventory-table"
import { Skeleton } from "@/components/ui/skeleton"
import { AnimatedBorder } from "@/components/ui/animated-border"

export default function ContainerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [container, setContainer] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const containerId = typeof params.id === "string" ? params.id : params.id?.[0] || ""

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const response = await containersAPI.getById(containerId)
        setContainer(response.container)
        setItems(response.items)
      } catch (error) {
        console.error("Error fetching container details:", error)
        toast({
          title: "Error",
          description: "Failed to load container details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (containerId) {
      fetchData()
    }
  }, [containerId, toast])

  const handleBack = () => {
    router.back()
  }

  const handleDelete = async () => {
    if (!container) return

    if (items.length > 0) {
      toast({
        title: "Cannot Delete",
        description: "This container has items. Please remove all items first.",
        variant: "destructive",
      })
      return
    }

    try {
      await containersAPI.delete(containerId)
      toast({
        title: "Container Deleted",
        description: "The container has been successfully deleted.",
      })
      router.push("/inventory")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the container. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAddItem = () => {
    // Store the container ID in session storage to pre-select it in the add item form
    sessionStorage.setItem("selectedContainerId", containerId)
    router.push("/inventory?addItem=true")
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Container Details</h1>
              <p className="text-muted-foreground">View and manage container information</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-2" onClick={handleAddItem}>
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
            <Button variant="destructive" size="sm" className="gap-2" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : container ? (
          <>
            <AnimatedBorder animationType="pulse" pulseColor="space-blue">
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-space-blue" />
                    Container: {container.containerId}
                  </CardTitle>
                  <CardDescription>Zone: {container.zone}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Dimensions</h3>
                      <p className="text-2xl font-bold">
                        {container.width} × {container.depth} × {container.height} cm
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Volume: {container.width * container.depth * container.height} cm³
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Weight</h3>
                      <p className="text-2xl font-bold">
                        {container.currentWeight} / {container.maxWeight} kg
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Available: {container.maxWeight - container.currentWeight} kg
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Items</h3>
                      <p className="text-2xl font-bold">{container.itemCount}</p>
                      <p className="text-xs text-muted-foreground">Total items in container</p>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Space Utilization</h3>
                      <p className="text-2xl font-bold">{container.utilization}%</p>
                      <Progress
                        value={container.utilization}
                        className={
                          container.utilization > 80
                            ? "bg-muted [&>div]:bg-destructive"
                            : container.utilization > 60
                              ? "bg-muted [&>div]:bg-space-orange"
                              : "bg-muted [&>div]:bg-space-teal"
                        }
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Items in Container</h3>
                    {items.length > 0 ? (
                      <InventoryTable items={items} loading={false} />
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <Package className="mb-2 h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-medium">No Items Found</h3>
                        <p className="text-sm text-muted-foreground">
                          This container is empty. Add some items to get started.
                        </p>
                        <Button className="mt-4" onClick={handleAddItem}>
                          Add Item
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </AnimatedBorder>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <Package className="mb-2 h-8 w-8 text-muted-foreground" />
            <h3 className="text-lg font-medium">Container Not Found</h3>
            <p className="text-sm text-muted-foreground">
              The container you're looking for doesn't exist or has been deleted.
            </p>
            <Button className="mt-4" onClick={handleBack}>
              Back to Inventory
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
