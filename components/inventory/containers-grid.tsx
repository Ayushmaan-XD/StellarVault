"use client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Package, Edit, Trash2, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { containersAPI } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ContainersGridProps {
  containers: any[]
  loading: boolean
}

export function ContainersGrid({ containers, loading }: ContainersGridProps) {
  const { toast } = useToast()

  // Update the handleDelete function and add a new handleViewDetails function
  const handleDelete = async (containerId: string) => {
    try {
      await containersAPI.delete(containerId)
      toast({
        title: "Container Deleted",
        description: "The container has been successfully deleted.",
      })
      // Refresh the page to update the data
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the container. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add this new function to handle the view details button
  const handleViewDetails = (containerId: string) => {
    // Navigate to the container details page
    window.location.href = `/inventory/container/${containerId}`
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-1/3" />
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (containers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <Package className="mb-2 h-8 w-8 text-muted-foreground" />
        <h3 className="text-lg font-medium">No Containers Found</h3>
        <p className="text-sm text-muted-foreground">Add some containers to your inventory.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {containers.map((container) => (
        <Card key={container.containerId}>
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{container.containerId}</CardTitle>
                <Badge variant="outline" className="mt-1">
                  {container.zone}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Package className="mr-2 h-4 w-4" />
                    <span>View Contents</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(container.containerId)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p>
                  {container.width} × {container.depth} × {container.height} cm
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Items</p>
                <p>{container.itemCount}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Space Utilization</span>
                <span
                  className={
                    container.utilization > 80
                      ? "text-destructive"
                      : container.utilization > 60
                        ? "text-space-orange"
                        : "text-space-teal"
                  }
                >
                  {container.utilization}%
                </span>
              </div>
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
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => handleViewDetails(container.containerId)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
