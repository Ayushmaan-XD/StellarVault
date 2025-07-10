import { type NextRequest, NextResponse } from "next/server"

interface Coordinates {
  width: number
  depth: number
  height: number
}

interface Position {
  startCoordinates: Coordinates
  endCoordinates: Coordinates
}

interface Item {
  itemId: string
  name: string
  width: number
  depth: number
  height: number
  priority: number
  expiryDate: string | null
  usageLimit: number
  preferredZone: string
}

interface Container {
  containerId: string
  zone: string
  width: number
  depth: number
  height: number
}

interface Placement {
  itemId: string
  containerId: string
  position: Position
}

interface Rearrangement {
  step: number
  action: "move" | "remove" | "place"
  itemId: string
  fromContainer: string
  fromPosition: Position
  toContainer: string
  toPosition: Position
}

interface PlacementRequest {
  items: Item[]
  containers: Container[]
}

interface PlacementResponse {
  success: boolean
  placements: Placement[]
  rearrangements: Rearrangement[]
}

export async function POST(request: NextRequest) {
  try {
    const body: PlacementRequest = await request.json()

    // Simple placement algorithm (in a real application, this would be more sophisticated)
    const placements: Placement[] = []
    const rearrangements: Rearrangement[] = []

    // Sort items by priority (highest first)
    const sortedItems = [...body.items].sort((a, b) => b.priority - a.priority)

    // Group containers by zone
    const containersByZone: Record<string, Container[]> = {}
    body.containers.forEach((container) => {
      if (!containersByZone[container.zone]) {
        containersByZone[container.zone] = []
      }
      containersByZone[container.zone].push(container)
    })

    // Place items
    sortedItems.forEach((item) => {
      // Try to place in preferred zone first
      let placed = false

      const preferredContainers = containersByZone[item.preferredZone] || []
      for (const container of preferredContainers) {
        // Simple placement at (0,0,0) - in a real app, we'd check for collisions
        if (item.width <= container.width && item.depth <= container.depth && item.height <= container.height) {
          placements.push({
            itemId: item.itemId,
            containerId: container.containerId,
            position: {
              startCoordinates: { width: 0, depth: 0, height: 0 },
              endCoordinates: {
                width: item.width,
                depth: item.depth,
                height: item.height,
              },
            },
          })
          placed = true
          break
        }
      }

      // If not placed in preferred zone, try other zones
      if (!placed) {
        for (const zone in containersByZone) {
          if (zone === item.preferredZone) continue

          const containers = containersByZone[zone]
          for (const container of containers) {
            if (item.width <= container.width && item.depth <= container.depth && item.height <= container.height) {
              placements.push({
                itemId: item.itemId,
                containerId: container.containerId,
                position: {
                  startCoordinates: { width: 0, depth: 0, height: 0 },
                  endCoordinates: {
                    width: item.width,
                    depth: item.depth,
                    height: item.height,
                  },
                },
              })

              // Add a rearrangement since we're not using preferred zone
              rearrangements.push({
                step: rearrangements.length + 1,
                action: "place",
                itemId: item.itemId,
                fromContainer: "",
                fromPosition: {
                  startCoordinates: { width: 0, depth: 0, height: 0 },
                  endCoordinates: { width: 0, depth: 0, height: 0 },
                },
                toContainer: container.containerId,
                toPosition: {
                  startCoordinates: { width: 0, depth: 0, height: 0 },
                  endCoordinates: {
                    width: item.width,
                    depth: item.depth,
                    height: item.height,
                  },
                },
              })

              placed = true
              break
            }
          }

          if (placed) break
        }
      }
    })

    const response: PlacementResponse = {
      success: true,
      placements,
      rearrangements,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in placement API:", error)
    return NextResponse.json({ success: false, error: "Failed to process placement request" }, { status: 500 })
  }
}
