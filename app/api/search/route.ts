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
  containerId: string
  zone: string
  position: Position
}

interface RetrievalStep {
  step: number
  action: "remove" | "setAside" | "retrieve" | "placeBack"
  itemId: string
  itemName: string
}

interface SearchResponse {
  success: boolean
  found: boolean
  item?: Item
  retrievalSteps?: RetrievalStep[]
}

// Mock database of items
const items = [
  {
    itemId: "001",
    name: "Food Packet",
    containerId: "contA",
    zone: "Crew Quarters",
    position: {
      startCoordinates: { width: 10, depth: 20, height: 30 },
      endCoordinates: { width: 20, depth: 30, height: 50 },
    },
  },
  {
    itemId: "002",
    name: "Oxygen Cylinder",
    containerId: "contB",
    zone: "Airlock",
    position: {
      startCoordinates: { width: 5, depth: 10, height: 15 },
      endCoordinates: { width: 20, depth: 25, height: 65 },
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const itemId = searchParams.get("itemId")
    const itemName = searchParams.get("itemName")

    if (!itemId && !itemName) {
      return NextResponse.json({ success: false, error: "Either itemId or itemName must be provided" }, { status: 400 })
    }

    // Find the item
    const item = items.find(
      (item) =>
        (itemId && item.itemId === itemId) || (itemName && item.name.toLowerCase().includes(itemName.toLowerCase())),
    )

    if (!item) {
      return NextResponse.json({
        success: true,
        found: false,
      })
    }

    // Generate retrieval steps (simplified)
    const retrievalSteps: RetrievalStep[] = [
      {
        step: 1,
        action: "remove",
        itemId: "005",
        itemName: "Water Container",
      },
      {
        step: 2,
        action: "setAside",
        itemId: "005",
        itemName: "Water Container",
      },
      {
        step: 3,
        action: "retrieve",
        itemId: item.itemId,
        itemName: item.name,
      },
      {
        step: 4,
        action: "placeBack",
        itemId: "005",
        itemName: "Water Container",
      },
    ]

    const response: SearchResponse = {
      success: true,
      found: true,
      item,
      retrievalSteps,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in search API:", error)
    return NextResponse.json({ success: false, error: "Failed to process search request" }, { status: 500 })
  }
}
